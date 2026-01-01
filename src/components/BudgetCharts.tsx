
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { calculateBudgetSummary } from '../utils/budgetCalculations';

export function BudgetCharts() {
  const { state } = useBudget();
  const summary = calculateBudgetSummary(state);

  // Prepare expense breakdown data
  const expenseData = state.expenses
    .filter((cat) => cat.monthlyAmount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.monthlyAmount,
      color: cat.color,
    }));

  // Prepare income allocation data
  const allocationData = [
    {
      name: 'Taxes',
      value: summary.taxes.total / 12,
      color: '#EF4444',
    },
    {
      name: 'Expenses',
      value: summary.totalExpenses / 12,
      color: '#F97316',
    },
    {
      name: 'Savings',
      value: summary.totalSavings / 12,
      color: '#10B981',
    },
    {
      name: 'Investments',
      value: summary.totalInvestments / 12,
      color: '#8B5CF6',
    },
    {
      name: 'Remaining',
      value: Math.max(0, summary.remaining / 12),
      color: '#06B6D4',
    },
  ].filter((item) => item.value > 0);

  // Prepare monthly budget bar data
  const monthlyBudgetData = [
    {
      category: 'Income',
      amount: summary.netIncome / 12,
    },
    {
      category: 'Expenses',
      amount: summary.totalExpenses / 12,
    },
    {
      category: 'Savings',
      amount: (summary.totalSavings + summary.totalInvestments) / 12,
    },
    {
      category: 'Remaining',
      amount: Math.max(0, summary.remaining / 12),
    },
  ];

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Expense Breakdown */}
      {expenseData.length > 0 && (
        <div className="form-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-mcm-coral clip-path-diamond"></div>
            <h3 className="text-xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
              Monthly Expense Breakdown
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Income Allocation */}
      <div className="form-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-mcm-teal clip-path-hexagon"></div>
          <h3 className="text-xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Monthly Income Allocation
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Budget Overview */}
      <div className="form-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 bg-mcm-mustard clip-path-diamond"></div>
          <h3 className="text-xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Monthly Budget Overview
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyBudgetData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
            <XAxis dataKey="category" className="dark:text-gray-400" />
            <YAxis className="dark:text-gray-400" tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="amount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
