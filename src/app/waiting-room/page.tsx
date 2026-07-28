
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UAMVirtualLogo from "@/components/aula-connect-logo";
import { Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function WaitingRoomContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Captura todos los parámetros para reenviarlos
    const meetingName = searchParams.get('meetingName') || 'la reunión';
    const name = searchParams.get('name');
    const mic = searchParams.get('mic');
    const video = searchParams.get('video');
    const meetingId = searchParams.get('meetingId');
    const capacity = searchParams.get('capacity');

    useEffect(() => {
        const timer = setTimeout(() => {
            // Construye la URL de la conferencia con todos los parámetros necesarios
            const query = new URLSearchParams({
                meetingName: meetingName,
                name: name || 'Invitado',
                mic: mic || 'false',
                video: video || 'false',
                host: 'false',
                meetingId: meetingId || '',
                capacity: capacity || 'N/A'
            }).toString();
            
            router.push(`/conference?${query}`);
        }, 15000); // 15 segundos para la simulación

        return () => clearTimeout(timer);
    }, [router, meetingName, name, mic, video, meetingId, capacity]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <Card className="w-full max-w-md text-center border-none shadow-2xl rounded-[40px] bg-white overflow-hidden">
                <CardHeader className="p-10 pb-4">
                    <div className="flex justify-center mb-6">
                        <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-100">
                            <UAMVirtualLogo className="!w-8 !h-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-[#2D164B]">Sala de Espera</CardTitle>
                    <CardDescription className="text-slate-500 font-bold mt-2">Estás esperando para unirte a <br/> <span className="text-orange-500">"{meetingName}"</span></CardDescription>
                </CardHeader>
                <CardContent className="p-10 pt-4">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20" />
                            <Loader2 className="h-16 w-16 animate-spin text-orange-500 relative z-10" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-[#2D164B]">
                                Por favor, espera.
                            </p>
                            <p className="text-sm text-slate-400 font-bold leading-relaxed">
                                El anfitrión te permitirá entrar pronto. <br/> Serás redirigido automáticamente en unos segundos.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function WaitingRoomPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-400 font-bold">Cargando...</div>}>
            <WaitingRoomContent />
        </Suspense>
    );
}
