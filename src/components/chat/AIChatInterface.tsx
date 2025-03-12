import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  PlusCircle,
  X,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  rating: number;
}

interface AIChatInterfaceProps {
  onDoctorRecommendation?: (doctors: Doctor[]) => void;
  initialMessages?: Message[];
}

const AIChatInterface = ({
  onDoctorRecommendation = () => {},
  initialMessages = [],
}: AIChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: "1",
            content:
              "Hello! I'm your AI healthcare assistant. How can I help you today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ],
  );

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([
    {
      id: "d1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      rating: 4.8,
    },
    {
      id: "d2",
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      rating: 4.9,
    },
    {
      id: "d3",
      name: "Dr. Emily Rodriguez",
      specialty: "Family Medicine",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
      rating: 4.7,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      // If the user's message contains symptoms, show doctor recommendations
      if (
        inputValue.toLowerCase().includes("pain") ||
        inputValue.toLowerCase().includes("headache") ||
        inputValue.toLowerCase().includes("symptom") ||
        inputValue.toLowerCase().includes("doctor") ||
        inputValue.toLowerCase().includes("appointment")
      ) {
        // Add a small delay before showing recommendations to make it feel more natural
        setTimeout(() => {
          onDoctorRecommendation(recommendedDoctors);
        }, 500);
      }
    }, 1500);
  };

  // Simple AI response generator based on user input
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("headache")) {
      return "I understand you're experiencing headaches. How long have you been having them? Are they accompanied by any other symptoms like nausea, sensitivity to light, or blurred vision?";
    } else if (input.includes("chest pain")) {
      return "Chest pain can be concerning. Is the pain sharp, dull, or pressure-like? Does it radiate to your arm, jaw, or back? I recommend speaking with a cardiologist as soon as possible.";
    } else if (input.includes("fever")) {
      return "I see you have a fever. What's your temperature? Are you experiencing any other symptoms like cough, sore throat, or body aches?";
    } else if (input.includes("doctor")) {
      return "Based on your symptoms, I can recommend some specialists who might be able to help. Would you like to see available doctors?";
    } else {
      return "Thank you for sharing that information. Could you provide more details about your symptoms? This will help me better understand your situation and recommend appropriate care.";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-blue-100">
            <AvatarImage
              src="https://api.dicebear.com/7.x/bottts/svg?seed=healthcare"
              alt="AI Assistant"
            />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          Healthcare Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=healthcare"
                      alt="AI Assistant"
                    />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Healthcare AI</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=healthcare"
                    alt="AI Assistant"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">Healthcare AI</span>
              </div>
              <div className="flex space-x-1">
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-4 border-t bg-gray-50">
        <div className="flex items-end w-full gap-2">
          <TooltipProvider>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach image</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <div className="flex-1 relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your symptoms..."
              className="min-h-[60px] resize-none pr-12 rounded-lg"
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full"
              disabled={inputValue.trim() === ""}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-blue-50 border-blue-200 hover:bg-blue-100"
                >
                  <Mic className="h-5 w-5 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Voice input</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIChatInterface;
