
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
    if (summary.remaining < 0) return { label: 'OVERSPENDING', color: 'neon-red' };
    if (summary.savingsRate >= 20) return { label: 'EXCELLENT', color: 'neon-green' };
    if (summary.savingsRate >= 10) return { label: 'GOOD', color: 'neon-cyan' };
    return { label: 'NEEDS IMPROVEMENT', color: 'neon-yellow' };
  };

  const budgetHealth = getBudgetHealth();

  return (
    <div className="cyber-card rounded-lg p-4 relative overflow-hidden">
      <div className="scanline-effect"></div>
      <h2 className="text-2xl font-bold mb-4 neon-cyan uppercase tracking-wider">
        Budget Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Gross Income */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(0, 240, 255, 0.4)',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-cyan">
              Gross Income
            </span>
            <DollarSign className="neon-cyan" size={16} />
          </div>
          <div className="text-xl font-bold neon-cyan">
            {formatCurrency(summary.grossIncome)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-cyan)' }}>
            {formatCurrency(summary.grossIncome / 12)} / mo
          </div>
        </div>

        {/* Total Taxes */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(255, 0, 85, 0.4)',
            boxShadow: '0 0 15px rgba(255, 0, 85, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-red">
              Taxes
            </span>
            <TrendingDown className="neon-red" size={16} />
          </div>
          <div className="text-xl font-bold neon-red">
            {formatCurrency(summary.taxes.total)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-red)' }}>
            {formatCurrency(summary.taxes.total / 12)} / mo
          </div>
        </div>

        {/* Net Income */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(0, 255, 136, 0.4)',
            boxShadow: '0 0 15px rgba(0, 255, 136, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-green">
              Net Income
            </span>
            <TrendingUp className="neon-green" size={16} />
          </div>
          <div className="text-xl font-bold neon-green">
            {formatCurrency(summary.netIncome)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-green)' }}>
            {formatCurrency(summary.netIncome / 12)} / mo
          </div>
        </div>

        {/* Total Expenses */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 0, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(255, 255, 0, 0.4)',
            boxShadow: '0 0 15px rgba(255, 255, 0, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-yellow">
              Expenses
            </span>
            <TrendingDown className="neon-yellow" size={16} />
          </div>
          <div className="text-xl font-bold neon-yellow">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-yellow)' }}>
            {formatCurrency(summary.totalExpenses / 12)} / mo
          </div>
        </div>

        {/* Total Savings + Investments */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(157, 0, 255, 0.4)',
            boxShadow: '0 0 15px rgba(157, 0, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-purple">
              Savings+Invest
            </span>
            <TrendingUp className="neon-purple" size={16} />
          </div>
          <div className="text-xl font-bold neon-purple">
            {formatCurrency(summary.totalSavings + summary.totalInvestments)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-purple)' }}>
            {formatCurrency((summary.totalSavings + summary.totalInvestments) / 12)} / mo
          </div>
        </div>

        {/* Remaining */}
        <div
          className="rounded-lg p-3"
          style={{
            background: summary.remaining >= 0
              ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)'
              : 'linear-gradient(135deg, rgba(255, 0, 85, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: summary.remaining >= 0
              ? '2px solid rgba(0, 255, 136, 0.4)'
              : '2px solid rgba(255, 0, 85, 0.4)',
            boxShadow: summary.remaining >= 0
              ? '0 0 15px rgba(0, 255, 136, 0.2)'
              : '0 0 15px rgba(255, 0, 85, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-bold uppercase tracking-wide ${summary.remaining >= 0 ? 'neon-green' : 'neon-red'}`}>
              Remaining
            </span>
            {summary.remaining >= 0 ? (
              <TrendingUp className="neon-green" size={16} />
            ) : (
              <TrendingDown className="neon-red" size={16} />
            )}
          </div>
          <div className={`text-xl font-bold ${summary.remaining >= 0 ? 'neon-green' : 'neon-red'}`}>
            {formatCurrency(summary.remaining)}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: summary.remaining >= 0 ? 'var(--cyber-green)' : 'var(--cyber-red)' }}>
            {formatCurrency(summary.remaining / 12)} / mo
          </div>
        </div>

        {/* Savings Rate */}
        <div
          className="rounded-lg p-3"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(255, 0, 255, 0.4)',
            boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-magenta">
              Savings Rate
            </span>
            <Percent className="neon-magenta" size={16} />
          </div>
          <div className="text-xl font-bold neon-magenta">
            {summary.savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-magenta)' }}>
            of net income
          </div>
        </div>

        {/* Budget Health */}
        <div
          className="rounded-lg p-3 pulse-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(0, 240, 255, 0.5)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wide neon-cyan">
              Health
            </span>
          </div>
          <div className={`text-lg font-bold ${budgetHealth.color} uppercase tracking-wide`}>
            {budgetHealth.label}
          </div>
          <div className="text-xs opacity-70 mt-1" style={{ color: 'var(--cyber-cyan)' }}>
            {summary.remaining < 0 && 'Over budget'}
            {summary.remaining >= 0 && summary.savingsRate >= 20 && 'Strong position'}
            {summary.remaining >= 0 && summary.savingsRate >= 10 && summary.savingsRate < 20 && 'On track'}
            {summary.remaining >= 0 && summary.savingsRate < 10 && 'Improve savings'}
          </div>
        </div>
      </div>
    </div>
  );
}
