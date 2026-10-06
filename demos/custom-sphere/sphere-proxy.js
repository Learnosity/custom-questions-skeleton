// backend-proxy-example/sphere-proxy.js
//
// Reference implementation of the two endpoints question.js and scorer.js call.
// Adapt into your existing backend (routes shown as Express here) — the point is
// the *contract*, not the framework. Never expose ACCESS_TOKEN to the client.
//
// customer id: 45d18eb8 (hardcoded below for this POC)

const CUSTOMER_ID = '45d18eb8';
const ACCESS_TOKEN = '4a6aa3f36119d914e1492819a11fa0ad'; // POC only — see note above
const BASE_URL = `https://${CUSTOMER_ID}.problems.sphere-engine.com/api/v4`;

const express = require('express');
const router = express.Router();

// POST /sphere/submissions
// body: { source: string, compilerId: number, problemId: number }
// -> { id: number }
router.post('/submissions', express.json(), async (req, res) => {
  const { source, compilerId, problemId } = req.body || {};

  if (!source || !compilerId || !problemId) {
    return res.status(400).json({ error: 'source, compilerId and problemId are required' });
  }

  try {
    const form = new URLSearchParams();
    form.set('source', source);
    form.set('compilerId', String(compilerId));
    form.set('problemId', String(problemId));

    const sphereRes = await fetch(
      `${BASE_URL}/submissions?access_token=${ACCESS_TOKEN}`,
      { method: 'POST', body: form }
    );

    if (!sphereRes.ok) {
      const text = await sphereRes.text();
      return res.status(502).json({ error: 'sphere_engine_error', detail: text });
    }

    const data = await sphereRes.json();
    return res.json(data); // { id: <submissionId> }
  } catch (err) {
    return res.status(500).json({ error: 'proxy_error', detail: String(err) });
  }
});

// GET /sphere/submissions/:id
// -> raw Sphere Engine submission result JSON (executing, result.status, result.testCases, ...)
router.get('/submissions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sphereRes = await fetch(
      `${BASE_URL}/submissions/${id}?access_token=${ACCESS_TOKEN}`
    );

    if (!sphereRes.ok) {
      const text = await sphereRes.text();
      return res.status(502).json({ error: 'sphere_engine_error', detail: text });
    }

    const data = await sphereRes.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'proxy_error', detail: String(err) });
  }
});

module.exports = router;

// --- Mount in your app, e.g.: ---
// const sphereProxy = require('./backend-proxy-example/sphere-proxy');
// app.use('/sphere', sphereProxy);
//
// Also remember CORS: the browser calls this proxy directly from question.js,
// so add your Learnosity-hosted domain(s) to your CORS allow-list. See
// https://help.learnosity.com/hc/en-us/articles/360000757877 (Firewalls & Domain Whitelisting)
// for the reverse direction (Learnosity calling your hosted question.js/scorer.js files).
