
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, Zap } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '../common/Button';

import { useState } from 'react';
import { DemoVideoModal } from '../common/DemoVideoModal';

export const HeroSection = ({ onScrollToSimulator }: { onScrollToSimulator: () => void }) => {
    const { t } = useTranslation();
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background Video/Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background/90 z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background z-10" />

                {/* Simulated Video Background (using image for now) */}
                <img
                    src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=3264&auto=format&fit=crop"
                    alt="Solar Energy"
                    className="w-full h-full object-cover opacity-60 scale-105 animate-slow-zoom"
                />
            </div>

            <div className="container relative z-20 px-4 mx-auto text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
                    >
                        <Zap className="w-4 h-4 text-primary fill-current animate-pulse" />
                        <span className="text-sm font-medium text-slate-200 uppercase tracking-wider">
                            {t('dsm.badge') || "Next-Gen Solar Tech"}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter text-white"
                    >
                        <Trans i18nKey="hero.title" components={{ 1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400" /> }} />
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t('hero.subtitle')}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onScrollToSimulator}
                            className="w-full md:w-auto text-lg h-14 px-8 shadow-[0_0_40px_-10px_rgba(34,197,94,0.6)] hover:shadow-[0_0_60px_-10px_rgba(34,197,94,0.8)] transition-shadow duration-500"
                        >
                            {t('hero.cta.simulate')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setIsVideoOpen(true)}
                            className="w-full md:w-auto text-lg h-14 px-8 border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md"
                        >
                            <Play className="w-5 h-5 mr-2 fill-current" />
                            {t('hero.cta.video')}
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            >
                <ChevronDown className="w-8 h-8 text-white/30" />
            </motion.div>

            <DemoVideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoId="gREIBeiXgak"
            />
        </section>
    );
}
