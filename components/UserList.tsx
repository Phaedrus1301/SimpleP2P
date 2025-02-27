"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useWebSocket from "@/lib/ws-setup";

interface User {
  id: string,
  name: string,
  avatar?: string
}

interface UserListProps {
  onSelectUser: (userId: string) => void;
}

export default function UserList({ onSelectUser }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const userId = typeof window !== "undefined" ? localStorage.getItem('setUserId') : null;
  const { wsInstance } = useWebSocket(userId || "");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?userId=${userId}`);
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch(error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    if(!wsInstance) return;

    wsInstance.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === "userStatus") {
        setOnlineUsers(data.onlineUsers);
      }
    };
  }, [wsInstance]);
  
  return(
    <>
      {users.map((user) => (
        <div 
          key={user.id} 
          className="p-4 border-b flex items-center cursor-pointer hover:bg-gray-100" 
          onClick={() => onSelectUser(user.id)}
        >
          <Avatar>
            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium">
            {user.name}
            {onlineUsers.includes(user.id) && (
              <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </span>
        </div>
      ))}
    </>
  );
}