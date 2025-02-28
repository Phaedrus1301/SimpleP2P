import { useState, useEffect, useRef } from "react";

const useWebSocket = (userId: string) => {
  const [messages, setMessages] = useState<{ from: string, to: string, message:string}[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const connectWS = () => {
      if(wsRef.current) {
        console.log("duplicate connection prevention kachow!");
      }

      let ws = new WebSocket('ws://localhost:3377');
      wsRef.current = ws;

      ws.onopen = () => {
        const register = { type: "register", userId };
        ws?.send(JSON.stringify(register));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === "message") {   
          setMessages((prev) => {
            const newMessages = [...prev, { from: data.from, to: data.to, message: data.message }];
            return newMessages;
          });
        }
        if(data.type === "status") {
          setOnlineUsers(data.onlineUsers);
        }

      };
  
      ws.onerror = (error) => {
        console.log("Websocket error: ", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        wsRef.current = null;
        setTimeout(connectWS, 2000);
      };
    };

    connectWS();

    return () => {
      if(wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, [userId]);

  // useEffect(() => {
  //   console.log("Messages updated:", messages);
  // }, [messages]);  

  const sendMessage = (to: string, message: string) => {
    const wsInstance = wsRef.current;
    if(wsInstance && wsInstance.readyState === WebSocket.OPEN) {
      const msg = { type: "message", to, userId, message };
      setMessages((prev) => [
        ...prev,
        { from: userId, to, message }
      ]);
      wsInstance.send(JSON.stringify(msg));
    } else {
      console.log("websocket not open. message not sent.");
    }
  };

  return { messages, sendMessage, onlineUsers };
};

export default useWebSocket;