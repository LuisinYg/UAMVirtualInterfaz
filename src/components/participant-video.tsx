
'use client';

import { Mic, MicOff, Video, VideoOff, Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import type { Participant } from '@/lib/types';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

interface ParticipantVideoProps {
  participant: Participant;
  isMainFeed?: boolean;
}

const ParticipantVideo = ({ participant, isMainFeed = false }: ParticipantVideoProps) => {
  return (
    <Card
      className={cn(
        'relative group overflow-hidden rounded-[32px] aspect-video flex flex-col items-center justify-center bg-[#1A1C24] border-none shadow-2xl shadow-purple-900/10 w-full h-full',
        participant.isSpeaking && !isMainFeed && 'ring-4 ring-green-500/30'
      )}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {participant.isSpeaking && (
            <div className="absolute -inset-4 bg-white/5 rounded-full animate-ping opacity-20" />
          )}
          <Avatar className="h-36 w-36 text-5xl bg-[#2D303D] border-4 border-white/5 shadow-2xl">
            <AvatarFallback className="text-4xl font-black text-white bg-gradient-to-br from-[#3E4251] to-[#1A1C24]">
              {participant.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <AnimatePresence>
        {participant.isHandRaised && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-6 right-6 bg-orange-500 p-2.5 rounded-full z-10 shadow-lg shadow-orange-500/20"
          >
              <Hand className="h-5 w-5 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 right-6 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/5 flex items-center justify-between px-6 z-10">
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-black text-white">{participant.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center border transition-all",
            participant.isMuted ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white"
          )}>
            {participant.isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </div>
          <div className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center border transition-all",
            participant.isCameraOff ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white"
          )}>
            {participant.isCameraOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ParticipantVideo;
