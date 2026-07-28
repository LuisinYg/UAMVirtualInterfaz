
'use client';

import { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const ChatPanel = ({ messages, onSendMessage }: ChatPanelProps) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold text-lg">Chat de la reunión</h3>
      </div>
      <Separator />
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">El chat está vacío. ¡Envía un mensaje!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isSystem = msg.participantName === 'Sistema';
              return (
                <div key={msg.id} className={cn("flex flex-col", isSystem && "items-center")}>
                  {!isSystem && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-bold text-foreground">{msg.participantName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}
                  <p className={cn(
                    "text-sm rounded-lg p-2",
                    isSystem ? "bg-slate-100 text-slate-500 italic font-medium px-4" : "bg-secondary/50"
                  )}>
                    {msg.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
      <Separator />
      <div className="p-4 bg-background">
        <form className="flex items-center gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Escribe un mensaje..."
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon" aria-label="Enviar mensaje">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;
