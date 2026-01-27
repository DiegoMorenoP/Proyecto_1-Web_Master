
import { Badge } from '../../components/common/Badge';
import { Scan, Box, Layers, MousePointer2 } from 'lucide-react';
import { SolarMap } from './SolarMap';
import { useTranslation, Trans } from 'react-i18next';

export function SolarDsmSection() {
    const { t } = useTranslation();

    return (
        <section id="dsm" className="py-24 relative">
            <div className="container mx-auto px-4 relative z-10 w-full">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[50px] p-8 md:p-12 shadow-2xl relative overflow-hidden" style={{ borderRadius: '50px' }}>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text Content */}
                        <div className="space-y-6">
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
                                <Scan className="w-3 h-3 mr-2" />
                                {t('dsm.badge')}
                            </Badge>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                                <Trans i18nKey="dsm.title" components={{ 1: <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400" /> }} />
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                <Trans i18nKey="dsm.desc" components={{ 1: <strong /> }} />
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    { icon: Box, text: t('dsm.features.obstacles') },
                                    { icon: Layers, text: t('dsm.features.efficiency') },
                                    { icon: MousePointer2, text: t('dsm.features.optimalArea') }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                            <item.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        {item.text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: Functional Solar Map */}
                        <div className="relative aspect-square md:aspect-video lg:aspect-square h-[500px] w-full">
                            <SolarMap />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
