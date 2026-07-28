'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { 
  Play,
  Minus,
  ChevronRight,
  RotateCw,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function RecordingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userJson = sessionStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F0EFFF]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 gap-6 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <UAMVirtualLogo className="!w-6 !h-6" />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 leading-none">UAMVirtual</span>
            <span className="text-[10px] text-slate-400">Videoconferencias</span>
          </div>
        </div>

        <nav className="space-y-1">
          <SidebarLink label="Inicio" onClick={() => router.push('/')} />
          <SidebarLink label="Salas" onClick={() => router.push('/rooms')} />
          <SidebarLink label="Mis grabaciones" active onClick={() => {}} />
          <SidebarLink label="Cuenta" onClick={() => router.push('/profile')} />
        </nav>

        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Usuario Actual</span>
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white shadow-sm">
              <Avatar className="h-10 w-10 rounded-xl bg-orange-500 shadow-md shadow-orange-100 border-2 border-white">
                <AvatarFallback className="text-white font-bold">L</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">Luis01</p>
                <p className="text-[10px] text-slate-400 font-medium">Rol: user</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Seguridad</span>
            <div className="space-y-2">
              <StatusRow label="Cuenta" value="Cuenta activa" />
              <StatusRow label="Autenticador" value="Activo" />
              <StatusRow label="Preguntas" value="Configuradas" />
              <Button variant="outline" size="sm" className="w-full text-[10px] h-9 rounded-xl bg-[#F0EFFF] border-none text-[#2D164B] font-bold hover:bg-[#E6E4FF]">
                Revisar seguridad
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase">Sesión</span>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-[10px] h-9 rounded-xl bg-white border border-slate-100 text-slate-900 font-bold hover:bg-slate-50">
                Renovar sesión
              </Button>
              <Button variant="outline" size="sm" className="w-full text-[10px] h-9 rounded-xl bg-white border border-slate-100 text-slate-900 font-bold hover:bg-slate-50" onClick={() => {
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
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Biblioteca de Grabaciones Header Card */}
        <Card className="border-none shadow-xl shadow-purple-200/20 rounded-[32px] overflow-hidden bg-white">
          <CardContent className="p-10 space-y-4 bg-gradient-to-r from-white to-orange-50/30">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase">Biblioteca de grabaciones</span>
                <h1 className="text-5xl font-black text-[#2D164B] tracking-tight">Mis grabaciones</h1>
                <p className="text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
                  Consulta, reproduce y descarga las grabaciones asociadas a tu cuenta. El acceso se determina mediante la propiedad de la grabación, la sesión que la originó, el rol histórico de anfitrión o los permisos de administrador global.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Button variant="secondary" className="bg-[#F0EFFF] text-[#2D164B] hover:bg-[#E6E4FF] font-black rounded-2xl h-12 px-6 shadow-sm border-none">
                  Recargar
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-12 px-6 shadow-lg shadow-orange-100 border-none">
                  Subida manual
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total visible" value="0" description="Grabaciones autorizadas para tu cuenta." />
          <StatsCard title="Protegidas" value="0" description="Archivos registrados con protección y metadatos." />
          <StatsCard title="Espacio visible" value="0B" description="Tamaño acumulado de los resultados actuales." />
        </div>

        {/* Listing and Player Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listado Card */}
          <Card className="border-none shadow-xl shadow-purple-200/20 rounded-[32px] bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Listado</span>
                <h2 className="text-xl font-black text-[#2D164B]">Grabaciones disponibles</h2>
                <p className="text-xs text-slate-400 font-medium">0 grabación(es) disponible(s).</p>
              </div>

              <div className="flex gap-2">
                <Input 
                  placeholder="Filtrar por conference_id" 
                  className="rounded-2xl border-slate-100 h-11 bg-slate-50/50"
                />
                <Button className="rounded-2xl px-6 bg-[#F0EFFF] text-[#2D164B] hover:bg-[#E6E4FF] font-black h-11">Aplicar</Button>
              </div>

              {/* Table Headers */}
              <div className="flex items-center justify-between px-6 py-3 bg-white rounded-full border border-slate-100 shadow-sm">
                <span className="text-[10px] font-black text-[#2D164B] uppercase tracking-tighter">Grabación</span>
                <span className="text-[10px] font-black text-[#2D164B] uppercase tracking-tighter">Conferencia</span>
                <span className="text-[10px] font-black text-[#2D164B] uppercase tracking-tighter">Estado</span>
                <span className="text-[10px] font-black text-[#2D164B] uppercase tracking-tighter">Tamaño</span>
                <span className="text-[10px] font-black text-[#2D164B] uppercase tracking-tighter">Protección</span>
              </div>

              <div className="h-56 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[24px] bg-white text-slate-300">
                <p className="text-sm font-medium">No hay grabaciones disponibles.</p>
              </div>
            </CardContent>
          </Card>

          {/* Selección Card */}
          <Card className="border-none shadow-xl shadow-purple-200/20 rounded-[32px] bg-white">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Selección</span>
                  <h2 className="text-xl font-black text-[#2D164B]">Grabación actual</h2>
                  <p className="text-xs text-slate-400 font-medium">Selecciona una grabación para reproducirla.</p>
                </div>
                <div className="bg-orange-50 p-1.5 rounded-full shadow-sm border border-orange-100">
                  <Minus className="h-3 w-3 text-orange-500" />
                </div>
              </div>

              <div className="aspect-video bg-[#1a1a1a] rounded-3xl flex items-center justify-center relative group overflow-hidden border border-slate-200">
                <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
                   <Play className="h-4 w-4 text-white fill-current opacity-80" />
                   <div className="h-1.5 bg-white/20 flex-1 rounded-full">
                      <div className="h-full bg-orange-500 w-0 rounded-full" />
                   </div>
                   <span className="text-[10px] text-white font-mono opacity-80">0:00</span>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl h-11 shadow-lg shadow-orange-100">
                  Reproducir
                </Button>
                <Button variant="secondary" className="bg-[#F0EFFF] text-[#2D164B] hover:bg-[#E6E4FF] font-black rounded-2xl h-11">
                  Descargar original
                </Button>
                <Button variant="secondary" className="bg-[#F0EFFF] text-[#2D164B] hover:bg-[#E6E4FF] font-black rounded-2xl h-11">
                  Descargar MP4
                </Button>
                <Button variant="outline" className="border-slate-100 text-slate-900 font-black rounded-2xl h-11 hover:bg-slate-50">
                  Ver metadatos
                </Button>
                <Button variant="outline" className="border-slate-100 text-slate-900 font-black rounded-2xl h-11 hover:bg-slate-50">
                  Limpiar reproductor
                </Button>
              </div>

              <div className="p-8 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[24px] bg-white text-slate-300">
                <p className="text-sm font-medium">No hay grabación seleccionada.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Expandable Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden border border-slate-50">
              <button className="w-full p-5 flex items-center gap-3 text-[#2D164B] font-black hover:bg-slate-50 transition-colors">
                 <Play className="h-3 w-3 fill-current rotate-0" />
                 <span className="text-sm">Metadatos de grabación</span>
              </button>
           </Card>
           <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden border border-slate-50">
              <button className="w-full p-5 flex items-center gap-3 text-[#2D164B] font-black hover:bg-slate-50 transition-colors">
                 <Play className="h-3 w-3 fill-current rotate-0" />
                 <span className="text-sm">Salida técnica</span>
              </button>
           </Card>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
        active 
          ? 'bg-orange-50 text-orange-600 font-black shadow-sm shadow-orange-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold'
      }`}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatusRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-1">
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{label}</span>
      <span className="text-[10px] font-black text-slate-900">{value}</span>
    </div>
  );
}

function StatsCard({ title, value, description }: { title: string, value: string, description: string }) {
  return (
    <Card className="border-none shadow-xl shadow-purple-200/20 rounded-[32px] bg-white">
      <CardContent className="p-8 space-y-2">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{title}</span>
        <h3 className="text-5xl font-black text-[#2D164B] tracking-tight">{value}</h3>
        <p className="text-[10px] text-slate-400 leading-relaxed font-bold max-w-[200px]">{description}</p>
      </CardContent>
    </Card>
  );
}
