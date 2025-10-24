I didn't get the azure phone number so i got with twilio 
my twilio phone number is:(831) 999-2788
the url is:https://demo.twilio.com/welcome/voice/



# Conversational IVR Middleware (Demo)

This project provides a minimal middleware API layer to connect legacy IVR flows (Voice/TwiML) to a Conversational AI backend (ACS/BAP). It includes a Twilio webhook interface and a mock ACS endpoint for local testing.

## What this implements
- Twilio voice webhook endpoints: `/twilio/voice` and `/twilio/voice/collect`.
- A simple connector function that forwards user speech to ACS (or a local mock if `ACS_URL` is not set).
- A rule-based `mock/acs` endpoint so you can validate the integration without a real Conversational AI.

## Files
- `index.js` - Express server with Twilio webhook and mock ACS.
- `package.json` - dependencies and scripts.
- `.env.example` - environment variables template.

## Quick start (Windows PowerShell)

1. Install dependencies

```powershell
cd "C:\Users\ammum\OneDrive\Desktop\AI_enabledivr"
npm install
```

2. Copy env file and optionally set `ACS_URL` if you have a real AI endpoint

```powershell
cp .env.example .env
# edit .env if needed
notepad .env
```

3. Run the server

```powershell
npm start
```

4. Expose your local server to the internet (so Twilio can reach it)

Download and run ngrok (https://ngrok.com). Then:

```powershell
ngrok http 3000
```

Note the forwarding HTTPS URL from ngrok (e.g. `https://abcd1234.ngrok.io`).

5. Configure your Twilio phone number

In the Twilio Console, open your phone number settings and set the Voice webhook (A CALL COMES IN) to:

  https://<your-ngrok-subdomain>.ngrok.io/twilio/voice

Method: POST

6. Test a call

Call your Twilio number. The middleware will start a speech gather and forward recognized speech to the mock ACS. The mock returns replies that the middleware speaks back.

## How it works (short)

- Twilio posts call events (form-encoded) to `/twilio/voice`.
- The middleware responds with TwiML instructions to prompt the caller and collect speech.
- Twilio sends the collected speech to `/twilio/voice/collect`.
- The middleware forwards user speech to ACS (`ACS_URL`) or the local mock `/mock/acs`.
- ACS responds with a JSON payload { reply, prompt, end }. Middleware turns that into TwiML.

## Next steps / production considerations

- Implement Twilio request signature validation.
- Replace mock ACS with real ACS/BAP connectors (OAuth/auth, JSON mapping).
- Support VXML translation when ingesting legacy VXML assets.
- Add logging, observability and retry policies for the ACS/BAP calls.

## Sample test cases

- Say "help" → should prompt options like balance/payment/agent.
- Say "balance" → mock will reply with an account balance and end the call.

Enjoy! If you want, I can extend this to translate VXML scripts to conversational flows, add WebSocket/SSE for real-time data, or wire a real ACS integration.

