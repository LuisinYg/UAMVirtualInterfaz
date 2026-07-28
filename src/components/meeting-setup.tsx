
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MeetingSetupProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode: 'start' | 'join';
  userName: string;
}

const MeetingSetup = ({ isOpen, setIsOpen, mode, userName: initialUserName }: MeetingSetupProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [meetingId, setMeetingId] = useState('');
  const [userName, setUserName] = useState(initialUserName);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [meetingName, setMeetingName] = useState('Clase de Física Cuántica');
  const [maxParticipants, setMaxParticipants] = useState('2');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Sincronizar datos del usuario y avatar desde el almacenamiento de la sesión
    const userJson = sessionStorage.getItem('user');
    const savedAvatar = sessionStorage.getItem('avatarUrl');
    
    if (userJson) {
      const user = JSON.parse(userJson);
      setUserName(user.displayName || initialUserName);
    }
    
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, [isOpen, initialUserName]);

  useEffect(() => {
    if (mode === 'start' && isOpen) {
      const newMeetingId = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setMeetingId(newMeetingId);
    } else if (mode === 'join') {
      setMeetingId('');
    }
  }, [mode, isOpen]);

  const handleJoin = () => {
    if (mode === 'join' && !meetingId.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, introduce un ID de reunión.',
      });
      return;
    }
    if (!userName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, introduce tu nombre.',
      });
      return;
    }
    if (mode === 'start' && !meetingName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, introduce un nombre para la videollamada.',
      });
      return;
    }

    setIsOpen(false);
    
    const isHost = mode === 'start';
    const finalMeetingName = isHost ? meetingName : `Reunión de ${meetingId}`;
    
    const url = `/meeting-confirmation?name=${encodeURIComponent(userName)}&mic=${isAudioMuted}&video=${isVideoMuted}&meetingName=${encodeURIComponent(finalMeetingName)}&host=${isHost}&meetingId=${meetingId}${isHost ? `&capacity=${maxParticipants}` : ''}`;
    router.push(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingId);
    toast({
        title: 'Copiado',
        description: 'ID de la reunión copiado al portapapeles.',
    });
  }

  const getInitials = (name: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px] bg-card text-card-foreground p-0 rounded-[32px] overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-center text-2xl font-black text-[#2D164B]">
            {mode === 'start' ? 'Iniciar una reunión' : 'Unirse a una reunión'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-8 pt-0 flex flex-col gap-6">
          <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10 rounded-2xl">
                  <AvatarImage src={avatarUrl || `https://picsum.photos/seed/${userName}/200`} alt={userName} />
                  <AvatarFallback className="text-2xl font-bold bg-orange-500 text-white">{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                 <Label htmlFor="user-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tu Nombre</Label>
                 <Input 
                    id="user-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Introduce tu nombre"
                    className="rounded-xl border-slate-200"
                 />
              </div>
          </div>

          {mode === 'start' ? (
             <>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="meeting-name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Videollamada</Label>
                    <Input 
                        id="meeting-name"
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                        placeholder="E.g., Clase de Física Cuántica"
                        className="rounded-xl border-slate-200"
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <Label htmlFor="setup-capacity" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Capacidad de personas</Label>
                    <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                      <SelectTrigger id="setup-capacity" className="rounded-xl border-slate-200">
                        <SelectValue placeholder="Seleccionar capacidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} personas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="meeting-id" className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID de la reunión para compartir</Label>
                    <div className="flex items-center gap-2">
                        <Input id="meeting-id" value={meetingId} readOnly className="bg-slate-50 border-slate-100 rounded-xl font-mono text-center"/>
                        <Button variant="outline" size="icon" onClick={copyToClipboard} className="rounded-xl border-slate-100">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
             </>
          ) : (
            <div className="flex flex-col gap-2">
                <Label htmlFor="join-meeting-id" className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID de la reunión</Label>
                <Input 
                    id="join-meeting-id" 
                    placeholder="Introduce el código o enlace"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    className="rounded-xl border-slate-200 font-mono tracking-widest text-center"
                />
            </div>
          )}
          
          <div className="space-y-4 pt-2">
              <p className="text-xs font-black text-[#2D164B] uppercase tracking-[0.2em]">Opciones para unirse</p>
               <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Label htmlFor="audio-muted" className="font-bold text-slate-700">Conectar sin audio</Label>
                    <Switch 
                        id="audio-muted" 
                        checked={isAudioMuted}
                        onCheckedChange={setIsAudioMuted}
                    />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <Label htmlFor="video-muted" className="font-bold text-slate-700">Desactivar mi vídeo</Label>
                    <Switch 
                        id="video-muted" 
                        checked={isVideoMuted}
                        onCheckedChange={setIsVideoMuted}
                    />
                </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex gap-3">
            <DialogClose asChild>
                <Button variant="ghost" className="rounded-xl font-bold">Cancelar</Button>
            </DialogClose>
          <Button onClick={handleJoin} className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-xl font-black text-white shadow-lg shadow-orange-100">
            {mode === 'start' ? 'Iniciar ahora' : 'Unirse'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingSetup;
