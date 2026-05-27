const https = require('https');

const API_KEY     = '4jjecy44d0ksxmz0t0kjtpodups0fuob';
const CAMPAIGN_ID = 'fUgUh';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, phone, city, comment } = body;
  if (!name || !email) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  const payload = JSON.stringify({
    name,
    email,
    campaign: { campaignId: CAMPAIGN_ID },
    customFieldValues: [
      phone   ? { customFieldId: 'pjZdmg', value: [phone]   } : null,
      city    ? { customFieldId: 'pjZd98', value: [city]    } : null,
      comment ? { customFieldId: 'pjZdNt', value: [comment] } : null,
    ].filter(Boolean),
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.getresponse.com',
        path:     '/v3/contacts',
        method:   'POST',
        headers:  {
          'Content-Type':  'application/json',
          'X-Auth-Token':  `api-key ${API_KEY}`,
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 202) {
            resolve({ statusCode: 200, body: JSON.stringify({ ok: true }) });
          } else {
            resolve({ statusCode: 500, body: data });
          }
        });
      }
    );
    req.on('error', (err) => {
      resolve({ statusCode: 500, body: err.message });
    });
    req.write(payload);
    req.end();
  });
};
