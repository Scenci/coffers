
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
    if (summary.remaining < 0) return { label: 'Overspending', color: 'text-red-600 dark:text-red-400' };
    if (summary.savingsRate >= 20) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (summary.savingsRate >= 10) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    return { label: 'Needs Improvement', color: 'text-yellow-600 dark:text-yellow-400' };
  };

  const budgetHealth = getBudgetHealth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Budget Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gross Income */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Gross Income
            </span>
            <DollarSign className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(summary.grossIncome)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(summary.grossIncome / 12)} / month
          </div>
        </div>

        {/* Total Taxes */}
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Taxes
            </span>
            <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(summary.taxes.total)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Federal: {formatCurrency(summary.taxes.federalIncome)} |
            FICA: {formatCurrency(summary.taxes.fica)} |
            State: {formatCurrency(summary.taxes.stateIncome)}
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Net Income
            </span>
            <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(summary.netIncome)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(summary.netIncome / 12)} / month
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Expenses
            </span>
            <TrendingDown className="text-orange-600 dark:text-orange-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(summary.totalExpenses)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(summary.totalExpenses / 12)} / month
          </div>
        </div>

        {/* Total Savings + Investments */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Savings + Investments
            </span>
            <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {formatCurrency(summary.totalSavings + summary.totalInvestments)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency((summary.totalSavings + summary.totalInvestments) / 12)} / month
          </div>
        </div>

        {/* Remaining */}
        <div className={`${summary.remaining >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Remaining / Discretionary
            </span>
            {summary.remaining >= 0 ? (
              <TrendingUp className="text-green-600 dark:text-green-400" size={20} />
            ) : (
              <TrendingDown className="text-red-600 dark:text-red-400" size={20} />
            )}
          </div>
          <div className={`text-2xl font-bold ${summary.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(summary.remaining)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatCurrency(summary.remaining / 12)} / month
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Savings Rate
            </span>
            <Percent className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {summary.savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of net income
          </div>
        </div>

        {/* Budget Health */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Budget Health Indicator
            </span>
          </div>
          <div className={`text-3xl font-bold ${budgetHealth.color}`}>
            {budgetHealth.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {summary.remaining < 0 && 'You are spending more than you earn. Consider reducing expenses or increasing income.'}
            {summary.remaining >= 0 && summary.savingsRate >= 20 && 'Great job! You\'re saving a healthy portion of your income.'}
            {summary.remaining >= 0 && summary.savingsRate >= 10 && summary.savingsRate < 20 && 'You\'re on track, but consider increasing your savings rate to 20% or more.'}
            {summary.remaining >= 0 && summary.savingsRate < 10 && 'Try to increase your savings rate to at least 10-20% of net income.'}
          </div>
        </div>
      </div>
    </div>
  );
}
