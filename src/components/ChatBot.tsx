


import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const healthData: Record<string, any> = {
  "Anambra West": {
    malaria: "15.3% malaria prevalence (2024). Above state avg (12.8%).",
    facilities: "8 PHC facilities.",
    immunization: "73% immunization coverage.",
  },
  "Awka South": {
    malaria: "11.8% malaria prevalence.",
    facilities: "12 PHC facilities.",
    immunization: "82% immunization coverage.",
  },
  "Anambra East": {
    malaria: "13.5% malaria prevalence.",
    facilities: "7 PHC facilities.",
    immunization: "67.4% immunization coverage (lowest in state).",
  },
  "Ogbaru": {
    malaria: "15.5% malaria prevalence (highest in state).",
    facilities: "9 PHC facilities.",
    immunization: "71% immunization coverage.",
  },
};

const quickSuggestions = [
  "What is malaria prevalence in Anambra West?",
  "How many PHC facilities are in Awka South?",
  "Which LGA has lowest immunization coverage?",
  "Which LGA has highest malaria prevalence?",
  "Show me disease trends this year",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I’m your Anambra Health GeoHub assistant. Ask me about malaria prevalence, PHC facilities, or immunization coverage in any LGA.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const getBotResponse = (query: string): string => {
    const lower = query.toLowerCase();

    for (const lga of Object.keys(healthData)) {
      if (lower.includes(lga.toLowerCase())) {
        if (lower.includes("malaria")) return `${lga}: ${healthData[lga].malaria}`;
        if (lower.includes("phc") || lower.includes("facility"))
          return `${lga}: ${healthData[lga].facilities}`;
        if (lower.includes("immunization"))
          return `${lga}: ${healthData[lga].immunization}`;
      }
    }

    if (lower.includes("lowest") && lower.includes("immunization"))
      return "Anambra East has the lowest immunization coverage at 67.4%.";
    if (lower.includes("highest") && lower.includes("malaria"))
      return "Ogbaru LGA has the highest malaria prevalence at 15.5%.";
    if (lower.includes("trend") || lower.includes("disease"))
      return "2024 trends: Malaria ↓12%, COVID-19 stable, hypertension ↑23%, maternal mortality ↓8%.";

    return "I can tell you about malaria, PHC facilities, and immunization coverage in Anambra’s 21 LGAs. Try asking about a specific LGA.";
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputMessage;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const reply: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(messageText),
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, reply]);
    setInputMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-14 w-14 rounded-full bg-anambra-500 hover:bg-anambra-700 shadow-lg z-50 p-0"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[90vw] sm:w-96 max-h-[80vh] sm:h-[500px] bg-background border shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-anambra-500 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm sm:text-base">
                Anambra GeoHub Assistant
              </h3>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-anambra-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm break-words ${
                    message.isUser
                      ? "bg-anambra-500 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 border-t bg-muted/40">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about health data..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                size="icon"
                className="bg-anambra-500 hover:bg-anambra-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
