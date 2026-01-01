
import { useBudget } from '../context/BudgetContext';
import { calculateBudgetSummary } from '../utils/budgetCalculations';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';

export function SummaryDashboard() {
  const { state } = useBudget();
  const summary = calculateBudgetSummary(state);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetHealth = () => {
    if (summary.remaining < 0) return { label: 'Overspending', color: 'text-mcm-rust dark:text-mcm-coral' };
    if (summary.savingsRate >= 20) return { label: 'Excellent', color: 'text-mcm-olive dark:text-mcm-sage' };
    if (summary.savingsRate >= 10) return { label: 'Good', color: 'text-mcm-teal dark:text-mcm-seafoam' };
    return { label: 'Needs Improvement', color: 'text-mcm-mustard dark:text-mcm-gold' };
  };

  const budgetHealth = getBudgetHealth();

  return (
    <div className="bg-white dark:bg-mcm-slate border-4 border-mcm-charcoal dark:border-mcm-cream shadow-retro-lg p-8 card-angled">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-mcm-teal clip-path-diamond"></div>
        <h2 className="text-3xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Budget Summary
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gross Income */}
        <div className="bg-gradient-to-br from-mcm-teal to-mcm-deep-teal dark:from-mcm-teal/80 dark:to-mcm-deep-teal/80 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-mcm-mustard/20 clip-path-diamond transform rotate-45"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Gross Income
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-hexagon flex items-center justify-center">
              <DollarSign className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.grossIncome)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            {formatCurrency(summary.grossIncome / 12)} / month
          </div>
        </div>

        {/* Total Taxes */}
        <div className="bg-gradient-to-br from-mcm-rust to-mcm-burnt-orange dark:from-mcm-rust/80 dark:to-mcm-burnt-orange/80 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-20 h-20 pattern-chevron opacity-30"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Total Taxes
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-diamond flex items-center justify-center">
              <TrendingDown className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.taxes.total)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10 leading-relaxed">
            Fed: {formatCurrency(summary.taxes.federalIncome)} | FICA: {formatCurrency(summary.taxes.fica)} | State: {formatCurrency(summary.taxes.stateIncome)}
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-gradient-to-br from-mcm-sage to-mcm-olive dark:from-mcm-sage/80 dark:to-mcm-olive/80 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full transform -translate-x-8 -translate-y-8"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Net Income
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-hexagon flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.netIncome)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            {formatCurrency(summary.netIncome / 12)} / month
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-gradient-to-br from-mcm-coral to-mcm-burnt-orange dark:from-mcm-coral/80 dark:to-mcm-burnt-orange/80 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-diamond flex items-center justify-center">
              <TrendingDown className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            {formatCurrency(summary.totalExpenses / 12)} / month
          </div>
        </div>

        {/* Total Savings + Investments */}
        <div className="bg-gradient-to-br from-mcm-seafoam to-mcm-teal dark:from-mcm-seafoam/80 dark:to-mcm-teal/80 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-24 h-24 sunburst opacity-30"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Savings + Investments
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-hexagon flex items-center justify-center">
              <TrendingUp className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.totalSavings + summary.totalInvestments)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            {formatCurrency((summary.totalSavings + summary.totalInvestments) / 12)} / month
          </div>
        </div>

        {/* Remaining */}
        <div className={`${summary.remaining >= 0 ? 'bg-gradient-to-br from-mcm-sage to-mcm-olive' : 'bg-gradient-to-br from-mcm-rust to-mcm-coral'} border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden`}>
          <div className="absolute inset-0 pattern-grid opacity-20"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Discretionary
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-diamond flex items-center justify-center">
              {summary.remaining >= 0 ? (
                <TrendingUp className="text-white" size={16} />
              ) : (
                <TrendingDown className="text-white" size={16} />
              )}
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {formatCurrency(summary.remaining)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            {formatCurrency(summary.remaining / 12)} / month
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-gradient-to-br from-mcm-mustard to-mcm-gold dark:from-mcm-mustard/90 dark:to-mcm-gold/90 border-2 border-mcm-charcoal dark:border-mcm-cream p-5 relative overflow-hidden md:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 w-32 h-32 sunburst opacity-20"></div>
          <div className="flex items-center justify-between mb-3 relative z-10">
            <span className="text-xs font-display font-semibold text-white uppercase tracking-wider">
              Savings Rate
            </span>
            <div className="w-8 h-8 bg-white/20 clip-path-hexagon flex items-center justify-center">
              <Percent className="text-white" size={16} />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-white relative z-10">
            {summary.savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium relative z-10">
            of net income
          </div>
        </div>

        {/* Budget Health */}
        <div className="bg-mcm-warm-cream dark:bg-mcm-navy border-4 border-mcm-charcoal dark:border-mcm-mustard p-6 md:col-span-2 lg:col-span-2 relative overflow-hidden card-angled-both">
          <div className="absolute inset-0 pattern-diagonal opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-mcm-teal dark:bg-mcm-seafoam clip-path-diamond"></div>
              <span className="text-xs font-display font-semibold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-wider">
                Budget Health Indicator
              </span>
            </div>
            <div className={`text-4xl font-display font-bold ${budgetHealth.color} uppercase tracking-tight`}>
              {budgetHealth.label}
            </div>
            <div className="text-sm text-mcm-charcoal dark:text-mcm-cream mt-3 leading-relaxed">
              {summary.remaining < 0 && 'You are spending more than you earn. Consider reducing expenses or increasing income.'}
              {summary.remaining >= 0 && summary.savingsRate >= 20 && 'Great job! You\'re saving a healthy portion of your income.'}
              {summary.remaining >= 0 && summary.savingsRate >= 10 && summary.savingsRate < 20 && 'You\'re on track, but consider increasing your savings rate to 20% or more.'}
              {summary.remaining >= 0 && summary.savingsRate < 10 && 'Try to increase your savings rate to at least 10-20% of net income.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
