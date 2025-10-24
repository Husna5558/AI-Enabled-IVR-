from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Gather
import requests

app = Flask(__name__)

# Replace with your AI middleware endpoint (ACS/BAP/LLM API)
AI_ENGINE_URL = "https://your-ai-backend-endpoint/acs-bap"

@app.route("/voice", methods=["POST"])
def voice():
    """Handles incoming voice calls from Twilio."""
    response = VoiceResponse()
    gather = Gather(input="speech", action="/process_speech", timeout=5)
    gather.say("Welcome to the modern conversational IVR. Please tell me how I can help you today.")
    response.append(gather)
    return Response(str(response), mimetype="text/xml")


@app.route("/process_speech", methods=["POST"])
def process_speech():
    """Takes user's voice input, sends to conversational AI, returns dynamic response."""
    user_input = request.values.get("SpeechResult", "")
    
    # Send the user's spoken text to ACS/BAP or AI layer
    payload = {"query": user_input, "source": "TwilioIVR"}
    try:
        ai_response = requests.post(AI_ENGINE_URL, json=payload, timeout=5)
        ai_text = ai_response.json().get("reply", "Sorry, there was a problem understanding you.")
    except Exception as e:
        ai_text = f"Error communicating with AI service: {str(e)}"

    # Speak back to the user
    response = VoiceResponse()
    response.say(ai_text)
    response.hangup()
    return Response(str(response), mimetype="text/xml")


@app.route("/", methods=["GET"])
def home():
    return "Conversational IVR Middleware is running."

if __name__ == "__main__":
    app.run(debug=True, port=5000)
