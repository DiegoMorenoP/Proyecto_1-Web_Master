import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { type LoginFormData, loginSchema } from '../schemas';

interface LoginFormProps {
    onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const navigate = useNavigate();
    // We can use the context to check session, but Supabase auth functions are direct
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) throw error;

            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Inicia Sesión
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
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
                            autoComplete="current-password"
                            className="mt-1 block w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                        )}
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
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
                        'Iniciar Sesión'
                    )}
                </button>
            </form>
        </div>
    );
}
