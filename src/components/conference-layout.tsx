
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ControlBar from './control-bar';
import SidePanel from './side-panel';
import VideoGrid from './video-grid';
import SettingsDialog from './settings-dialog';
import { useToast } from '@/lib/hooks/use-toast';
import type { Participant, ChatMessage, VideoEffect, RecordingStatus } from '@/lib/types';
import { Users, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type PanelType = 'chat' | 'participants';

interface ConferenceLayoutProps {
  initialName: string;
  initialMeetingName: string;
  initialMicMuted: boolean;
  initialVideoOff: boolean;
  isHost: boolean;
}

const ConferenceLayout = ({ initialName, initialMeetingName, initialMicMuted, initialVideoOff, isHost }: ConferenceLayoutProps) => {
  const [userName, setUserName] = useState(initialName);
  const [meetingName, setMeetingName] = useState(initialMeetingName);
  const [isMicMuted, setIsMicMuted] = useState(initialMicMuted);
  const [isCameraOff, setIsCameraOff] = useState(initialVideoOff);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [videoEffect, setVideoEffect] = useState<VideoEffect>({ type: 'none' });
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle');
  const [currentReaction, setCurrentReaction] = useState<string | null>(null);
  
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const { toast } = useToast();
  const router = useRouter();

  const activeStream = isScreenSharing ? screenStream : cameraStream;
  const meetingId = "SSCA-EYVF";

  useEffect(() => {
    const avatarUrl = sessionStorage.getItem('avatarUrl') || undefined;
    const initialParticipants: Participant[] = [
      {
        id: 'local-user',
        name: initialName,
        isMuted: initialMicMuted,
        isCameraOff: initialVideoOff,
        isSpeaking: false,
        isHandRaised: false,
        avatarUrl: avatarUrl,
        isHost: isHost,
        status: 'in-call',
      }
    ];
    setParticipants(initialParticipants);
    setUserName(initialName);
    setMeetingName(initialMeetingName);
  }, [initialName, initialMeetingName, initialMicMuted, initialVideoOff, isHost]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        userStream.getAudioTracks().forEach((track) => { track.enabled = !initialMicMuted; });
        userStream.getVideoTracks().forEach((track) => { track.enabled = !initialVideoOff; });
        setCameraStream(userStream);
        setHasCameraPermission(true);
      } catch (error) {
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acceso denegado',
          description: 'Activa los permisos de cámara y micrófono.',
        });
      }
    };
    getMedia();
    return () => {
        cameraStream?.getTracks().forEach(track => track.stop());
        screenStream?.getTracks().forEach(track => track.stop());
    }
  }, []);

  const updateLocalParticipant = useCallback((updates: Partial<Participant>) => {
    setParticipants(prev => prev.map(p => (p.id === 'local-user' ? { ...p, ...updates } : p)));
  }, []);

  const handleSendMessage = useCallback((message: string, isSystem = false) => {
    if (!message.trim()) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      participantName: isSystem ? 'Sistema' : userName,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      message,
    };
    setChatMessages(prev => [...prev, newMessage]);
  }, [userName]);

  const toggleMic = useCallback(() => {
    const newMutedState = !isMicMuted;
    if (cameraStream) {
      cameraStream.getAudioTracks().forEach((track) => { track.enabled = !newMutedState; });
    }
    setIsMicMuted(newMutedState);
    updateLocalParticipant({ isMuted: newMutedState });
  }, [cameraStream, isMicMuted, updateLocalParticipant]);

  const toggleCamera = useCallback(() => {
    const newCameraState = !isCameraOff;
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach((track) => { track.enabled = !newCameraState; });
    }
    setIsCameraOff(newCameraState);
    updateLocalParticipant({ isCameraOff: newCameraState });
  }, [cameraStream, isCameraOff, updateLocalParticipant]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      handleSendMessage(`Dejó de compartir pantalla`, true);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
        };
        setScreenStream(stream);
        setIsScreenSharing(true);
        handleSendMessage(`Está compartiendo pantalla`, true);
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error al compartir pantalla' });
      }
    }
  }, [isScreenSharing, screenStream, toast, handleSendMessage]);
  
  const toggleRaiseHand = useCallback(() => {
      const newHandState = !isHandRaised;
      setIsHandRaised(newHandState);
      updateLocalParticipant({ isHandRaised: newHandState });
      if (newHandState) {
        handleSendMessage(`Levantó la mano ✋`, true);
      } else {
        handleSendMessage(`Bajó la mano`, true);
      }
  }, [isHandRaised, updateLocalParticipant, handleSendMessage]);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => {
      if (!prev) setActivePanel(null);
      return !prev;
    });
  }, []);

  const handleShowPanel = useCallback((panel: PanelType) => {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  }, []);

  const handleLeaveCall = () => {
    cameraStream?.getTracks().forEach(track => track.stop());
    screenStream?.getTracks().forEach(track => track.stop());
    router.push('/');
  };

  const handleSendReaction = useCallback((emoji: string) => {
    setCurrentReaction(emoji);
    handleSendMessage(`Reaccionó con ${emoji}`, true);
    setTimeout(() => setCurrentReaction(null), 5000);
  }, [handleSendMessage]);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `No se pudo activar pantalla completa: ${err.message}`,
        });
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [toast]);

  const handleStartRecording = useCallback(() => {
    setRecordingStatus('recording');
    handleSendMessage(`Grabación iniciada`, true);
  }, [handleSendMessage]);

  const handlePauseRecording = useCallback(() => {
    setRecordingStatus('paused');
    handleSendMessage(`Grabación detenida`, true);
  }, [handleSendMessage]);

  const handleResumeRecording = useCallback(() => {
    setRecordingStatus('recording');
    handleSendMessage(`Grabación iniciada`, true);
  }, [handleSendMessage]);

  const handleStopRecording = useCallback(() => {
    setRecordingStatus('idle');
    handleSendMessage(`Grabación finalizada`, true);
  }, [handleSendMessage]);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-[#F0F2F5]">
      <header className="flex items-center justify-between p-4 bg-white border-b h-20 shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-[#2D164B] leading-none">{meetingName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {meetingId}
              </span>
              <div className="flex gap-1 ml-2">
                <Button variant="outline" size="sm" className="h-8 rounded-lg font-black text-[#2D164B] text-xs px-3" onClick={() => {
                  navigator.clipboard.writeText(meetingId);
                  toast({ title: 'Copiado', description: 'Código de sala copiado.' });
                }}>
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-8 rounded-full border-green-100 bg-green-50 text-green-600 font-bold px-4 text-[10px] flex items-center">
            Conectado
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => handleShowPanel('participants')} className="h-9 rounded-full bg-white border border-slate-100 shadow-sm font-black text-[#2D164B] gap-2 px-4 hover:bg-slate-50">
            <Users className="h-4 w-4 text-[#2D164B]" />
            Usuarios
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleShowPanel('chat')} className="h-9 rounded-full bg-white border border-slate-100 shadow-sm font-black text-[#2D164B] gap-2 px-4 hover:bg-slate-50">
            <MessageSquare className="h-4 w-4 text-[#2D164B]" />
            Chat
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          
          {recordingStatus !== 'idle' && (
            <div className="absolute top-4 left-6 z-40">
              <div className={cn(
                "backdrop-blur-md border p-4 rounded-2xl shadow-xl flex items-start gap-3 min-w-[200px] transition-all",
                recordingStatus === 'recording' ? "bg-red-50/90 border-red-100 shadow-red-100/20" : "bg-amber-50/90 border-amber-100 shadow-amber-100/20"
              )}>
                <div className={cn(
                  "h-2 w-2 rounded-full mt-1.5 animate-pulse",
                  recordingStatus === 'recording' ? "bg-red-500" : "bg-amber-500"
                )} />
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn(
                      "text-xs font-black",
                      recordingStatus === 'recording' ? "text-red-700" : "text-amber-700"
                    )}>
                      {recordingStatus === 'recording' ? 'Grabación en curso' : 'Grabación pausada'}
                    </span>
                    <span className={cn(
                      "text-[10px] font-mono font-bold",
                      recordingStatus === 'recording' ? "text-red-500" : "text-amber-500"
                    )}>00:00</span>
                  </div>
                  <p className={cn(
                    "text-[10px] font-medium leading-relaxed mt-0.5",
                    recordingStatus === 'recording' ? "text-red-600/70" : "text-amber-600/70"
                  )}>
                    Esta sala está siendo grabada.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
            <VideoGrid 
              isScreenSharing={isScreenSharing}
              stream={activeStream}
              isCameraOff={isCameraOff}
              isMicMuted={isMicMuted}
              hasCameraPermission={hasCameraPermission}
              isHandRaised={isHandRaised}
              name={userName}
              participants={participants}
              isFocusMode={isFocusMode}
              videoEffect={videoEffect}
              currentReaction={currentReaction}
            />
          </div>
          
          <div className="shrink-0 z-20 pb-8 flex justify-center">
            <ControlBar
              isMicMuted={isMicMuted}
              toggleMic={toggleMic}
              isCameraOff={isCameraOff}
              toggleCamera={toggleCamera}
              isScreenSharing={isScreenSharing}
              toggleScreenShare={toggleScreenShare}
              onShowPanel={handleShowPanel}
              activePanel={activePanel}
              onLeaveCall={handleLeaveCall}
              isHandRaised={isHandRaised}
              toggleRaiseHand={toggleRaiseHand}
              isFocusMode={isFocusMode}
              toggleFocusMode={toggleFocusMode}
              onOpenSettings={() => setIsSettingsOpen(true)}
              recordingStatus={recordingStatus}
              startRecording={handleStartRecording}
              pauseRecording={handlePauseRecording}
              resumeRecording={handleResumeRecording}
              stopRecording={handleStopRecording}
              isHost={isHost}
              onSendReaction={handleSendReaction}
              onToggleFullScreen={toggleFullScreen}
            />
          </div>
        </div>

        <SidePanel 
          isOpen={activePanel !== null} 
          activeTab={activePanel || 'chat'} 
          onTabChange={(tab) => setActivePanel(tab as any)}
          participants={participants}
          chatMessages={chatMessages}
          onSendMessage={handleSendMessage}
          isHost={isHost}
          onMuteParticipant={() => {}}
          onAskToUnmute={() => {}}
          onStopVideo={() => {}}
          onMakeHost={() => {}}
          onAdmitParticipant={() => {}}
          onDenyParticipant={() => {}}
        />
      </main>

      <SettingsDialog
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        videoEffect={videoEffect}
        setVideoEffect={setVideoEffect}
      />
    </div>
  );
};

export default ConferenceLayout;
