// Vercel serverless function: receives the Request Access form and forwards it
// to the GHL Inbound Webhook. The webhook URL lives only in Vercel's
// Environment Variables (GHL_WEBHOOK_URL), never in this public repo.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const webhook = process.env.GHL_WEBHOOK_URL;
  if (!webhook) return res.status(500).json({ ok: false, error: 'webhook_not_configured' });

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Spam trap filled in: report success, send nothing.
  if (clean(body.website)) return res.status(200).json({ ok: true });

  const lead = {
    first_name:   clean(body.first_name, 100),
    last_name:    clean(body.last_name, 100),
    email:        clean(body.email).toLowerCase(),
    phone:        clean(body.phone, 40),
    company_name: clean(body.company_name),
    message:      clean(body.message, 2000),
    source:       'TSL Linktree - Business Software Request Access',
    submitted_at: new Date().toISOString(),
  };

  if (!lead.first_name || !EMAIL_RE.test(lead.email)) {
    return res.status(400).json({ ok: false, error: 'invalid_input' });
  }

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!r.ok) return res.status(502).json({ ok: false, error: 'webhook_failed' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'webhook_unreachable' });
  }
};
