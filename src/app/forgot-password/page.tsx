'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UAMVirtualLogo from '@/components/aula-connect-logo';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  securityAnswer1: z.string().min(1, { message: 'La respuesta es requerida.' }),
  securityAnswer2: z.string().min(1, { message: 'La respuesta es requerida.' }),
  securityAnswer3: z.string().min(1, { message: 'La respuesta es requerida.' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      securityAnswer1: '',
      securityAnswer2: '',
      securityAnswer3: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      toast({
        title: 'Correo de recuperación enviado',
        description: `Si los datos son correctos, recibirás un enlace para restablecer tu contraseña en ${data.email}.`,
      });
      router.push('/login');
    } catch (error: any) {
      console.error('Error al enviar correo (simulación):', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo completar la solicitud. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <UAMVirtualLogo className="mx-auto mb-4" />
          <CardTitle>Recuperar Contraseña</CardTitle>
          <CardDescription>Introduce tu correo y responde tus preguntas de seguridad.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="securityAnswer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Cuál es el nombre de tu mascota?</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu respuesta secreta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAnswer2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿En qué ciudad naciste?</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu respuesta secreta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityAnswer3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Cuál es el nombre de tu padre?</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu respuesta secreta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
