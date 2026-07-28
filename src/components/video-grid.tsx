
'use client';

import type { Participant, VideoEffect } from '@/lib/types';
import ParticipantVideo from './participant-video';
import LocalVideoView from './local-video-view';
import ScreenShareView from './screen-share-view';

interface VideoGridProps {
  isScreenSharing: boolean;
  stream: MediaStream | null;
  isCameraOff: boolean;
  isMicMuted: boolean;
  hasCameraPermission: boolean;
  isHandRaised: boolean;
  name: string;
  participants: Participant[];
  isFocusMode: boolean;
  videoEffect: VideoEffect;
  currentReaction: string | null;
}

const VideoGrid = ({ 
  isScreenSharing, 
  stream, 
  isCameraOff, 
  isMicMuted,
  hasCameraPermission,
  isHandRaised,
  name,
  participants,
  isFocusMode,
  videoEffect,
  currentReaction,
}: VideoGridProps) => {

  const localParticipant = participants.find(p => p.id === 'local-user');

  if (isScreenSharing) {
    return (
      <div className="w-full h-full p-4 flex items-center justify-center">
        <ScreenShareView stream={stream} name={name} />
      </div>
    );
  }
  
  if (isFocusMode) {
    const speaker = participants.find(p => p.isSpeaking) || localParticipant || participants[0];
    const otherViewers = participants.filter(p => p.id !== speaker?.id);

    const renderParticipant = (p: Participant, isMain: boolean) => {
      if (p.id === 'local-user') {
        return (
          <LocalVideoView
            stream={stream}
            isCameraOff={isCameraOff}
            isMicMuted={isMicMuted}
            hasCameraPermission={isMain ? hasCameraPermission : false}
            name={name}
            isHandRaised={isHandRaised}
            avatarUrl={p.avatarUrl}
            videoEffect={videoEffect}
            currentReaction={currentReaction}
          />
        );
      }
      return <ParticipantVideo participant={p} isMainFeed={isMain} />;
    };

    return (
      <div className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="flex-[3] min-h-0 flex items-center justify-center">
          {speaker && renderParticipant(speaker, true)}
        </div>
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto shrink-0 md:w-80 h-48 md:h-full">
            {otherViewers.map((p) => (
              <div key={p.id} className="w-72 md:w-full shrink-0">
                {renderParticipant(p, false)}
              </div>
            ))}
        </div>
      </div>
    );
  }

  const otherParticipants = participants.filter(p => p.id !== 'local-user');

  return (
    <div className="w-full h-full overflow-y-auto flex items-center justify-center p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-full">
          {localParticipant && (
            <div className="flex items-center justify-center w-full min-h-[300px]">
              <LocalVideoView
                  stream={stream}
                  isCameraOff={isCameraOff}
                  isMicMuted={isMicMuted}
                  hasCameraPermission={hasCameraPermission}
                  name={name}
                  isHandRaised={isHandRaised}
                  avatarUrl={localParticipant.avatarUrl}
                  videoEffect={videoEffect}
                  currentReaction={currentReaction}
              />
            </div>
          )}
          {otherParticipants.map((p: Participant) => (
            <div key={p.id} className="flex items-center justify-center w-full min-h-[300px]">
              <ParticipantVideo participant={p} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default VideoGrid;
