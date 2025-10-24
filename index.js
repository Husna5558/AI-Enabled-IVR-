require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const { twiml: { VoiceResponse } } = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
// Twilio sends x-www-form-urlencoded payloads for voice webhooks
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health
app.get('/', (req, res) => {
  res.send('Conversational IVR Middleware is running');
});

// Entry-point for Twilio voice webhook
// This endpoint returns initial TwiML that starts a speech Gather
app.post('/twilio/voice', (req, res) => {
  const vr = new VoiceResponse();
  const gather = vr.gather({
    input: 'speech',
    action: '/twilio/voice/collect',
    method: 'POST',
    speechTimeout: 'auto'
  });
  gather.say('Welcome to the modernized IVR. Please say your account number or say help.');
  // If user doesn't say anything Twilio will submit empty speechResult - respond to that in /collect
  res.type('text/xml').send(vr.toString());
});

// Collect endpoint: Twilio posts speechResult or Digits here
app.post('/twilio/voice/collect', async (req, res) => {
  const speech = req.body.SpeechResult || req.body.Digits || '';
  console.log('User said / entered:', speech);

  // Send user speech to ACS/BAP connector
  try {
    const aiReply = await callConversationalAI(speech, req.body);
    const vr = new VoiceResponse();

    // Speak the AI reply
    vr.say(aiReply.reply || 'Sorry, I did not understand.');

    if (aiReply.end) {
      vr.say('Goodbye.');
      vr.hangup();
    } else {
      // Continue the conversation: gather again
      const gather = vr.gather({
        input: 'speech',
        action: '/twilio/voice/collect',
        method: 'POST',
        speechTimeout: 'auto'
      });
      gather.say(aiReply.prompt || 'Please say your next response.');
    }

    res.type('text/xml').send(vr.toString());
  } catch (err) {
    console.error('Error calling AI connector:', err && err.message);
    const vr = new VoiceResponse();
    vr.say('An error occurred while processing your request. Please try again later.');
    vr.hangup();
    res.type('text/xml').send(vr.toString());
  }
});

// Connector function: forwards the user speech to ACS or BAP.
// If ACS_URL is set it will POST there, otherwise it will call the local mock endpoint.
async function callConversationalAI(userSpeech, twilioMetadata = {}) {
  const payload = {
    text: userSpeech,
    metadata: {
      from: twilioMetadata.From,
      callSid: twilioMetadata.CallSid
    }
  };

  const target = process.env.ACS_URL || `http://localhost:${PORT}/mock/acs`;
  const resp = await axios.post(target, payload, { timeout: 5000 });
  return resp.data;
}

// Mock ACS endpoint for local testing. In production replace ACS_URL with real service.
app.post('/mock/acs', (req, res) => {
  const text = (req.body && req.body.text) || '';
  console.log('Mock ACS received:', text);

  // Very simple rule-based mock
  const lc = text.toLowerCase();
  if (!text || lc.trim().length === 0) {
    return res.json({ reply: 'I did not hear anything. Can you repeat that?', prompt: 'Please say your account number or say help.', end: false });
  }

  if (lc.includes('help')) {
    return res.json({ reply: 'We can help you check balance, make a payment, or speak to an agent. Which would you like?', prompt: 'Say balance, payment, or agent.', end: false });
  }

  if (lc.match(/balance|account balance/)) {
    return res.json({ reply: 'Your account balance is 125 dollars and 42 cents.', prompt: null, end: true });
  }

  if (lc.match(/agent|representative|human/)) {
    return res.json({ reply: 'Please hold while we transfer you to an agent.', prompt: null, end: true });
  }

  // Default fallback
  return res.json({ reply: `You said: ${text}. I can transfer to an agent or check your balance.`, prompt: 'Say balance, agent, or repeat.', end: false });
});

app.listen(PORT, () => {
  console.log(`Conversational IVR middleware listening on port ${PORT}`);
});
