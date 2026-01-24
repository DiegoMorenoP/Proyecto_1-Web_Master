import { GlassContainer } from '../common/GlassContainer';
import { Badge } from '../common/Badge';
import { MapPin, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const INSTALLERS = [
    {
        id: 1,
        name: "SolarTech Madrid",
        location: "Madrid, España",
        rating: 4.9,
        reviews: 124,
        verified: true,
        avatar: "ST"
    },
    {
        id: 2,
        name: "EcoInstall BCN",
        location: "Barcelona, España",
        rating: 4.8,
        reviews: 89,
        verified: true,
        avatar: "EI"
    },
    {
        id: 3,
        name: "Valencia Renovables",
        location: "Valencia, España",
        rating: 5.0,
        reviews: 56,
        verified: true,
        avatar: "VR"
    }
];

export function InstallerSection() {
    const { t } = useTranslation();

    return (
        <section id="installers" className="py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-xl">
                        <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20">
                            <ShieldCheck className="w-3 h-3 mr-2" />
                            {t('installers.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            <Trans i18nKey="installers.title" components={{ 1: <span className="text-primary" /> }} />
                        </h2>
                        <p className="text-slate-400 text-lg">
                            {t('installers.desc')}
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-slate-400 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-primary" />
                            {t('installers.count')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            4.9/5 {t('installers.rating')}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {INSTALLERS.map(installer => (
                        <GlassContainer key={installer.id} className="p-6 hover:border-primary/30 transition-colors group cursor-pointer">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/10 group-hover:scale-110 transition-transform">
                                        {installer.avatar}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold group-hover:text-primary transition-colors">{installer.name}</h3>
                                        <div className="flex items-center text-xs text-slate-400">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {installer.location}
                                        </div>
                                    </div>
                                </div>
                                {installer.verified && (
                                    <div className="text-primary" title="Verificado">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-mono">{installer.rating}</span>
                                    <span className="text-slate-500 text-xs">({installer.reviews})</span>
                                </div>
                                <button className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                                    {t('installers.viewProfile')} →
                                </button>
                            </div>
                        </GlassContainer>
                    ))}
                </div>
            </div>
        </section>
    );
}
