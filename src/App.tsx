
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { SolarCalculator } from './components/SolarCalculator';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CatalogService } from './features/catalog/CatalogService';
import type { Kit } from './types';
import { Loader2, Sun, ArrowRight } from 'lucide-react';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { SolarDsmSection } from './features/technology/SolarDsmSection';
import { ToastProvider } from './components/common/Toast';

import { InstallerSection } from './components/trust/InstallerSection';
import { CartProvider, useCart } from './context/CartContext';
import { useTranslation } from 'react-i18next';


import { LeadFormModal } from './components/common/LeadFormModal';
import { ProductDetailModal } from './components/products/ProductDetailModal';

import { HeroSection } from './components/layout/HeroSection';
import { TestimonialsSection } from './components/trust/TestimonialsSection';

function HomePage() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Kit | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const { addItem } = useCart();
  const { t } = useTranslation();

  const scrollToSimulator = () => {
    const element = document.getElementById('calculator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    CatalogService.getKits().then(data => {
      setKits(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection onScrollToSimulator={scrollToSimulator} />

      <div className="container mx-auto px-4 py-12 space-y-24">
        {/* Calculator Section */}
        <div id="calculator" className="scroll-mt-24">
          <SolarCalculator onReserveClick={() => setIsLeadFormOpen(true)} />
        </div>

        {/* Solar Mapping DSM Technology */}
        <SolarDsmSection />

        {/* Products Section - Bento Grid */}
        <section id="productos" className="scroll-mt-32" aria-labelledby="products-title">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Sun className="w-3 h-3" />
                Catálogo 2024
              </span>
              <h2 id="products-title" className="text-3xl md:text-5xl font-heading font-bold text-foreground">
                {t('sections.featuredKits')}
              </h2>
            </div>
            <button
              onClick={() => {
                const element = document.getElementById('productos-grid');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-primary hover:text-primary/80 font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-lg px-2 py-1 flex items-center gap-2"
            >
              {t('common.viewAll')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div id="productos-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-fr">
              {kits.map((kit, index) => (
                <div
                  key={kit.id}
                  className={index === 1 ? "md:col-span-2" : "md:col-span-1"}
                >
                  <div className="h-full">
                    <ProductCard
                      id={kit.id}
                      title={kit.name}
                      price={Number(kit.price)}
                      power={`${kit.total_power}kW`}
                      savings="Estimado 400€/año" // Still hardcoded for now or needs to be dynamic
                      popular={kit.type === 'hybrid'}
                      variant={index === 1 ? 'horizontal' : 'vertical'}
                      image={kit.image_url || undefined}
                      stock={kit.stock || Math.floor(Math.random() * 8)} // Demo Scarcity: Random stock < 8
                      onAddToCart={() => addItem(kit)}
                      onViewDetails={() => setSelectedProduct(kit)}
                    />
                  </div>
                </div>
              ))}
              {/* Fallback if no kits found in DB locally yet */}
              {kits.length === 0 && (
                <div className="col-span-3 text-center text-muted-foreground py-10">
                  No se encontraron kits en la base de datos.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Modals */}
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onAddToCart={addItem}
        />
        <LeadFormModal
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
        />

        {/* Installers Section */}
        <InstallerSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Why Choose Us / Trust Section */}
        <section className="grid md:grid-cols-3 gap-8 py-12 border-t border-border/50">
          {[
            { title: t('sections.guarantee.title'), desc: t('sections.guarantee.desc') },
            { title: t('sections.installation.title'), desc: t('sections.installation.desc') },
            { title: t('sections.support.title'), desc: t('sections.support.desc') }
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-secondary/20 border border-white/5">
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* Protected Routes Example */}
            <Route element={<ProtectedRoute />}>
              {/* Add protected routes here later, e.g. /profile, /orders */}
            </Route>

            {/* Admin Routes Example */}
            <Route element={<ProtectedRoute requireAdmin />}>
              {/* Add admin routes here later, e.g. /admin/dashboard */}
            </Route>
          </Routes>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
