'use client';
import ConferenceLayout from "@/components/conference-layout";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ConferencePageContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Dr. Evelyn Reed';
  const meetingName = searchParams.get('meetingName') || 'Videollamada';
  const micMuted = searchParams.get('mic') === 'true';
  const videoOff = searchParams.get('video') === 'true';
  const isHost = searchParams.get('host') === 'true';

  return <ConferenceLayout 
    initialName={name} 
    initialMeetingName={meetingName} 
    initialMicMuted={micMuted} 
    initialVideoOff={videoOff}
    isHost={isHost}
  />;
}

export default function ConferencePage() {
  return (
    <main className="w-full h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center h-full">Cargando...</div>}>
        <ConferencePageContent />
      </Suspense>
    </main>
  );
}
