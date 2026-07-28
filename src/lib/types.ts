export type ParticipantStatus = 'in-call' | 'in-waiting-room';

export type Participant = {
  id: string;
  name: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  isHandRaised?: boolean;
  avatarUrl?: string;
  isHost?: boolean;
  status: ParticipantStatus;
};

export type ChatMessage = {
  id: string;
  participantName: string;
  timestamp: string;
  message: string;
};

export type VideoEffect = 
  | { type: 'none' }
  | { type: 'blur' }
  | { type: 'background'; value: string };

export type Reaction = {
    id: string;
    emoji: string;
    senderId: string;
};

export type RecordingStatus = 'idle' | 'recording' | 'paused';
