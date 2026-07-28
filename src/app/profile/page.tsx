'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { 
  ShieldCheck,
  Smartphone,
  HelpCircle,
  Lock,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F0EFFF] text-slate-400 font-bold">
        Cargando...
      </div>
    );
  }

  const handleSignOut = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('avatarUrl');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F0EFFF] flex flex-col font-body">
      {/* Header Estilo Pill */}
      <header className="p-6 flex items-center justify-between container mx-auto bg-transparent">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
             <UAMVirtualLogo className="!w-6 !h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 leading-none text-base">UAMVirtual</span>
            <span className="text-[10px] text-slate-400 font-bold">Usuario: {user.username || 'Luis01'}</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/60 shadow-sm">
          <Button variant="ghost" size="sm" className="rounded-full px-5 font-bold text-slate-700 hover:bg-white" onClick={() => router.push('/')}>Inicio</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-5 font-bold text-slate-700 hover:bg-white" onClick={() => router.push('/rooms')}>Salas</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-5 font-bold text-slate-700 hover:bg-white" onClick={() => router.push('/recordings')}>Grabaciones</Button>
          <Button variant="secondary" size="sm" className="rounded-full px-5 bg-white text-slate-900 font-black shadow-sm border border-slate-100">Mi Perfil</Button>
          <Button variant="ghost" size="sm" className="rounded-full px-5 font-bold text-slate-700 hover:bg-white">
            Renovar sesión
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full px-5 font-bold text-slate-700 hover:bg-white" onClick={handleSignOut}>
            Cerrar sesión
          </Button>
        </nav>
      </header>

      <main className="flex-1 container mx-auto px-6 py-8 space-y-12">
        {/* Profile Hero Section */}
        <Card className="border-none shadow-2xl shadow-purple-200/40 rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-slate-200 to-white rounded-full" />
                <Avatar className="h-32 w-32 border-4 border-white shadow-2xl relative z-10">
                  <AvatarFallback className="text-4xl font-black text-white bg-gradient-to-br from-slate-700 to-slate-900">
                    L
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Mi Perfil</span>
                  <h1 className="text-6xl font-black text-[#2D164B] tracking-tighter">Luis01</h1>
                  <p className="text-sm font-bold text-orange-500">Configuración personal y seguridad de la cuenta</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-bold text-slate-400">
                  <p>Rol: <span className="text-slate-500 font-black">user</span></p>
                  <p>Estado: <span className="text-slate-500 font-black">pending_security_questions</span></p>
                  <p>MFA: <span className="text-slate-500 font-black">Activo</span></p>
                </div>
                
                <p className="text-sm font-bold text-slate-400">
                  Correo: <span className="text-slate-500 font-black">l******i@gmail.com</span>
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
                <Button className="bg-orange-500 hover:bg-orange-600 h-14 rounded-2xl font-black text-white text-base px-10 shadow-xl shadow-orange-100 transition-all active:scale-[0.98]">
                  Recargar perfil
                </Button>
                <Button className="bg-[#E11D48] hover:bg-red-700 h-14 rounded-2xl font-black text-white text-base px-10 shadow-xl shadow-red-100 transition-all active:scale-[0.98]">
                  Cerrar sesiones
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-none shadow-2xl shadow-purple-200/40 rounded-[40px] bg-white overflow-hidden">
          <CardContent className="p-12 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-black text-orange-500 uppercase tracking-widest">Estado General</span>
                <h2 className="text-3xl font-black text-[#2D164B]">Seguridad de la cuenta</h2>
              </div>
              <Badge className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-wider">
                Configuración pendiente
              </Badge>
            </div>
            
            <p className="text-slate-400 font-bold text-sm">Configura tus dos preguntas de seguridad para completar la cuenta.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SecurityCard 
                title="Aplicación autenticadora"
                value="Aplicación autenticadora configurada."
                description="Protege el acceso mediante códigos temporales."
              />
              <SecurityCard 
                title="Preguntas de seguridad"
                value="Pendiente de configurar dos preguntas."
                description="Permiten validar identidad y recuperar acceso."
              />
              <SecurityCard 
                title="Funciones críticas"
                value="Bloqueado"
                description="Habilita salas, grabación y consulta de archivos."
              />
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="p-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
        © 2024 UAMVirtual - Universidad Autónoma Metropolitana
      </footer>
    </div>
  );
}

function SecurityCard({ title, value, description }: { title: string, value: string, description: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-all group">
      <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest group-hover:text-orange-400 transition-colors">{title}</span>
      <h3 className="text-xl font-black text-[#2D164B] tracking-tight leading-tight">
        {value}
      </h3>
      <p className="text-xs font-bold text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
