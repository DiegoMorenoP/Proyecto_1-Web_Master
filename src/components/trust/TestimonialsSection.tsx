
import { Star, User, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Carlos Rodríguez",
        role: "Propietario en Madrid",
        text: "La simulación fue exacta. Me dijeron que ahorraría 400€ al año y tras 6 meses estoy ahorrando incluso más. El proceso de instalación fue impecable.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 2,
        name: "Ana Morales",
        role: "Casa de Campo en Toledo",
        text: "Increíble la tecnología de mapeo solar. Me mostraron exactamente dónde poner los paneles para máxima eficiencia. Muy recomendado.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
        id: 3,
        name: "David K.",
        role: "Chalet en Valencia",
        text: "El servicio post-venta es de otro nivel. Tuve una duda con el inversor y me llamaron en 5 minutos. Profesionales de verdad.",
        rating: 5,
        image: null
    }
];

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                        Confianza que genera <span className="text-primary">Energía</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Únete a más de 2.000 hogares que ya han dado el paso hacia la independencia energética con SolarGen.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl relative hover:border-primary/20 transition-colors group"
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            <p className="text-slate-300 mb-8 leading-relaxed">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4">
                                {t.image ? (
                                    <img
                                        src={t.image}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <User className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-foreground">{t.name}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10">
                        <span className="text-yellow-500 font-bold">4.9/5</span>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            ))}
                        </div>
                        <span className="text-muted-foreground ml-2 text-sm">basado en +500 reseñas verificadas</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
