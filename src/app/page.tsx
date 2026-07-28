'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { 
  Play, 
  Video, 
  History, 
  User, 
  ArrowRight, 
  LogOut, 
  RefreshCw,
} from 'lucide-react';
import MeetingSetup from '@/components/meeting-setup';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/lib/hooks/use-toast';

// Mock user type for simulation
type MockUser = {
  displayName: string;
  email: string;
  username?: string;
}

export default function Home() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [setupMode, setSetupMode] = useState<'start' | 'join'>('start');
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
      const savedAvatar = sessionStorage.getItem('avatarUrl');
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  const handleStartMeeting = () => {
    setSetupMode('start');
    setIsSetupOpen(true);
  };

  const handleJoinMeeting = () => {
    setSetupMode('join');
    setIsSetupOpen(true);
  };

  const handleSignOut = async () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('avatarUrl');
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-slate-400">
        <p>Cargando...</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).slice(0, 1).join('').toUpperCase();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F7FF]">
      {/* Header Estilo Pill */}
      <header className="p-4 flex items-center justify-between container mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
             <UAMVirtualLogo className="!w-8 !h-8" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">Aula Virtual</h1>
            <p className="text-xs text-slate-500">Bienvenido, {user.username || user.displayName.split(' ')[0]}</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60 shadow-sm">
          <Button variant="ghost" size="sm" className="rounded-full px-4 hover:bg-white hover:shadow-sm">Inicio</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={() => router.push('/rooms')}>Salas</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={() => router.push('/recordings')}>Grabaciones</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4" onClick={() => router.push('/profile')}>Mi Perfil</Button>
          <Button variant="secondary" size="sm" className="rounded-full px-4 bg-slate-100/80">
            <RefreshCw className="mr-2 h-3 w-3" />
            Renovar sesión
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full px-4 text-slate-600 hover:text-red-500" onClick={handleSignOut}>
            Salir
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 max-w-xl">
            <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 font-semibold px-3 py-0.5 rounded-full text-xs">
              Aula Virtual
            </Badge>
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#2D164B] tracking-tight leading-[1.1]">
              Tu espacio para clases y reuniones.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Crea una sala, entra a una conferencia o consulta tus grabaciones desde un panel simple y organizado.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-2xl px-8 h-12 text-base font-bold" onClick={() => router.push('/rooms')}>
                Ir a salas
              </Button>
              <Button size="lg" variant="ghost" className="bg-slate-200/50 hover:bg-slate-200 text-slate-700 rounded-2xl px-8 h-12 text-base font-bold" onClick={() => router.push('/recordings')}>
                Ver grabaciones
              </Button>
            </div>
          </div>

          {/* Current Session Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm border-none shadow-2xl shadow-purple-200/50 rounded-[32px] overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-orange-100 rounded-2xl animate-pulse" />
                    <Avatar className="h-16 w-16 rounded-2xl border-2 border-white relative z-10 shadow-lg shadow-orange-200">
                      <AvatarImage src={avatarUrl || `https://picsum.photos/seed/${user.email}/200`} />
                      <AvatarFallback className="bg-orange-500 text-white font-bold text-2xl">
                        {getInitials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">Sesión Actual</span>
                    <h3 className="text-xl font-bold text-slate-900">{user.username || user.displayName}</h3>
                    <p className="text-sm text-slate-400">Cuenta: Cuenta activa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Action Cards Section */}
        <section className="space-y-8">
          <div>
            <span className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">Acciones Principales</span>
            <h3 className="text-3xl font-bold text-[#2D164B]">¿Qué necesitas hacer?</h3>
            <p className="text-slate-500">Accede directamente a las funciones más utilizadas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              icon={<Play className="h-5 w-5 text-orange-500" />}
              title="Crear o entrar a una sala"
              description="Inicia una conferencia o usa un código de acceso."
              onClick={handleStartMeeting}
              gradient="from-orange-50 to-white"
            />
            <ActionCard 
              icon={<History className="h-5 w-5 text-amber-600" />}
              title="Consultar grabaciones"
              description="Reproduce y descarga las sesiones autorizadas."
              onClick={() => router.push('/recordings')}
            />
            <ActionCard 
              icon={<User className="h-5 w-5 text-slate-500" />}
              title="Revisar mi cuenta"
              description="Consulta tu perfil y la configuración de seguridad."
              onClick={() => router.push('/profile')}
            />
          </div>
        </section>
      </main>

      <footer className="mt-auto p-8 text-center text-slate-400 text-xs">
        © 2024 Aula Virtual - Plataforma de Videoconferencias Académicas
      </footer>

      <MeetingSetup
        isOpen={isSetupOpen}
        setIsOpen={setIsSetupOpen}
        mode={setupMode}
        userName={user.displayName || ''}
      />
    </div>
  );
}

function ActionCard({ icon, title, description, onClick, gradient = "from-white to-white" }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  onClick: () => void;
  gradient?: string;
}) {
  return (
    <button 
      onClick={onClick}
      className={`group flex items-center gap-5 p-6 rounded-[24px] bg-gradient-to-br ${gradient} border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-purple-100 hover:-translate-y-1 transition-all text-left w-full`}
    >
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:bg-orange-50 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-sm text-slate-500 leading-tight pr-4">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </button>
  );
}
