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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import UAMVirtualLogo from '@/components/aula-connect-logo';
import { Separator } from '@/components/ui/separator';

const signupSchema = z.object({
  firstName: z.string().min(1, { message: 'El nombre es requerido.' }),
  lastName: z.string().min(1, { message: 'El apellido es requerido.' }),
  username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "La contraseña debe contener al menos una letra mayúscula.",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "La contraseña debe contener al menos una letra minúscula.",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "La contraseña debe contener al menos un número.",
    })
    .refine((password) => /[^A-Za-z0-9]/.test(password), {
      message: "La contraseña debe contener al menos un carácter especial.",
    }),
  securityAnswer1: z.string().min(1, { message: 'La respuesta es requerida.' }),
  securityAnswer2: z.string().min(1, { message: 'La respuesta es requerida.' }),
  securityAnswer3: z.string().min(1, { message: 'La respuesta es requerida.' }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      securityAnswer1: '',
      securityAnswer2: '',
      securityAnswer3: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    const { email, firstName, lastName, username } = data;

    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Simulación de creación de cuenta exitosa con todos los campos
      const mockUser = {
        email: email,
        displayName: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        username: username,
        createdAt: new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date())
      };

      sessionStorage.setItem('user', JSON.stringify(mockUser));

      toast({
        title: '¡Cuenta creada!',
        description: 'Tu cuenta ha sido creada exitosamente (simulación). Serás redirigido.',
      });
      router.push('/');
    } catch (error: any) {
      console.error('Error al registrar (simulación):', error);
      toast({
        variant: 'destructive',
        title: 'Error al registrar',
        description: 'Ha ocurrido un error en la simulación. Por favor, inténtalo de nuevo.',
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
          <CardTitle>Crear una Cuenta</CardTitle>
          <CardDescription>Regístrate para empezar a usar la aplicación</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="juanperez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                      Debe tener 8+ caracteres, incluir mayúsculas, minúsculas, números y un símbolo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              <div className="space-y-2">
                <h4 className="font-medium text-center">Preguntas de Seguridad</h4>
                <p className="text-sm text-muted-foreground text-center">Añade una capa extra de seguridad para recuperar tu cuenta.</p>
              </div>

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
              
              <Button type="submit" className="w-full !mt-8" disabled={isLoading}>
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
