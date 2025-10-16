const http = require('http');
const PORT = process.env.PORT || 3000;

function pageTemplate({ title, heading, subheading, paragraphs = [] }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
  <h1>${heading}</h1>
  <h2>${subheading}</h2>
  ${paragraphs.map(p => `<p>${p}</p>`).join('\n')}
</body>
</html>`;
}

function environmentMessage(req) {
  const ua = req.headers['user-agent'] || '';
  const langHeader = req.headers['accept-language'] || 'en';
  const primaryLang = langHeader.split(',')[0].toLowerCase();
  const isMobile = /mobile|iphone|android/i.test(ua);
  const device = isMobile ? 'mobile' : 'desktop';
  return [
    `User-Agent: ${ua}`,
    `Primary language (from Accept-Language): ${primaryLang}`,
    `Detected device type: ${device}`,
    `HTTP method: ${req.method}`,
    `Requested URL: ${req.url}`,
    `HTTP version: ${req.httpVersion}`
  ];
}

const server = http.createServer((req, res) => {
  console.log(req);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  const ua = req.headers['user-agent'] || '';
  const isMobile = /mobile|iphone|android/i.test(ua);

  if (req.url === '/' || req.url.startsWith('/home')) {
    const html = pageTemplate({
      title: 'Halit Ozger — Home',
      heading: 'Halit Ozger',
      subheading: 'Computer Science (Year 3), Goldsmiths, University of London',
      paragraphs: [
        'Welcome! This is my simple Node.js web application for coursework assessment.',
        'I am a third-year Computer Science student at Goldsmiths. I enjoy building clean, minimal web apps and exploring problem solving.',
        isMobile
          ? 'You appear to be browsing from a mobile device; content has been kept concise.'
          : 'You appear to be on a desktop device; enjoy the full layout.',
        'Tip: Try visiting /about or /env, or add ?mode=min to the URL for a minimal view.',
        ...environmentMessage(req)
      ]
    });
    res.end(html);
    return;
  }

  if (req.url.startsWith('/about')) {
    const minimal = req.url.includes('mode=min');
    const html = pageTemplate({
      title: 'About — Halit Ozger',
      heading: 'About Me',
      subheading: 'Background & Interests',
      paragraphs: minimal
        ? [
            'I am Halit Ozger, a CS Year 3 student at Goldsmiths, University of London.',
            'This project is a simple Node.js HTTP server built for assessment.',
            ...environmentMessage(req)
          ]
        : [
            'I am Halit Ozger, a CS Year 3 student at Goldsmiths, University of London.',
            'Academic interests: software engineering fundamentals, algorithms, and building small but robust services. I love football',
            'This web app demonstrates a minimal custom HTTP server that returns a properly structured HTML document.',
            ...environmentMessage(req)
          ]
    });
    res.end(html);
    return;
  }

  if (req.url.startsWith('/env')) {
    const html = pageTemplate({
      title: 'Environment — Halit Ozger',
      heading: 'Environment-Aware Page',
      subheading: 'Conditional Content Based on Request',
      paragraphs: [
        'Below is information derived from the HTTP request. This illustrates how we can adapt content based on user environment and URL.',
        ...environmentMessage(req)
      ]
    });
    res.end(html);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  const notFound = pageTemplate({
    title: '404 Not Found',
    heading: '404 — Not Found',
    subheading: 'The page you requested does not exist.',
    paragraphs: [
      'Try visiting /, /about, or /env.',
      ...environmentMessage(req)
    ]
  });
  res.end(notFound);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});