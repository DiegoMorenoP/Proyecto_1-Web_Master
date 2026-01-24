import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { useState } from 'react';
import { useToast } from '../common/Toast';

const leadSchema = z.object({
    name: z.string().min(2, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(9, "Teléfono inválido"),
});

type LeadForm = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
    const [success, setSuccess] = useState(false);
    const { showToast } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<LeadForm>({
        resolver: zodResolver(leadSchema)
    });

    const onSubmit = async (data: LeadForm) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Lead captured:", data);
        setSuccess(true);
        showToast('Solicitud enviada correctamente', 'success');

        setTimeout(() => {
            setSuccess(false);
            reset();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                    />

                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            {success ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">¡Solicitud Recibida!</h3>
                                    <p className="text-muted-foreground">Un experto solar se pondrá en contacto contigo en menos de 24 horas.</p>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Estudio Gratuito</h2>
                                            <p className="text-sm text-muted-foreground">Descubre cuánto puedes ahorrar hoy mismo.</p>
                                        </div>
                                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Nombre Completo</label>
                                            <input
                                                {...register('name')}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="Tu nombre"
                                            />
                                            {errors.name && <span className="text-xs text-destructive">{errors.name.message}</span>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Email</label>
                                            <input
                                                {...register('email')}
                                                type="email"
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="tu@email.com"
                                            />
                                            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Teléfono</label>
                                            <input
                                                {...register('phone')}
                                                type="tel"
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                                placeholder="+34 600 000 000"
                                            />
                                            {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-full mt-4 py-4 text-base gap-2"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                "Enviando..."
                                            ) : (
                                                <>
                                                    Solicitar Estudio <Calendar className="w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
