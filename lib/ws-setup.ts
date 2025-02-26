import { useState, useEffect } from "react";

let ws: any = null;

const createWebSocket = () => {
  if(!ws) {
    ws = new WebSocket('ws://localhost:3377');
  } 
  return ws;
};

const useWebSocket = () => {
  const [wsInstance, setWsInstance] = useState(null);

  useEffect(() => {
    const ws = createWebSocket();
    setWsInstance(ws);

    ws.onmessage = (event: any) => {
      console.log(`Received message: ${event.data}`);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error: Error) => {
      console.log("Websocket error: ", error);
    };

    return () => {
      ws.close();
    }
  }, []);

  return wsInstance;
};

export default useWebSocket;