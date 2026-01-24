import { ArrowUpRight, Zap, Battery, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

interface ProductCardProps {
    id?: string;
    title: string;
    price: number;
    power: string;
    savings: string;
    image?: string;
    popular?: boolean;
    popularityScore?: number;
    stock?: number;
    onAddToCart?: () => void;
    onViewDetails?: () => void;
    variant?: 'vertical' | 'horizontal';
}

export const ProductCard = ({ title, price, power, savings, image, popular, popularityScore, stock, onAddToCart, onViewDetails, variant = 'vertical' }: ProductCardProps) => {
    const isHorizontal = variant === 'horizontal';
    const { t } = useTranslation();

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={
                `relative group rounded-3xl p-[1px] h-full transition-all duration-300
                ${popular ? 'bg-gradient-to-br from-primary/50 to-emerald-600/30 shadow-glow' : 'bg-border/50 hover:bg-border'}`
            }
        >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl pointer-events-none" />

            <div className={`relative h-full bg-card/95 backdrop-blur-xl rounded-[23px] overflow-hidden flex flex-col ${isHorizontal ? 'md:flex-row' : ''}`}>

                {/* Image Section */}
                <div className={`relative overflow-hidden ${isHorizontal ? 'md:w-5/12 h-64 md:h-full' : 'h-52 md:h-64 w-full'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />

                    {/* Badges */}
                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                        {(popular || (popularityScore && popularityScore > 8)) && (
                            <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                                <Zap className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                                {popularityScore ? popularityScore.toFixed(1) : t('common.popular').toUpperCase()}
                            </div>
                        )}
                        {stock !== undefined && stock < 5 && (
                            <div className="bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse backdrop-blur-md">
                                {t('common.onlyLeft', { count: stock }).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <Zap className="w-16 h-16 text-muted-foreground/50" aria-hidden="true" />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div>
                        <h3
                            onClick={(e) => {
                                e.preventDefault();
                                onViewDetails?.();
                            }}
                            className={`font-heading font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors cursor-pointer hover:underline decoration-primary/50 underline-offset-4 ${isHorizontal ? 'text-2xl md:text-3xl' : 'text-xl'}`}
                        >
                            {title}
                        </h3>

                        <div className="flex flex-wrap items-baseline gap-2 mb-6">
                            <span className={`font-mono text-foreground font-medium ${isHorizontal ? 'text-3xl' : 'text-2xl'}`}>
                                {price.toLocaleString()}€
                            </span>
                            <span className="text-sm text-muted-foreground">/ kit completo</span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground group/item">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors">
                                    <Zap className="w-4 h-4" aria-hidden="true" />
                                </div>
                                <span className="truncate">{t('common.power')}: <span className="text-foreground font-medium">{power}</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground group/item">
                                <div className="p-1.5 rounded-lg bg-accent/10 text-accent group-hover/item:bg-accent group-hover/item:text-accent-foreground transition-colors">
                                    <Battery className="w-4 h-4" aria-hidden="true" />
                                </div>
                                <span className="truncate">{t('common.savings')}: <span className="text-foreground font-medium">{savings}</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onViewDetails?.();
                            }}
                            className="flex-1 min-h-[44px] py-3 rounded-xl border border-input bg-background/50 text-foreground text-sm font-medium hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                            aria-label={`Ver detalles de ${title}`}
                        >
                            <span>{t('common.viewDetails')}</span>
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>

                        {onAddToCart && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (stock !== undefined && stock === 0) return;
                                    onAddToCart();
                                }}
                                disabled={stock !== undefined && stock === 0}
                                className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center transition-all shadow-lg ${stock !== undefined && stock === 0
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-primary/20'
                                    }`}
                                aria-label={stock !== undefined && stock === 0 ? t('common.outOfStock') : `Añadir ${title} al carrito`}
                                title={stock !== undefined && stock === 0 ? t('common.outOfStock') : t('common.addToCart')}
                            >
                                <ShoppingCart className="w-5 h-5 fill-current" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
};
