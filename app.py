"""
FastAPI backend for Conversational IVR Modernization Framework (scaffold).

Endpoints:
- GET /health
- POST /vxml/webhook  - accepts simple VXML-like JSON and returns conversational reply
- GET /flows            - list sample flows
- GET /flows/{flow_id}  - return a converted flow JSON
- POST /nlu/process     - accepts text and returns intent/slots (simple rule-based)
- POST /audio/process   - placeholder for ASR/TTS (accepts file upload)

This scaffold implements a small session store and a simple keyword-based NLU.
Replace the NLU and audio handlers with production implementations (spaCy, Rasa,
OpenAI, or provider TTS/ASR) when ready.
"""
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import uuid

from ivr.vxml_adapter import to_canonical, from_canonical
from ivr.nlu import default_nlu
from ivr.session import store
from ivr.audio_service import recognize_speech_from_file, synthesize_speech_to_bytes
from ivr.config import PROJECT_NAME


app = FastAPI(title=f"{PROJECT_NAME} - Backend")


class VxmlEvent(BaseModel):
    sessionId: Optional[str] = None
    callId: Optional[str] = None
    event: Optional[str] = None
    dtmf: Optional[str] = None
    speech: Optional[str] = None
    text: Optional[str] = None
    metadata: Optional[dict] = None


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.post('/vxml/webhook')
async def vxml_webhook(event: VxmlEvent):
    vxml_dict = event.dict()
    canonical = to_canonical(vxml_dict)

    inp = canonical.get('input', {})
    reply_text = 'Sorry, I did not understand. Can you repeat?'
    if inp.get('value'):
        nlu = default_nlu.parse(inp['value'])
        intent = nlu['intent']
        if intent == 'check_balance':
            reply_text = 'Your current balance is $123.45.'
        elif intent == 'transfer':
            reply_text = 'To make a transfer, please provide destination account and amount.'
        elif intent == 'connect_agent':
            reply_text = 'Connecting you to an agent now.'
        else:
            reply_text = "I can help with balance, transfers, or connecting to an agent. What would you like?"

    resp = {'text': reply_text, 'actions': []}
    out = from_canonical(resp, vxml_dict)
    store.create(canonical['sessionId'])
    store.append_history(canonical['sessionId'], {'in': inp, 'out': resp})
    return JSONResponse({'success': True, 'vxml': out})


@app.get('/flows')
async def list_flows():
    flows_dir = os.path.join(os.getcwd(), 'flows', 'converted')
    flows = []
    if os.path.isdir(flows_dir):
        for f in os.listdir(flows_dir):
            if f.endswith('.json'):
                flows.append(f)
    return {'flows': flows}


@app.get('/flows/{flow_id}')
async def get_flow(flow_id: str):
    path = os.path.join(os.getcwd(), 'flows', 'converted', flow_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail='flow not found')
    return FileResponse(path, media_type='application/json')


@app.post('/nlu/process')
async def nlu_process(text: str = Form(...)):
    return default_nlu.parse(text)


@app.post('/audio/process')
async def audio_process(sessionId: Optional[str] = Form(None), audio: UploadFile = File(...)):
    # Placeholder: save file and return mock ASR + NLU result
    tmp_dir = os.path.join(os.getcwd(), 'tmp')
    os.makedirs(tmp_dir, exist_ok=True)
    tmp_path = os.path.join(tmp_dir, audio.filename)
    with open(tmp_path, 'wb') as f:
        f.write(await audio.read())

    # delegate to audio service (placeholder)
    transcript = recognize_speech_from_file(tmp_path)
    nlu = default_nlu.parse(transcript)
    reply_text = f'I heard: {transcript}'
    # optionally return TTS bytes
    tts_bytes = synthesize_speech_to_bytes(reply_text)
    # if TTS returns bytes, return them as a file-like response
    if isinstance(tts_bytes, (bytes, bytearray)) and len(tts_bytes) > 0:
        # write to temp file and return as audio/mpeg
        tts_path = os.path.join(tmp_dir, f'reply-{uuid.uuid4().hex}.mp3')
        with open(tts_path, 'wb') as f:
            f.write(tts_bytes)
        return FileResponse(tts_path, media_type='audio/mpeg')

    return {'sessionId': sessionId or 'unknown-session', 'transcript': transcript, 'nlu': nlu, 'reply': reply_text}
