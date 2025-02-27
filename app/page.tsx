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

export default function Home() {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<string | null>("");

  useEffect(() => {
    const userNow = localStorage.getItem("setUserId");
    setActiveUser(userNow);
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/auth");
    }
  }, [activeUser]);


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
            {/*<AvatarImage src="/placeholder.svg" alt="User" /> disabled for now, as letters look good*/}
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium">User Name</span>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-grow flex flex-col">
        {selectedUser ? (
          <>
            {/* Chatting with User ID: {selectedUser} */}
            <div className="flex-grow p-4 overflow-y-auto border-b">
              {messages
                .filter((msg) => (msg.from === activeUser && msg.to === selectedUser) || (msg.from === selectedUser && msg.to === activeUser))
                .map((msg, index) => (
                  <div key={index} className={`mb-2 p-2 rounded-lg ${msg.from === selectedUser ? "bg-gray-300" : "bg-blue-500 text-white"}`} >
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
          localStorage.removeItem('authToken');
          localStorage.removeItem('setUserId');
        }}
        href="/auth" className="absolute top-4 right-4 text-blue-500"
      >
        Logout
      </Link>
    </div>
  )
}

