const express = require('express');
const router = express.Router();

// Twilio helper.  If you haven't already installed it use:
//    cd backend && npm install twilio
const twilio = require('twilio');

// configuration comes from environment variables
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const WHATSAPP_FROM = process.env.WHATSAPP_FROM || 'whatsapp:+14155238886';

// create client lazily so the module can be required even when vars are missing
let twilioClient = null;
function getTwilioClient() {
  if (!twilioClient) {
    if (!TWILIO_SID || !TWILIO_TOKEN) {
      throw new Error('Twilio SID and token must be set in environment');
    }
    twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
  }
  return twilioClient;
}

// POST /api/whatsapp
// body: { to: 'whatsapp:+549112345678', message: 'Texto a enviar' }
// optional: contentSid and contentVariables for template messages
router.post('/', async (req, res) => {
  try {
    const { to, message, contentSid, contentVariables } = req.body;

    if (!to) {
      return res.status(400).json({ success: false, error: 'Campo "to" es requerido' });
    }

    const client = getTwilioClient();

    const params = {
      from: WHATSAPP_FROM,
      to,
    };

    if (contentSid) {
      params.contentSid = contentSid;
      if (contentVariables) {
        params.contentVariables = typeof contentVariables === 'object'
          ? JSON.stringify(contentVariables)
          : contentVariables;
      }
    } else {
      params.body = message || '';
    }

    const msg = await client.messages.create(params);
    return res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error('Error sending WhatsApp message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
