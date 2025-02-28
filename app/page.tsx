"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import UserList from "@/components/UserList"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useWebSocket from "@/lib/ws-setup"
import { jwtDecode } from "jwt-decode"

interface DecodedToken {
  userId: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const activeUserId = localStorage.getItem("setUserId");
    setActiveUser(activeUserId);
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserName(decoded.name);
    }

    if (!token) {
      router.push("/auth");
    }
  }, []);


  const [selectedUser, setSelectedUser] = useState<string | null>("");

  const { messages, sendMessage } = useWebSocket(
    typeof window !== "undefined" ? localStorage.getItem("setUserId") || "" : ""
  );

  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (selectedUser && messageInput.trim() !== "") {
      sendMessage(selectedUser, messageInput);
      setMessageInput("");
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-8" placeholder="Search" />
          </div>
        </div>
        <div className="flex-grow">
          <UserList onSelectUser={setSelectedUser} />
        </div>
        <div className="p-4 border-t flex items-center">
          <Avatar>
            <AvatarFallback>{userName ? userName.slice(0, 1).toUpperCase() : "G"}</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium">{userName || "Guest"}</span>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-grow flex flex-col">
        {selectedUser ? (
          <>
            {/* Chatting with User ID: {selectedUser} */}
            {/* <div className="flex-grow p-4 overflow-y-auto border-b"> */}
            <div className="flex flex-col h-full p-4 overflow-y-auto border-b">
              {messages
                .filter((msg) => String(msg.from) === String(activeUser) && String(msg.to) === String(selectedUser) ||
                  String(msg.from) === String(selectedUser) && String(msg.to) === String(activeUser)) //some filter logic, this needs to be corrected
                .map((msg, index) => (
                  <div key={index} className={`max-w-[75%] break-words px-4 py-2 rounded-lg shadow-md ${String(msg.from) === String(activeUser) ? "bg-blue-500 text-white self-end" : "bg-gray-300 self-start"
                    }`} >
                    {msg.message}
                  </div>
                ))}
            </div>
            <div className="p-4 border-t flex">
              <Input
                className="flex-grow mr-2"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Select a user to start chatting.
          </div>
        )}
      </div>
      <Link
        onClick={() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("setUserId");
        }}
        href="/auth"
        className="fixed top-4 right-4 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-pink-700 transition"
      >
        Logout
      </Link>
    </div>
  )
}


