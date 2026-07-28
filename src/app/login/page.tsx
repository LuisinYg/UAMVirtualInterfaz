'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'El usuario es requerido.' }),
  password: z.string().min(1, { message: 'La contraseña no puede estar vacía.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const mockUser = {
        email: `${data.username}@uam.edu.mx`,
        displayName: data.username,
        username: data.username,
        firstName: data.username,
        lastName: 'UAM',
        createdAt: '2024'
      };

      sessionStorage.setItem('user', JSON.stringify(mockUser));

      toast({
        title: 'Acceso validado',
        description: 'Redirigiendo al panel principal...',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al iniciar sesión',
        description: 'Credenciales no válidas.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F0EFFF] p-4">
      <Card className="w-full max-w-[480px] border-none shadow-2xl shadow-purple-200/50 rounded-[40px] overflow-hidden bg-white">
        <CardContent className="p-8 md:p-12 space-y-8">
          {/* Header Logo & Badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-100">
                <UAMVirtualLogo className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#2D164B] leading-none">UAMVirtual</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sistema de Videoconferencias</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 px-3 py-1 rounded-full text-[10px] font-bold">
              Acceso seguro
            </Badge>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-[#2D164B]">Iniciar sesión</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Accede con tu nombre de usuario, contraseña y el código generado por tu aplicación autenticadora.
            </p>
          </div>

          {/* MFA Info Box */}
          <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100 space-y-2">
            <h4 className="text-sm font-black text-blue-700">Aplicación autenticadora obligatoria</h4>
            <p className="text-xs text-blue-600/80 font-medium leading-relaxed">
              Después de validar tu contraseña, deberás ingresar un código temporal de 6 dígitos generado por tu aplicación autenticadora.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-black text-[#2D164B]">Usuario</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej. IsraelGuerrero" 
                        {...field} 
                        className="rounded-2xl border-slate-200 h-14 bg-slate-50/30 focus:border-orange-500 focus:ring-orange-500 transition-all text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 font-medium">
                      Usa el nombre de usuario registrado en tu cuenta.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-sm font-black text-[#2D164B]">Contraseña</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                          className="rounded-2xl border-slate-200 h-14 bg-slate-50/30 focus:border-orange-500 focus:ring-orange-500 transition-all text-base pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-400 font-medium">
                      Puedes usar el botón del ojo para verificar la contraseña antes de continuar.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-600 h-14 rounded-2xl font-black text-white text-base shadow-xl shadow-orange-100 transition-all active:scale-[0.98]" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Verificando...' : 'Continuar'}
                </Button>
                
                <div className="flex items-center justify-center gap-4 text-xs font-bold">
                  <Link href="/signup" className="text-slate-400 hover:text-orange-500 transition-colors">Crear cuenta</Link>
                  <span className="text-slate-200">|</span>
                  <Link href="/forgot-password" className="text-slate-400 hover:text-orange-500 transition-colors">Recuperar contraseña</Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <footer className="fixed bottom-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        © 2024 UAMVirtual - Universidad Autónoma Metropolitana
      </footer>
    </div>
  );
}
