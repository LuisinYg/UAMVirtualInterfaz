'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Ban, Image as ImageIcon, Sparkles, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VideoEffect } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  videoEffect: VideoEffect;
  setVideoEffect: (effect: VideoEffect) => void;
}

const backgroundImages = [
  { id: 'office', src: 'https://images.unsplash.com/photo-1554224716-5c81d24c3a37?q=80&w=1920&auto=format&fit=crop', alt: 'Oficina moderna' },
  { id: 'library', src: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1920&auto=format&fit=crop', alt: 'Biblioteca' },
  { id: 'cafe', src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1920&auto=format&fit=crop', alt: 'Cafetería acogedora' },
];

const shortcuts = [
    { key: 'M', description: 'Activar/silenciar micrófono' },
    { key: 'V', description: 'Activar/detener vídeo' },
    { key: 'S', description: 'Compartir/dejar de compartir pantalla' },
    { key: 'H', description: 'Levantar/bajar la mano' },
    { key: 'F', description: 'Activar/desactivar modo de enfoque' },
    { key: 'C', description: 'Mostrar/ocultar chat' },
    { key: 'P', description: 'Mostrar/ocultar participantes' },
];

const SettingsDialog = ({ isOpen, setIsOpen, videoEffect, setVideoEffect }: SettingsDialogProps) => {

  const handleEffectChange = (type: VideoEffect['type'], value?: string) => {
    if (type === 'background' && value) {
        setVideoEffect({ type, value });
    } else if (type === 'blur') {
        setVideoEffect({ type });
    } else {
        setVideoEffect({ type: 'none' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl">
            Ajustes
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="video" className="w-full">
            <TabsList className="mx-6">
                <TabsTrigger value="video">Vídeo</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
            </TabsList>

            <TabsContent value="video" className="p-6 pt-4">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Fondo y efectos</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Elige un efecto para aplicar a tu fondo. Esto es solo una simulación visual.
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            <button
                                className={cn(
                                'aspect-video rounded-lg flex flex-col items-center justify-center gap-1 border-2 transition-colors',
                                videoEffect.type === 'none' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                                )}
                                onClick={() => handleEffectChange('none')}
                            >
                                <Ban className="h-6 w-6" />
                                <span className="text-xs font-medium">Ninguno</span>
                            </button>
                            <button
                                className={cn(
                                'aspect-video rounded-lg flex flex-col items-center justify-center gap-1 border-2 transition-colors',
                                videoEffect.type === 'blur' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                                )}
                                onClick={() => handleEffectChange('blur')}
                            >
                                <Sparkles className="h-6 w-6" />
                                <span className="text-xs font-medium">Desenfoque</span>
                            </button>
                            {backgroundImages.map((img) => (
                                <button
                                    key={img.id}
                                    className={cn(
                                        'relative aspect-video rounded-lg overflow-hidden border-2 transition-colors group',
                                        videoEffect.type === 'background' && videoEffect.value === img.src ? 'border-primary' : 'border-transparent hover:border-primary/50'
                                    )}
                                    onClick={() => handleEffectChange('background', img.src)}
                                >
                                    <Image src={img.src} alt={img.alt} layout="fill" objectFit="cover" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="audio" className="p-6 pt-4">
                <p className="text-muted-foreground">Ajustes de audio no disponibles en esta demo.</p>
            </TabsContent>
            <TabsContent value="general" className="p-6 pt-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Keyboard className="h-5 w-5" />
                            Atajos de Teclado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {shortcuts.map(shortcut => (
                                <li key={shortcut.key} className="flex items-center justify-between">
                                    <span>{shortcut.description}</span>
                                    <kbd className="px-2 py-1.5 text-xs font-semibold text-foreground bg-secondary rounded-md">
                                        {shortcut.key}
                                    </kbd>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 pt-4 bg-secondary/50">
            <DialogClose asChild>
                <Button variant="default">Cerrar</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
