
'use client';

import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  Hand,
  Maximize,
  Smile,
  MessageSquare,
  PhoneOff,
  Circle,
  Pause,
  Play,
  Square,
} from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import type { RecordingStatus } from '@/lib/types';

interface ControlBarProps {
  isMicMuted: boolean;
  toggleMic: () => void;
  isCameraOff: boolean;
  toggleCamera: () => void;
  isScreenSharing: boolean;
  toggleScreenShare: () => void;
  onShowPanel: (panel: 'chat' | 'participants') => void;
  activePanel: string | null;
  onLeaveCall: () => void;
  isHandRaised: boolean;
  toggleRaiseHand: () => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  onOpenSettings: () => void;
  recordingStatus: RecordingStatus;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  isHost: boolean;
  onSendReaction: (emoji: string) => void;
  onToggleFullScreen: () => void;
}

const reactions = ['👍', '❤️', '🎉', '👏', '😂', '😮'];

const ControlBar = ({
  isMicMuted,
  toggleMic,
  isCameraOff,
  toggleCamera,
  isScreenSharing,
  toggleScreenShare,
  onShowPanel,
  activePanel,
  onLeaveCall,
  isHandRaised,
  toggleRaiseHand,
  onSendReaction,
  onToggleFullScreen,
  recordingStatus,
  startRecording,
  pauseRecording,
  resumeRecording,
  stopRecording,
  isHost,
}: ControlBarProps) => {
  return (
    <TooltipProvider>
      <div className="bg-white/90 backdrop-blur-md p-3 px-6 rounded-full flex items-center gap-4 shadow-2xl border border-white shadow-purple-200/20">
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMic} 
              className={cn(
                "h-11 w-11 rounded-full border shadow-sm transition-all", 
                isMicMuted 
                  ? "bg-red-500 border-red-600 text-white hover:bg-red-600" 
                  : "bg-green-500 border-green-600 text-white hover:bg-green-600"
              )}
            >
              {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isMicMuted ? 'Activar audio' : 'Silenciar'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCamera} 
              className={cn(
                "h-11 w-11 rounded-full border shadow-sm transition-all", 
                isCameraOff 
                  ? "bg-red-500 border-red-600 text-white hover:bg-red-600" 
                  : "bg-green-500 border-green-600 text-white hover:bg-green-600"
              )}
            >
              {isCameraOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isCameraOff ? 'Iniciar video' : 'Detener video'}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleScreenShare} className={cn("h-11 w-11 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 transition-all", isScreenSharing && 'text-green-600 border-green-100 bg-green-50/50')}>
              <ScreenShare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Compartir pantalla</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleRaiseHand} className={cn("h-11 w-11 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 transition-all", isHandRaised && 'text-orange-500 border-orange-100 bg-orange-50/50')}>
              <Hand className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Levantar la mano</TooltipContent>
        </Tooltip>

        {/* Controles de Grabación (Solo Anfitrión) */}
        {isHost && (
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full">
            {recordingStatus === 'idle' ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={startRecording} className="h-10 w-10 rounded-full hover:bg-red-50 text-red-500">
                    <Circle className="h-5 w-5 fill-current" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Iniciar grabación</TooltipContent>
              </Tooltip>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={recordingStatus === 'recording' ? pauseRecording : resumeRecording} 
                      className={cn("h-10 w-10 rounded-full", recordingStatus === 'paused' ? "text-green-500 hover:bg-green-50" : "text-amber-500 hover:bg-amber-50")}
                    >
                      {recordingStatus === 'recording' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{recordingStatus === 'recording' ? 'Pausar' : 'Reanudar'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={stopRecording} className="h-10 w-10 rounded-full text-slate-700 hover:bg-slate-200">
                      <Square className="h-5 w-5 fill-current" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Detener grabación</TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        )}

        <Popover>
          <Tooltip>
              <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 transition-all">
                          <Smile className="h-5 w-5 text-[#2D164B]" />
                      </Button>
                  </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Reacciones</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-2 rounded-2xl border-none shadow-2xl">
              <div className="flex gap-1">
                  {reactions.map((emoji) => (
                      <Button
                          key={emoji}
                          variant="ghost"
                          size="icon"
                          onClick={() => onSendReaction(emoji)}
                          className="text-2xl hover:bg-orange-50 rounded-xl"
                      >
                          {emoji}
                      </Button>
                  ))}
              </div>
          </PopoverContent>
        </Popover>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => onShowPanel('chat')} className={cn("h-11 w-11 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 transition-all", activePanel === 'chat' && 'text-orange-500 border-orange-100 bg-orange-50/50')}>
              <MessageSquare className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chat</TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-2 ml-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleFullScreen}
                className="h-11 w-11 rounded-full border border-slate-100 shadow-sm bg-white hover:bg-slate-50 transition-all"
              >
                <Maximize className="h-5 w-5 text-[#2D164B]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pantalla completa</TooltipContent>
          </Tooltip>
          <Button variant="destructive" onClick={onLeaveCall} className="rounded-full px-6 h-11 font-black text-white shadow-xl shadow-red-200 active:scale-95 transition-all">
            <PhoneOff className="mr-2 h-5 w-5" />
            Salir
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ControlBar;
