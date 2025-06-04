"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bot, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatWidgetProps {
  description: string;
}

export default function ChatWidget({ description }: ChatWidgetProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "tell me the summery of the data",
    "tell me the total number order "
  ];

  useEffect(() => {
    if (scrollViewportRef.current) {
      const scrollElement = scrollViewportRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: messageContent
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/chat-gemini", {
        description,
        message: messageContent
      });

      const botResponse: ChatMessage = {
        role: "bot",
        content: data.response
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "bot",
        content: "Sorry, I encountered an error while processing your request."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-12 right-12 h-12 w-12 rounded-full shadow-lg border-4 border-red-400"
            >
              <Bot className="h-8 w-8" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Assistance</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[680px] max-w-[calc(100vw-2rem)]">
          <Card className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 h-7 w-7 rounded-full top-2"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            <CardHeader className="flex items-center space-y-2 pt-6">
              <div className="flex items-center justify-between w-full">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-10 w-10 bg-primary/10">
                    <AvatarImage src={session?.user?.image || ""} alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  {session?.user?.name || "U"}
                </div>
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs"
                  >
                    New Chat
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ScrollArea
                className="min-h-32 max-h-[60vh] overflow-y-auto pr-4 mb-4"
              >
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500">No messages yet</p>
                ) : (
                  <div className="space-y-3 py-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 max-w-[80%]",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {messages.length === 0 && (
                <div className="space-y-2 mb-4">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="w-full text-left"
                      variant="outline"
                      disabled={isLoading}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" className="shrink-0" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div >
      )
      }
    </>
  );
}
