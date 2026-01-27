import { LucideZap, ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../common/Button';
import { useCart } from '../../context/CartContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LoginModal } from '../auth/LoginModal';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { toggleCart, itemCount } = useCart();
    const { t } = useTranslation();
    const { user, signOut, profile } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-secondary/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 mr-4"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <div className="flex bg-primary/10 p-2 rounded-xl">
                        <LucideZap className="h-6 w-6 text-primary" />
                    </div>
                    <span className="hidden sm:inline text-xl font-bold tracking-tight text-white">SolarGen</span>
                </Link>

                {/* Desktop Nav - Center */}
                <nav className="hidden lg:flex items-center gap-6">
                    <a href="#productos" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.products')}
                    </a>
                    <a href="#dsm" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.map3d')}
                    </a>
                    <a href="#calculator" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.calculator')}
                    </a>
                    <a href="#installers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        {t('nav.installers')}
                    </a>
                </nav>

                {/* Right Actions - Always Visible */}
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Language - Hidden on Tablet/Mobile */}
                    <div className="hidden xl:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Cart - Always Visible */}
                    <Button variant="ghost" size="sm" onClick={toggleCart} className="relative p-2 h-10 w-10 md:w-auto md:px-4">
                        <ShoppingCart className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-secondary">
                                {itemCount}
                            </span>
                        )}
                    </Button>

                    {/* Login / Profile - Always Visible */}
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Profile" className="h-8 w-8 rounded-full bg-white/10 object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                )}
                            </Link>
                            <button onClick={() => signOut()} className="hidden md:block text-slate-400 hover:text-white transition-colors" title="Cerrar sesión">
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setIsLoginModalOpen(true)}
                            className="px-3"
                        >
                            <span className="hidden md:inline">{t('common.login')}</span>
                            <User className="md:hidden h-5 w-5" />
                        </Button>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="xl:hidden text-slate-300 p-2 hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Menu */}
            {isMenuOpen && (
                <div className="xl:hidden border-t border-white/5 bg-secondary px-6 py-4 space-y-4 animate-in slide-in-from-top-4 shadow-2xl">
                    <nav className="flex flex-col gap-4 lg:hidden">
                        <a href="#productos" className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                            {t('nav.products')}
                        </a>
                        <a href="#dsm" className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                            {t('nav.map3d')}
                        </a>
                        <a href="#calculator" className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                            {t('nav.calculator')}
                        </a>
                        <a href="#installers" className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                            {t('nav.installers')}
                        </a>
                    </nav>

                    {/* Extra items that hide from top bar */}
                    <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                        <span className="text-slate-400 text-sm">{t('common.language')}</span>
                        <LanguageSwitcher />
                    </div>

                    {user && (
                        <div className="border-t border-white/5 pt-2">
                            <button
                                onClick={() => { signOut(); setIsMenuOpen(false); }}
                                className="flex items-center gap-3 w-full text-left text-sm font-medium text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                {t('common.logout')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </header>
    );
}
