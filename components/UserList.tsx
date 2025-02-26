"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = localStorage.getItem('setUserId');
        const response = await fetch(`/api/users?userId=${userId}`);
        const data = await response.json();
        setUsers(data);
      } catch(error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return(
    <>
      {users.map((user: any) => (
        <div key={user.id} className="p-4 border-b">
          <Avatar>
            <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="ml-2 font-medium">{user.name}</span>
        </div>
      ))}
    </>
  );
}