const config = require('./config/config.json');
const os = require('os');
const { exec } = require("child_process");
const fs = require('fs');

const randomNum1 = Math.floor(1000 + Math.random() * 9000);
const randomNum2 = Math.floor(1000 + Math.random() * 9000);

const ipAddress = getIpAddress();
const username = os.userInfo().username;
let password = '';

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@@@@@@@';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

password = generateRandomString(8);

function getIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  let ipAddress = "Unknown";

  Object.keys(networkInterfaces).forEach(interfaceName => {
    const networkInterface = networkInterfaces[interfaceName];
    networkInterface.forEach(interfaceInfo => {
      if (!interfaceInfo.internal && interfaceInfo.family === "IPv4") {
        ipAddress = interfaceInfo.address;
      }
    });
  });

  return ipAddress;
}

"use strict";

const https = require('https');
const url = require("url");
const path = require("path");

const privateKey = fs.readFileSync("./server.key");
const certificate = fs.readFileSync("./server.crt");

const gradient = require("gradient-string");

const options = {
  key: privateKey,
  cert: certificate
};

const port = process.argv[2] || 443;
require("events").EventEmitter.prototype._maxListeners = 100;

const ifmaint = `server|${config.ip}
port|${config.port}
type|1
maint|Server is currently initializing or re-syncing with sub servers. Please try again in a minute.

beta_server|127.0.0.1
beta_port|17091
beta_type|1
beta2_server|127.0.0.1
beta2_port|17099
beta2_type|1
meta|${Math.floor(Date.now() / 1000)}
RTENDMARKERBS1001`;

const packet = `server|${config.ip}
port|${config.port}
type|1
#maint|Server is currently initializing or re-syncing with sub servers. Please try again in a minute.

beta_server|127.0.0.1
beta_port|17091
beta_type|1
beta2_server|127.0.0.1
beta2_port|17099
beta2_type|1
meta|${Math.floor(Date.now() / 1000)}
RTENDMARKERBS1001`;

const mimeTypes = {
  '.ico': "image/x-icon",
  '.html': "text/html",
  '.js': "text/javascript",
  '.json': "application/json",
  '.css': "text/css",
  '.png': "image/png",
  '.jpg': "image/jpeg",
  '.wav': 'audio/wav',
  '.mp3': "audio/mpeg",
  '.svg': 'image/svg+xml',
  '.pdf': "application/pdf",
  '.doc': "application/msword"
};

const server = https.createServer(options, (req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = `.${parsedUrl.pathname}`;
  const ext = path.parse(pathname).ext;

  console.log(`Connection Request from: ${req.connection.remoteAddress} URL: ${req.url} Method: ${req.method}`);

  let responsePacket = packet;

  if (fs.existsSync('main.txt')) {
    const mainStatus = fs.readFileSync('main.txt', 'utf8').trim();
    if (mainStatus === '1') {
      responsePacket = ifmaint;
    }
  }

  if (req.url === "/growtopia/server_data.php") {
    res.write(responsePacket, err => {
      if (err) console.log(err);
    });
    res.end();
  } else if (req.url.indexOf("/cache") !== -1) {
    console.log(`Connection from: ${req.connection.remoteAddress}\nDownloading: ${req.url}`);
    fs.exists(pathname, exists => {
      if (!exists) {
        res.writeHead(302, { 'Location': `https://ubistatic-a.akamaihd.net/${config.cdn}${req.url}` }).end();
        return;
      }
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("error from loading");
        } else {
          res.setHeader("Content-type", mimeTypes[ext] || "text/plain");
          res.end(data);
        }
      });
    });
  } else if (req.url.indexOf('/0098') !== -1) {
    console.log(`Connection from: ${req.connection.remoteAddress}\nDownloading: ${req.url}`);
    fs.exists(pathname, exists => {
      if (!exists) {
        res.writeHead(302, { 'Location': `https://ubistatic-a.akamaihd.net/${config.cdn}${req.url}` }).end();
        return;
      }
      fs.readFile(pathname, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end("error");
        } else {
          res.setHeader("Content-type", mimeTypes[ext] || "text/plain");
          res.end(data);
        }
      });
    });
  } else {
    res.statusCode = 302;
    res.end();
  }
});

server.listen(parseInt(port));
server.on("listening", () => {});
console.log(gradient("blue", "cyan")(
  "\n██╗    ██╗██████╗  █████╗ ██╗████████╗██╗  ██╗    ██╗  ██╗████████╗████████╗██████╗ \n" +
  "██║    ██║██╔══██╗██╔══██╗██║╚══██╔══╝██║  ██║    ██║ ██╔╝╚══██╔══╝╚══██╔══╝██╔══██╗\n" +
  "██║ █╗ ██║██████╔╝███████║██║   ██║   ███████║    █████╔╝    ██║      ██║   ██████╔╝\n" +
  "██║███╗██║██╔══██╗██╔══██║██║   ██║   ██╔══██║    ██╔═██╗    ██║      ██║   ██╔═══╝ \n" +
  "╚███╔███╔╝██║  ██║██║  ██║██║   ██║   ██║  ██║    ██║  ██╗   ██║      ██║   ██║     \n" +
  " ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚═╝     \n"
));
console.log("-HTTP STARTED");
console.log(`-Updated Version (main.txt) 1 = maint , 0 = play`)
console.log(`-Server Listening On Port ${port}`);
