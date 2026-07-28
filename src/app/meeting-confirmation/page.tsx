
'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/use-toast';
import { Copy, ArrowLeft } from 'lucide-react';

function MeetingConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const meetingName = searchParams.get('meetingName') || 'Videollamada';
  const meetingId = searchParams.get('meetingId') || '5SCA-EYVF';
  const role = searchParams.get('host') === 'true' ? 'Anfitrión' : 'Participante';
  const name = searchParams.get('name') || 'Invitado';
  const mic = searchParams.get('mic') || 'false';
  const video = searchParams.get('video') || 'false';
  const capacity = searchParams.get('capacity') || 'N/A';
  const isHost = searchParams.get('host') === 'true';

  const handleEnter = () => {
    const baseUrl = isHost ? '/conference' : '/waiting-room';
    const query = new URLSearchParams({
      meetingName,
      name,
      mic,
      video,
      host: isHost.toString(),
      meetingId,
      capacity
    }).toString();
    
    router.push(`${baseUrl}?${query}`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(meetingId);
    toast({
      title: 'Código copiado',
      description: 'El código de la sala se ha copiado al portapapeles.',
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4">
      <header className="fixed top-0 left-0 p-4 w-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Cuenta activa
      </header>
      
      <Card className="w-full max-w-2xl border-none shadow-2xl shadow-slate-200/50 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-12 space-y-10 text-center">
          <div className="flex justify-center">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              Sala disponible
            </Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black text-[#2D164B] tracking-tighter">{meetingName}</h1>
            <p className="text-sm text-slate-400 font-bold">
              Estás por entrar a <span className="text-slate-600">{meetingName}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoBox label="CÓDIGO" value={meetingId} />
            <InfoBox label="ESTADO" value="Acceso validado" />
            <InfoBox label="ROL" value={role} />
            <InfoBox label="CAPACIDAD" value={capacity === 'N/A' ? 'Ilimitada' : `${capacity} pers.`} />
          </div>

          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleEnter}
              className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-2xl font-black text-white text-base shadow-xl shadow-orange-100 transition-all active:scale-[0.98]"
            >
              Entrar a la sala
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={copyCode}
                className="h-14 rounded-2xl border-slate-100 text-slate-900 font-black text-sm hover:bg-slate-50 shadow-sm"
              >
                Copiar código
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="h-14 rounded-2xl border-slate-100 text-slate-900 font-black text-sm hover:bg-slate-50 shadow-sm"
              >
                Volver
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-[24px] bg-white border border-slate-100 shadow-sm space-y-2 group hover:shadow-md transition-all">
      <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{label}</span>
      <p className="text-sm font-black text-[#2D164B] truncate">{value}</p>
    </div>
  );
}

export default function MeetingConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <MeetingConfirmationContent />
    </Suspense>
  );
}
