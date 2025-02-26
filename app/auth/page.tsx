"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("");
    setLoading(true);

    if(!email || !mobile) {
      setError("Either email or mobile is needed!");
      setLoading(false);
      return;
    }
    
    try{
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ name, email, mobile }),
      });
      const data = await response.json();
      if(response.ok) {
        localStorage.setItem('authToken', data.token);
        window.location.href = '/';
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <Link href="/" className="block text-center text-blue-500">
          Go to Chat
        </Link>
      </form>
    </div>
  )
}

