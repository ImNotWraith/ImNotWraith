Growtopia Private Server HTTP Server
This project provides a basic HTTP server for a Growtopia private server. The server handles Growtopia's server_data.php requests and serves static files required by the game. It's designed to work with a private server setup for Growtopia.

Features
HTTPS Support: Secure your server with SSL/TLS using server.key and server.crt.
Dynamic Response Handling: Serve different responses based on server status.
Static File Serving: Serve static assets like images and scripts.
Maintenance Mode: Serve a maintenance message when the server is in maintenance mode.
Prerequisites
Node.js: Make sure Node.js is installed on your system. You can download it from Node.js official website.

Required Files:

server.key: SSL private key.
server.crt: SSL certificate.
config/config.json: Configuration file containing server IP and port details.
Installation
Clone the Repository

bash
Copy code
git clone https://github.com/yourusername/growtopia-private-server-http.git
cd growtopia-private-server-http
Install Dependencies

bash
Copy code
npm install
Configure Server

Edit config/config.json to match your server details. Example:

json
Copy code
{
  "ip": "127.0.0.1",
  "port": 443,
  "cdn": "path/to/cdn"
}
Make sure you have the server.key and server.crt files in the project directory.

Usage
Start the Server

Run the server using Node.js:

bash
Copy code
node server.js [port]
Replace [port] with the port number you want the server to listen on. Default is 443.

Check Server Status

The server responds with Growtopia server data when accessed at /growtopia/server_data.php. The server is also capable of serving static files from the /cache and /0098 endpoints.

If main.txt exists and contains 1, the server will respond with a maintenance message. Otherwise, it will serve the Growtopia server data.

Maintenance Mode
To enable maintenance mode, create or update main.txt in the project directory and set its content to 1.
To disable maintenance mode, set the content to 0.
Logging
The server logs incoming requests and server status to the console. You can check the console output for information about connections and server operations.

License
This project is licensed under the MIT License.

