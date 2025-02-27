import { useState, useEffect } from "react";

let ws: WebSocket | null = null;

const useWebSocket = (userId: string) => {
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<{ from: string, to: string, message:string}[]>([]);


  useEffect(() => {
    if (!userId) return;

    let ws: WebSocket | null = null;

    const connectWS = () => {
      ws = new WebSocket('ws://localhost:3377');

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, { from: data.string, to: data.to, message: data.message }]);
      };
  
      ws.onerror = (error) => {
        console.log("Websocket error: ", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setWsInstance(ws);
    };

    connectWS();

    return () => {
      if(ws?.readyState === 1) {
        ws?.close();
      }
    }
  }, [userId]);

  const sendMessage = (to: string, message: string) => {
    if(wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      wsInstance.send(JSON.stringify({ type: "message", to, userId, message }));
    }
  };

  return { wsInstance, messages, sendMessage };
};

export default useWebSocket;