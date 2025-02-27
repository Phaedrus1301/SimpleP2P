const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3377 });

const clients = new Map();
const messageQue = new Map();

wss.on("connection", (ws, req) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    if(data.type === "register") {
      clients.set(data.userId, ws);
      console.log("user registered: ", data.userId);

      if(messageQue.has(data.userId)) {
        messageQue.get(data.userId).forEach((msg) => ws.send(JSON.stringify(msg)));
        messageQue.delete(data.userId);
      }
    } 
    
    if(data.type === "message") {
      const recipient = clients.get(data.to);
      if(recipient) {
        recipient.send(JSON.stringify({ from: data.userId, to: data.to, message: data.message}));
      } else {
        if(!messageQue.has(data.to)) {
          messageQue.set(data.to, []);
        }
        messageQue.get(data.to).push({ from:data.userId, to: data.to, message: data.message });
      }
    }
  });

  ws.on("close", () => {
    for(let [userId, client] of clients.entries()) {
      if(client === ws) {
        clients.delete(userId);
        console.log("User disconnected: ", userId);
        break;
      }
    }
  });
});

console.log("WebSocket server running at port 3377");