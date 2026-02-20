const http = require("http");
const { parse } = require("url");
const { highlights, stories, metrics } = require("./data");

const PORT = process.env.PORT || 4000;

const savedMessages = [];

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function handleOptions(res) {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Length": "0"
  });
  res.end();
}

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url, true);

  if (req.method === "OPTIONS") {
    handleOptions(res);
    return;
  }

  if (req.method === "GET" && pathname === "/api/highlights") {
    sendJson(res, 200, { highlights });
    return;
  }

  if (req.method === "GET" && pathname === "/api/stories") {
    sendJson(res, 200, { stories });
    return;
  }

  if (req.method === "GET" && pathname === "/api/metrics") {
    sendJson(res, 200, { metrics });
    return;
  }

  if (req.method === "POST" && pathname === "/api/contact") {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk;
    });

    req.on("end", () => {
      try {
        const data = rawBody ? JSON.parse(rawBody) : {};
        const message = {
          id: savedMessages.length + 1,
          name: data.name?.trim() || "Anonymous",
          email: data.email?.trim() || "unspecified",
          organization: data.organization?.trim() || "",
          message: data.message?.trim() || "",
          createdAt: new Date().toISOString()
        };
        savedMessages.push(message);
        sendJson(res, 201, {
          status: "received",
          message: "Thank you for reaching out! Our team will follow up soon.",
          entry: message
        });
      } catch (error) {
        sendJson(res, 400, { error: "Invalid JSON payload" });
      }
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/contact") {
    sendJson(res, 200, { submissions: savedMessages });
    return;
  }

  res.writeHead(404, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`Global Voices API listening on port ${PORT}`);
});
