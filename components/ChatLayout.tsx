import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User } from "lucide-react"

export default function ChatLayout() {
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
        <div className="flex-grow">{/* Chat list would go here */}</div>
        <div className="p-4 border-t flex items-center">
          <User className="w-8 h-8 rounded-full bg-gray-200 p-1" />
          <span className="ml-2 font-medium">User Name</span>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow p-4">{/* Chat messages would go here */}</div>
        <div className="p-4 border-t flex">
          <Input className="flex-grow mr-2" placeholder="Type a message..." />
          <Button>Send</Button>
        </div>
      </div>
    </div>
  )
}

