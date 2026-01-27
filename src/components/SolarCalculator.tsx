import { useState, useMemo, useEffect } from 'react';
import { Sun, Battery, ArrowRight, Leaf, TrendingUp, Info, Bot, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const SolarCalculator = ({ onReserveClick }: { onReserveClick?: () => void }) => {
    const { t } = useTranslation();
    const [bill, setBill] = useState(150);
    const [sunHours, setSunHours] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [report, setReport] = useState<{ verdict: string; summary: string; details: string[] } | null>(null);
    const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setReport(null);

        // Simulate AI Processing Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // AI Logic Simulation based on 'data'
        const verdict = data.paybackYears < 5 ? t('calculator.ai.excellent') : data.paybackYears < 8 ? t('calculator.ai.veryGood') : t('calculator.ai.good');

        setReport({
            verdict,
            summary: `${t('calculator.ai.summaryBase', { bill, sunHours, size: data.systemSizeKw.toFixed(1) })} ${t('calculator.ai.summaryROI', { roi: Math.round(data.roi) })}`,
            details: [
                t('calculator.ai.detailCashFlow', { loan: Math.round(data.loanPayment), savings: Math.round(data.initialMonthlySavings) }),
                t('calculator.ai.detailEnv', { co2: Math.round(data.annualCo2SavedKg / 1000), trees: Math.round(data.annualTrees) }),
                t('calculator.ai.detailPayback', { years: data.paybackYears.toFixed(1) })
            ]
        });
        setIsGenerating(false);
        setHasGeneratedReport(true);
    };

    // Reset report status when inputs change
    useEffect(() => {
        setHasGeneratedReport(false);
    }, [bill, sunHours]);

    // Constants for Spain (approximate)
    const ELECTRICITY_PRICE = 0.20; // €/kWh
    const PANEL_WATTAGE = 450; // W
    const SYSTEM_COST_PER_KW = 1100; // € (installed)
    const CO2_PER_KWH = 0.3; // kg
    const TREES_PER_TON_CO2 = 45; // trees per ton

    const FINANCING_RATE = 0.065; // 6.5% interest
    const FINANCING_YEARS = 10;

    const data = useMemo(() => {
        // 1. Calculate Consumption
        const monthlyKwh = bill / ELECTRICITY_PRICE;
        const annualKwh = monthlyKwh * 12;

        // 2. System Sizing
        const requiredKwp = annualKwh / (sunHours * 365 * 0.75);
        const panelCount = Math.ceil((requiredKwp * 1000) / PANEL_WATTAGE);
        const systemSizeKw = (panelCount * PANEL_WATTAGE) / 1000;

        // 3. Financials
        const totalSystemCost = systemSizeKw * SYSTEM_COST_PER_KW;
        const monthlyRate = FINANCING_RATE / 12;
        const numPayments = FINANCING_YEARS * 12;
        const loanPayment = (totalSystemCost * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

        // Savings
        const initialAnnualSavings = annualKwh * ELECTRICITY_PRICE;
        const initialMonthlySavings = initialAnnualSavings / 12;
        const netMonthlyBenefit = initialMonthlySavings - loanPayment;

        // ROI & Payback
        const paybackYears = totalSystemCost / initialAnnualSavings;
        const roi = ((initialAnnualSavings * 25 - totalSystemCost) / totalSystemCost) * 100;

        // 4. Environmental
        const annualCo2SavedKg = annualKwh * CO2_PER_KWH;
        const annualTrees = (annualCo2SavedKg / 1000) * TREES_PER_TON_CO2;

        return {
            panelCount,
            systemSizeKw,
            totalSystemCost,
            loanPayment,
            initialMonthlySavings,
            netMonthlyBenefit,
            paybackYears,
            roi,
            annualCo2SavedKg,
            annualTrees
        };
    }, [bill, sunHours]);

    return (
        <section className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 max-w-6xl mx-auto shadow-2xl overflow-hidden relative" aria-labelledby="calculator-title">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

            <div className="relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-xl text-primary">
                            <Sun className="w-8 h-8" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="calculator-title" className="text-2xl font-heading font-bold tracking-tight text-foreground">{t('calculator.title')}</h2>
                            <p className="text-muted-foreground text-sm">{t('calculator.subtitle')}</p>
                        </div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* INPUTS SECTION */}
                    <div className="lg:col-span-4 space-y-8 bg-secondary/30 p-6 rounded-2xl h-fit border border-white/5">
                        {/* Bill Input */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label htmlFor="bill-input" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('calculator.currentBill')}</label>
                                <span className="text-3xl font-mono font-bold text-primary">{bill}€</span>
                            </div>
                            <input
                                id="bill-input"
                                type="range"
                                min="50"
                                max="600"
                                step="10"
                                value={bill}
                                onChange={(e) => setBill(Number(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/90 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                                aria-valuemin={50}
                                aria-valuemax={600}
                                aria-valuenow={bill}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-mono" aria-hidden="true">
                                <span>50€</span>
                                <span>600€</span>
                            </div>
                        </div>

                        {/* Sun Hours Input */}
                        <div className="space-y-6 pt-6 border-t border-border/50">
                            <div className="flex justify-between items-end">
                                <label htmlFor="sun-input" className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{t('calculator.sunHours')}</label>
                                <span className="text-3xl font-mono font-bold text-primary">{sunHours}h</span>
                            </div>
                            <input
                                id="sun-input"
                                type="range"
                                min="3"
                                max="10"
                                step="0.5"
                                value={sunHours}
                                onChange={(e) => setSunHours(Number(e.target.value))}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary hover:accent-primary/90 transition-all focus-visible:ring-2 focus-visible:ring-primary"
                                aria-valuemin={3}
                                aria-valuemax={10}
                                aria-valuenow={sunHours}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground font-mono" aria-hidden="true">
                                <span>3h</span>
                                <span>10h ({t('calculator.sunHoursSummer')})</span>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-3 text-blue-300 text-sm">
                            <Info className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                            <p>{t('calculator.disclaimer')}</p>
                        </div>
                    </div>

                    {/* RESULTS SECTION */}
                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">

                        {/* Financial Card */}
                        <div className="md:col-span-2 bg-secondary rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group border border-border/50 shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50" />

                            <div className="space-y-4 relative z-10 w-full md:w-auto">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="text-accent w-5 h-5" aria-hidden="true" />
                                    <h3 className="font-bold text-lg text-foreground">{t('calculator.financialProjection')}</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-12 py-4 border-y border-border/50">
                                    <div>
                                        <p className="text-muted-foreground text-sm mb-1">{t('calculator.financingInstallment')}</p>
                                        <p className="text-2xl text-foreground font-mono font-bold">{Math.round(data.loanPayment)}€<span className="text-sm text-muted-foreground font-sans">{t('calculator.months')}</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground text-sm mb-1">{t('calculator.estimatedSavings')}</p>
                                        <p className="text-2xl text-accent font-mono font-bold">{Math.round(data.initialMonthlySavings)}€<span className="text-sm text-muted-foreground font-sans">{t('calculator.months')}</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 md:mt-0 md:ml-12 relative z-10 flex-shrink-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-4 border-secondary-foreground/10 flex items-center justify-center relative">
                                    {/* Static visual representation of 'autarky' or savings % */}
                                    <div className="absolute inset-0 rounded-full border-4 border-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0% 100%)' }} />

                                    <div className="text-center">
                                        <span className="block text-3xl font-bold text-foreground">92%</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('calculator.autarky')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* System Recommendation */}
                        <div className="bg-card/50 rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-colors">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 block">{t('calculator.recommendedSystem')}</span>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-foreground tracking-tighter">{data.panelCount}</span>
                                <span className="text-lg text-primary font-medium mb-1.5">{t('calculator.tier1Panels')}</span>
                            </div>
                            <p className="text-muted-foreground text-sm">{t('calculator.installedPower')}: <span className="text-foreground font-mono">{data.systemSizeKw.toFixed(1)} kWp</span></p>
                        </div>

                        {/* Cash Flow */}
                        <div className="bg-accent/5 rounded-2xl p-6 border border-accent/20 hover:bg-accent/10 transition-colors">
                            <span className="text-xs font-bold text-accent uppercase tracking-widest mb-4 block">{t('calculator.positiveCashFlow')}</span>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-accent tracking-tighter">+{Math.round(data.netMonthlyBenefit)}€</span>
                                <span className="text-lg text-accent/80 font-medium mb-1.5">{t('calculator.months')}</span>
                            </div>
                            <p className="text-accent/80 text-sm">{t('calculator.netSavings')}</p>
                        </div>

                        {/* Environmental Impact (Full Width) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-green-900/20 to-secondary/50 rounded-2xl p-6 border border-green-500/10 flex flex-wrap gap-8 items-center justify-center md:justify-around">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-green-500/10 text-green-400">
                                    <Leaf className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{(data.annualCo2SavedKg / 1000).toFixed(1)} Ton</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('calculator.co2Saved')}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border/50 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <Sun className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{Math.round(data.annualTrees)}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('calculator.trees')}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border/50 hidden md:block" />
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                    <Battery className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{data.paybackYears.toFixed(1)} {t('calculator.years')}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('calculator.roi')}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* AI REPORT SECTION */}
                <div className="mt-8 bg-blue-500/5 border border-blue-500/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Bot className="w-32 h-32 text-blue-400" aria-hidden="true" />
                    </div>

                    <div className="relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
                            <div className="flex-1 space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                                    Gemini Powered
                                </div>
                                <h3 className="text-2xl font-heading font-bold text-foreground">{t('calculator.ai.title')}</h3>
                                <p className="text-muted-foreground max-w-xl">
                                    {t('calculator.ai.desc')}
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleGenerateReport}
                                disabled={isGenerating || hasGeneratedReport}
                                className="flex-shrink-0 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t('calculator.ai.analyzing')}
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-5 h-5" aria-hidden="true" />
                                        {t('calculator.ai.generate')}
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Report Content */}
                        <AnimatePresence>
                            {report && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, y: 20 }}
                                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: 20 }}
                                    className="border-t border-blue-500/10 pt-6 mt-6"
                                >
                                    <div className="bg-background/40 backdrop-blur-md rounded-xl p-6 border border-blue-500/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h4 className="font-bold text-lg text-foreground">{t('calculator.ai.resultTitle')}: <span className={report.verdict === t('calculator.ai.excellent') ? 'text-emerald-400' : 'text-blue-400'}>{report.verdict}</span></h4>
                                        </div>

                                        <p className="text-slate-300 leading-relaxed mb-6">
                                            {report.summary}
                                        </p>

                                        <div className="grid md:grid-cols-3 gap-4">
                                            {report.details.map((detail, index) => (
                                                <div key={index} className="bg-background/60 p-4 rounded-lg border border-white/5">
                                                    <p className="text-sm text-slate-300">{detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onReserveClick}
                    className="mt-10 w-full py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    {t('calculator.bookStudy')}
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>
            </div>
        </section>
    );
};
