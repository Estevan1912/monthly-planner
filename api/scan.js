export const config = {
  api: { bodyParser: { sizeLimit: '20mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY is not set in Vercel environment variables. Add it in Vercel → Settings → Environment Variables.' } });
  }

  let upstream, data;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    data = await upstream.json();
  } catch (err) {
    return res.status(502).json({ error: { message: `Could not reach Anthropic API: ${err.message}` } });
  }

  res.status(upstream.status).json(data);
}
