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
  const userId = typeof window !== "undefined" ? localStorage.getItem('setUserId') : null;
  const [users, setUsers] = useState<User[]>([]);
  const { onlineUsers } = useWebSocket(userId || "");

  useEffect(() => {
    console.log("is online user's any right now?", onlineUsers);
  }, [onlineUsers]);
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

  return(
    <>
      {users.map((user) => {
        return (
        <div 
          key={user.id} 
          className="p-4 border-b flex items-center cursor-pointer hover:bg-gray-100" 
          onClick={() => onSelectUser(user.id)}
        >
          <Avatar>
            {/*<AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />*/}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium">
            {user.name}
            {onlineUsers.includes(String(user.id)) && (
              <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </span>
        </div>
      )})}
    </>
  );
}