'use client';

import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScreenShareViewProps {
  stream: MediaStream | null;
  name: string;
}

const ScreenShareView = ({ stream, name }: ScreenShareViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return (
      <Card className="w-full h-full flex flex-col items-center justify-center bg-foreground text-background rounded-lg shadow-lg min-h-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl font-bold">{name} está compartiendo su pantalla</CardTitle>
          <CardDescription className="text-background/80">Cargando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-black aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default ScreenShareView;
