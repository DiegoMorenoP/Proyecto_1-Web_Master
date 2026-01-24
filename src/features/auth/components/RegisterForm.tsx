import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { type RegisterFormData, registerSchema } from '../schemas';

export function RegisterForm() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        role: 'user' // Explicitly set default role, though DB trigger handles it too
                    }
                }
            });

            if (error) throw error;

            // Supabase default is "Confirm Email" unless disabled.
            // Assuming auto-confirm enabled for MVP dev, or showing check email message.
            navigate('/');
            // Ideally show a toast: "Check your email"
        } catch (err: any) {
            setError(err.message || 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Crear Cuenta
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
                            Nombre Completo
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            placeholder="Juan Pérez"
                            {...register('fullName')}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            placeholder="tu@email.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            {...register('confirmPassword')}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-400">Error</h3>
                                <div className="mt-2 text-sm text-red-300">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Registrarse'
                    )}
                </button>
            </form>
        </div>
    );
}
