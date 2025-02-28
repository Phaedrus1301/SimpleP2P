const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3377 });

const clients = new Map();
const messageQue = new Map();

const broadcastUsers = () => {
  const online = { type: "status", onlineUsers: Array.from(clients.keys()) };
clients.forEach((client) => {
  if(client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(online));
  }
}); 
};

wss.on("connection", (ws, req) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
    console.log("received message", data);

    if(data.type === "register") {
      clients.set(data.userId, ws);
      console.log("user registered: ", data.userId);
      
      broadcastUsers();   
    }
    
    if(data.type === "message") {
      const recipient = clients.get(String(data.to));
      const messageData = { type: "message", from: data.userId, to: data.to, message: data.message };
      if(recipient && recipient.readyState === WebSocket.OPEN) {
        console.log(`Recipient found? ${!!recipient}, Sending to: ${recipient}`);
        recipient.send(JSON.stringify(messageData));
      } else {
        if(!messageQue.has(data.to)) {
          messageQue.set(data.to, []);
        }
        messageQue.get(data.to).push(messageData);
      }
    }
  });

  ws.on("close", () => {
    for(let [userId, client] of clients.entries()) {
      if(client === ws) {
        clients.delete(userId);
        broadcastUsers();  
        console.log("User disconnected: ", userId);
        break;
      }
    }
    console.log(clients);
  });
});

console.log("WebSocket server running at port 3377");