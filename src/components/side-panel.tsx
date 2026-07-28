'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatPanel from './chat-panel';
import ParticipantsPanel from './participants-panel';
import { MessageSquare, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage, Participant } from '@/lib/types';
import { Button } from './ui/button';

interface SidePanelProps {
  isOpen: boolean;
  activeTab: 'chat' | 'participants';
  onTabChange: (tab: 'chat' | 'participants') => void;
  participants: Participant[];
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isHost: boolean;
  onMuteParticipant: (id: string) => void;
  onAskToUnmute: (id: string) => void;
  onStopVideo: (id: string) => void;
  onMakeHost: (id: string) => void;
  onAdmitParticipant: (id: string) => void;
  onDenyParticipant: (id: string) => void;
}

const SidePanel = ({ 
    isOpen, 
    activeTab, 
    onTabChange, 
    participants, 
    chatMessages, 
    onSendMessage,
    isHost,
    onMuteParticipant,
    onAskToUnmute,
    onStopVideo,
    onMakeHost,
    onAdmitParticipant,
    onDenyParticipant,
}: SidePanelProps) => {
  return (
    <aside
      className={cn(
        'bg-card flex flex-col transition-all duration-300 ease-in-out border-l shadow-2xl',
        'fixed inset-y-0 right-0 h-full z-40 w-full max-w-sm transform',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        'md:relative md:translate-x-0 md:h-full md:z-10',
        isOpen ? 'md:w-[380px]' : 'md:w-0 md:opacity-0 md:pointer-events-none md:border-none'
      )}
    >
      <div className={cn(
          'flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden transition-opacity h-full',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="flex items-center justify-between p-2 md:hidden">
            <span className="font-bold px-2">Panel</span>
            <Button variant="ghost" size="icon" onClick={() => onTabChange(activeTab)}>
                <X className="h-5 w-5" />
            </Button>
        </div>
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as any)} className="h-full flex flex-col">
          <TabsList className="grid w-[calc(100%-1rem)] grid-cols-2 mx-2 mt-2">
            <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Chat</TabsTrigger>
            <TabsTrigger value="participants"><Users className="mr-2 h-4 w-4"/>Participantes</TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex-1 mt-0 overflow-hidden">
            <ChatPanel messages={chatMessages} onSendMessage={onSendMessage} />
          </TabsContent>
          <TabsContent value="participants" className="flex-1 mt-0 overflow-hidden">
            <ParticipantsPanel 
                participants={participants} 
                isHost={isHost}
                onMuteParticipant={onMuteParticipant}
                onAskToUnmute={onAskToUnmute}
                onStopVideo={onStopVideo}
                onMakeHost={onMakeHost}
                onAdmitParticipant={onAdmitParticipant}
                onDenyParticipant={onDenyParticipant}
            />
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
};

export default SidePanel;
