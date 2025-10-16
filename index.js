const http = require("http");
const PORT = process.env.PORT || 3000;

function pageTemplate({ title, heading, subheading, paragraphs = [] }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #f2f2f2;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 20px;
      overflow-x: hidden;
      animation: fadeInBody 1s ease;
    }

    @keyframes fadeInBody {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    main {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      padding: 40px 50px;
      max-width: 850px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.8s ease forwards;
      transform: translateY(30px);
      opacity: 0;
    }

    @keyframes slideUp {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
      background: linear-gradient(to right, #00d2ff, #3a7bd5);
      -webkit-background-clip: text;
      color: transparent;
      margin-bottom: 10px;
    }

    h2 {
      text-align: center;
      font-weight: 400;
      font-size: 1.2rem;
      color: #ccc;
      margin-bottom: 25px;
    }

    nav {
      text-align: center;
      margin-bottom: 30px;
    }

    nav a {
      color: #00d2ff;
      text-decoration: none;
      margin: 0 12px;
      font-weight: 600;
      position: relative;
      transition: color 0.3s;
    }

    nav a::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -3px;
      width: 0;
      height: 2px;
      background: #00d2ff;
      transition: width 0.3s;
    }

    nav a:hover {
      color: #3a7bd5;
    }

    nav a:hover::after {
      width: 100%;
    }

    p {
      margin-bottom: 15px;
      font-size: 1.05rem;
      color: #e6e6e6;
      line-height: 1.7;
      animation: fadeInText 1s ease forwards;
    }

    @keyframes fadeInText {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    footer {
      text-align: center;
      margin-top: 30px;
      font-size: 0.9rem;
      color: #aaa;
      animation: fadeInText 1.2s ease forwards;
    }

    a {
      color: #00d2ff;
      font-weight: 600;
    }

    a:hover {
      color: #3a7bd5;
    }

    @media (max-width: 600px) {
      main {
        padding: 25px;
      }
      h1 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <a href="/">Home</a> |
      <a href="/about">About</a> |
      <a href="/env">Environment</a>
    </nav>
    <h1>${heading}</h1>
    <h2>${subheading}</h2>
    ${paragraphs.map(p => `<p>${p}</p>`).join("\n")}
    <footer>© ${new Date().getFullYear()} Halit Ozger</footer>
  </main>
</body>
</html>`;
}

function environmentMessage(req) {
  const ua = req.headers["user-agent"] || "";
  const langHeader = req.headers["accept-language"] || "en";
  const primaryLang = langHeader.split(",")[0].toLowerCase();
  const isMobile = /mobile|iphone|android/i.test(ua);
  const device = isMobile ? "mobile" : "desktop";

  return [
    `User-Agent: ${ua}`,
    `Primary language: ${primaryLang}`,
    `Detected device: ${device}`,
    `HTTP method: ${req.method}`,
    `Requested URL: ${req.url}`,
    `HTTP version: ${req.httpVersion}`,
  ];
}

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const ua = req.headers["user-agent"] || "";
  const isMobile = /mobile|iphone|android/i.test(ua);

  if (req.url === "/" || req.url === "/home") {
    const html = pageTemplate({
      title: "Halit Ozger — Home",
      heading: "Halit Ozger",
      subheading: "Computer Science (Year 3), Goldsmiths, University of London",
      paragraphs: [
        "Welcome to my professional Node.js web application built for coursework.",
        "I specialize in software engineering, algorithms, and building minimal yet powerful web systems.",
        isMobile
          ? "You are browsing from a mobile device — content is optimized for compact view."
          : "You are browsing from a desktop — enjoy full-width design and visual effects.",
        'Explore more: <a href="/about">About</a> | <a href="/env">Environment</a>',
        ...environmentMessage(req),
      ],
    });
    res.statusCode = 200;
    res.end(html);
    return;
  }

  if (req.url.startsWith("/about")) {
    const minimal = req.url.includes("mode=min");
    const html = pageTemplate({
      title: "About — Halit Ozger",
      heading: "About Me",
      subheading: "Background & Interests",
      paragraphs: minimal
        ? [
            "I am Halit Ozger, a CS Year 3 student at Goldsmiths, University of London.",
            "This project demonstrates server-side rendering with Node.js.",
            ...environmentMessage(req),
          ]
        : [
            "I am Halit Ozger, a CS Year 3 student at Goldsmiths, University of London.",
            "My academic focus areas include computer logic, cybersecurity, and creative web applications.",
            "I also have hands-on experience building games, apps, and web tools using JavaScript, Node.js, and Python.",
            ...environmentMessage(req),
          ],
    });
    res.statusCode = 200;
    res.end(html);
    return;
  }

  if (req.url.startsWith("/env")) {
    const html = pageTemplate({
      title: "Environment — Halit Ozger",
      heading: "Environment Data",
      subheading: "Dynamic Response Based on Request Info",
      paragraphs: [
        "Below is dynamically generated data based on your request environment:",
        ...environmentMessage(req),
      ],
    });
    res.statusCode = 200;
    res.end(html);
    return;
  }

  const notFound = pageTemplate({
    title: "404 Not Found",
    heading: "404 — Page Not Found",
    subheading: "Oops! The page you’re looking for doesn’t exist.",
    paragraphs: [
      'Try visiting <a href="/">Home</a>, <a href="/about">About</a>, or <a href="/env">Environment</a>.',
      ...environmentMessage(req),
    ],
  });
  res.statusCode = 404;
  res.end(notFound);
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});