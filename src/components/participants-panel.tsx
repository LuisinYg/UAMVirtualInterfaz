'use client';

import type { Participant } from '@/lib/types';
import { Mic, MicOff, Video, VideoOff, Hand, Crown, MoreVertical, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

interface ParticipantsPanelProps {
  participants: Participant[];
  isHost: boolean;
  onMuteParticipant: (id: string) => void;
  onAskToUnmute: (id: string) => void;
  onStopVideo: (id: string) => void;
  onMakeHost: (id: string) => void;
  onAdmitParticipant: (id: string) => void;
  onDenyParticipant: (id: string) => void;
}

const ParticipantsPanel = ({ 
  participants, 
  isHost, 
  onMuteParticipant, 
  onAskToUnmute, 
  onStopVideo, 
  onMakeHost,
  onAdmitParticipant,
  onDenyParticipant,
}: ParticipantsPanelProps) => {

  const inCallParticipants = participants.filter(p => p.status === 'in-call');
  const waitingParticipants = participants.filter(p => p.status === 'in-waiting-room');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h3 className="font-semibold text-lg">Participantes ({inCallParticipants.length})</h3>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        {isHost && waitingParticipants.length > 0 && (
            <>
                <div className="p-4">
                    <h4 className="font-semibold text-sm">En la sala de espera ({waitingParticipants.length})</h4>
                </div>
                <ul className="divide-y divide-border">
                    {waitingParticipants.map(p => (
                        <li key={p.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                                    <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium truncate max-w-[120px] sm:max-w-none">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-8 w-8 text-green-500" onClick={() => onAdmitParticipant(p.id)}>
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => onDenyParticipant(p.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
                <Separator />
            </>
        )}
        <div className="p-4">
            <h4 className="font-semibold text-sm">En la llamada</h4>
        </div>
        <ul className="divide-y divide-border">
          {inCallParticipants.map((p) => (
            <li key={p.id} className="flex items-center justify-between p-4 group">
              <div className="flex items-center gap-3">
                <Avatar>
                  {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                  <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='flex items-center gap-2'>
                    <span className="font-medium truncate max-w-[120px] sm:max-w-none">{p.id === 'local-user' ? `${p.name} (Tú)` : p.name}</span>
                    {p.isHost && <Crown className="h-4 w-4 text-amber-500" />}
                </div>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                {p.isHandRaised && <Hand className="h-5 w-5 text-accent" />}
                
                {p.id !== 'local-user' && isHost && (
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {p.isMuted ? (
                        <DropdownMenuItem onClick={() => onAskToUnmute(p.id)}>
                            <Mic className="mr-2 h-4 w-4" />
                            Solicitar reactivación de audio
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onMuteParticipant(p.id)}>
                          <MicOff className="mr-2 h-4 w-4" />
                          Silenciar
                        </DropdownMenuItem>
                      )}
                      {!p.isCameraOff && (
                        <DropdownMenuItem onClick={() => onStopVideo(p.id)}>
                            <VideoOff className="mr-2 h-4 w-4" />
                            Detener vídeo
                        </DropdownMenuItem>
                      )}
                      {!p.isHost && (
                         <DropdownMenuItem onClick={() => onMakeHost(p.id)}>
                            <Crown className="mr-2 h-4 w-4" />
                           Hacer anfitrión
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                {p.isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5 text-accent" />}
                {p.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 text-accent" />}
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default ParticipantsPanel;
