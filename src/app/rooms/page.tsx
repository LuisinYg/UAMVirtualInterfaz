
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { 
  Home, 
  Video, 
  History, 
  User, 
  LogOut,
  ChevronRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RoomsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('2');

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, introduce un nombre para la sala.',
      });
      return;
    }
    const meetingId = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const url = `/meeting-confirmation?name=${encodeURIComponent(user?.displayName || 'Usuario')}&meetingName=${encodeURIComponent(roomName)}&host=true&mic=false&video=false&meetingId=${meetingId}&capacity=${maxParticipants}`;
    router.push(url);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Por favor, introduce el código de la sala.',
      });
      return;
    }
    const url = `/meeting-confirmation?meetingName=${encodeURIComponent('Sala ' + roomCode)}&name=${encodeURIComponent(user?.displayName || 'Invitado')}&mic=false&video=false&host=false&meetingId=${roomCode.toUpperCase()}`;
    router.push(url);
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F0EFFF]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 gap-6 shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-2 mb-2">
          <UAMVirtualLogo className="!w-8 !h-8" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">UAMVirtual</span>
            <span className="text-[10px] text-slate-400">Videoconferencias</span>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink icon={<Home className="h-4 w-4" />} label="Inicio" onClick={() => router.push('/')} />
          <SidebarLink icon={<Video className="h-4 w-4" />} label="Salas" active onClick={() => {}} />
          <SidebarLink icon={<History className="h-4 w-4" />} label="Grabaciones" onClick={() => router.push('/recordings')} />
          <SidebarLink icon={<User className="h-4 w-4" />} label="Cuenta" onClick={() => router.push('/profile')} />
        </nav>

        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Usuario Actual</span>
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarImage src={`https://picsum.photos/seed/${user.email}/200`} />
                <AvatarFallback className="bg-orange-500 text-white">L</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{user.username || 'Luis01'}</p>
                <p className="text-[10px] text-slate-400 font-medium">Rol: user</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Seguridad</span>
            <div className="space-y-2">
              <StatusRow label="Cuenta" value="Activa" />
              <StatusRow label="Autenticador" value="Activo" />
              <StatusRow label="Preguntas" value="Configuradas" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Estado</span>
            <div className="space-y-2">
              <StatusRow label="Conexión segura" value="HTTPS activo" isGreen />
              <StatusRow label="Backend" value="Disponible" isGreen />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Sesión</span>
            <div className="space-y-2">
              <Button variant="outline" className="w-full h-11 rounded-2xl border-slate-100 text-slate-900 font-black text-xs hover:bg-slate-50 shadow-sm">
                Renovar sesión
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-2xl border-slate-100 text-slate-900 font-black text-xs hover:bg-slate-50 shadow-sm" onClick={() => {
                sessionStorage.removeItem('user');
                router.push('/login');
              }}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header Card */}
        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-10 space-y-2 bg-gradient-to-r from-white to-orange-50/30">
            <span className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">Videoconferencias</span>
            <h1 className="text-5xl font-black text-[#2D164B]">Salas</h1>
            <p className="text-slate-500 max-w-2xl font-medium">
              Crea una nueva sala o entra a una reunión mediante el código público compartido por el anfitrión.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Room Card */}
          <Card className="border-none shadow-sm rounded-[32px] bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-orange-500 uppercase">Anfitrión</span>
                  <h2 className="text-2xl font-bold text-[#2D164B]">Crear una sala</h2>
                </div>
                <Badge className="bg-orange-100 text-orange-600 border-none hover:bg-orange-100 px-4 py-1 rounded-full">Nueva</Badge>
              </div>
              
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Define los datos de la reunión. El backend generará el identificador interno y un código público único para compartir con los participantes.
              </p>

              <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex flex-col gap-1">
                <span className="text-sm font-bold text-green-700">Cuenta activa</span>
                <span className="text-xs text-green-600/80 font-medium">Tu cuenta cumple los requisitos para crear, entrar y administrar salas.</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="room-name" className="font-bold text-slate-900 text-sm">Nombre de la sala</Label>
                  <Input 
                    id="room-name"
                    placeholder="Ejemplo: Clase de Redes" 
                    className="rounded-xl border-slate-200 h-12"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-capacity" className="font-bold text-slate-900 text-sm">Capacidad de personas</Label>
                  <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                    <SelectTrigger id="room-capacity" className="rounded-xl border-slate-200 h-12">
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

                <div className="space-y-2">
                  <Label htmlFor="room-desc" className="font-bold text-slate-900 text-sm">Descripción <span className="text-slate-300 font-normal ml-1">Opcional</span></Label>
                  <Textarea 
                    id="room-desc"
                    placeholder="Describe brevemente el propósito de la reunión." 
                    className="rounded-xl border-slate-200 min-h-[100px] resize-none"
                  />
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black text-white shadow-xl shadow-orange-100 transition-all active:scale-[0.98]" onClick={handleCreateRoom}>
                  Crear sala ahora
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Join Room Card */}
          <Card className="border-none shadow-sm rounded-[32px] bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-orange-500 uppercase">Participante</span>
                  <h2 className="text-2xl font-bold text-[#2D164B]">Entrar con código</h2>
                </div>
                <Badge variant="outline" className="border-blue-100 text-blue-500 bg-blue-50/50 px-4 py-1 rounded-full">Acceso</Badge>
              </div>
              
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                Escribe el código público proporcionado por el anfitrión de la reunión.
              </p>

              <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex flex-col gap-1">
                <span className="text-sm font-bold text-green-700">Acceso disponible</span>
                <span className="text-xs text-green-600/80 font-medium">Tu cuenta puede entrar a una sala mediante su código público.</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="join-code" className="font-bold text-slate-900 text-sm">Código de la sala</Label>
                  <Input 
                    id="join-code"
                    placeholder="K7M4-PQ9X" 
                    className="rounded-xl border-slate-200 h-14 text-center font-mono tracking-widest text-lg bg-slate-50/50"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Puedes escribirlo con o sin guion.</p>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black text-white shadow-xl shadow-orange-100 transition-all active:scale-[0.98]" onClick={handleJoinRoom}>
                  Entrar a la sala
                </Button>

                <div className="p-6 rounded-[24px] border-2 border-dashed border-slate-100 space-y-2">
                  <span className="text-sm font-black text-[#2D164B] block uppercase tracking-tight">Código público</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    El código público se utiliza únicamente para localizar la sala y solicitar acceso. No otorga permisos de administración.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guía de Funcionamiento y Diagnóstico */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-12 pb-24 border-t border-slate-200/60">
          {/* Columna Funcionamiento */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase">FLUJO</span>
              <h3 className="text-3xl font-black text-[#2D164B] tracking-tight">Funcionamiento</h3>
            </div>
            
            <div className="space-y-4">
              <GuideStep 
                number="1" 
                title="Crear" 
                description="El anfitrión define el nombre, la descripción y la capacidad máxima de la sala." 
              />
              <GuideStep 
                number="2" 
                title="Registrar" 
                description="El backend registra la sala en PostgreSQL, asigna el host y genera el identificador interno." 
              />
              <GuideStep 
                number="3" 
                title="Generar código" 
                description="El backend genera un código público único, por ejemplo K7M4-PQ9X." 
              />
              <GuideStep 
                number="4" 
                title="Compartir" 
                description="El anfitrión comparte solamente el código público con los participantes." 
              />
              <GuideStep 
                number="5" 
                title="Validar acceso" 
                description="El backend valida la cuenta, el estado de la sala, el código, el bloqueo, la expulsión y la capacidad disponible." 
              />
              <GuideStep 
                number="6" 
                title="Conectar" 
                description={<span>Tras autorizar el ingreso, el sistema usa el <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-slate-600">conference_id</code> canónico para la conexión y los servicios internos.</span>} 
              />
            </div>
          </div>

          {/* Columna Diagnóstico */}
          <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-black text-orange-500 tracking-[0.2em] uppercase">DIAGNÓSTICO</span>
              <h3 className="text-3xl font-black text-[#2D164B] tracking-tight">Respuesta técnica</h3>
            </div>

            <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden border border-slate-100">
              <CardContent className="p-0">
                <button className="w-full p-6 flex items-center gap-3 text-[#2D164B] font-black hover:bg-slate-50 transition-colors text-left group">
                   <div className="bg-slate-100 p-1.5 rounded-lg group-hover:bg-white transition-colors">
                      <ChevronRight className="h-3 w-3 text-[#2D164B] transition-transform group-hover:translate-x-0.5" />
                   </div>
                  <span className="text-sm">Ver detalles técnicos</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
        active 
          ? 'bg-orange-50 text-orange-600 font-black shadow-sm shadow-orange-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold'
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatusRow({ label, value, isGreen }: { label: string, value: string, isGreen?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{label}</span>
      <span className={`text-[10px] font-black uppercase tracking-tighter ${isGreen ? 'text-green-600' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}

function GuideStep({ number, title, description }: { number: string; title: string; description: React.ReactNode }) {
  return (
    <div className="p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col gap-2 group hover:shadow-md transition-all">
      <h4 className="text-base font-black text-[#2D164B]">
        <span className="text-orange-500 mr-2">{number}.</span>
        {title}
      </h4>
      <p className="text-xs text-slate-400 font-bold leading-relaxed">
        {description}
      </p>
    </div>
  );
}
