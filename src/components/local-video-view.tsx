
'use client';

import { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import type { VideoEffect } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

interface LocalVideoViewProps {
  stream: MediaStream | null;
  isCameraOff: boolean;
  isMicMuted: boolean;
  hasCameraPermission: boolean;
  name: string;
  isHandRaised: boolean;
  avatarUrl?: string;
  videoEffect: VideoEffect;
  currentReaction: string | null;
}

const LocalVideoView = ({ 
  stream, 
  isCameraOff, 
  isMicMuted, 
  hasCameraPermission, 
  name, 
  isHandRaised, 
  videoEffect,
  currentReaction,
}: LocalVideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const showVideo = !isCameraOff && hasCameraPermission;

  return (
    <Card className="relative group overflow-hidden rounded-[32px] aspect-video flex flex-col items-center justify-center bg-[#1A1C24] border-none shadow-2xl shadow-purple-900/10 w-full h-full">
      
      <video
        ref={videoRef}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity z-10', 
          !showVideo && 'opacity-0',
          videoEffect.type === 'blur' && 'blur-2xl'
        )}
        autoPlay
        muted
        playsInline
      />
      
      {!showVideo && (
        <div className="flex flex-col items-center gap-6 z-20">
          <div className="relative">
            <Avatar className="h-36 w-36 text-5xl bg-[#2D303D] border-4 border-white/5 shadow-2xl">
              <AvatarFallback className="text-4xl font-black text-white bg-gradient-to-br from-[#3E4251] to-[#1A1C24]">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isHandRaised && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 right-6 bg-orange-500 p-2.5 rounded-full z-30 shadow-lg"
          >
              <Hand className="h-5 w-5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {currentReaction && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl z-40 pointer-events-none animate-bounce">
          {currentReaction}
        </div>
      )}

      <div className="absolute bottom-6 left-6 right-6 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/5 flex items-center justify-between px-6 z-30">
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-black text-white">{name}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center border transition-all",
            isMicMuted ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white"
          )}>
            {isMicMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </div>
          <div className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center border transition-all",
            isCameraOff ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white"
          )}>
            {isCameraOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LocalVideoView;
