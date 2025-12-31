
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
      color: '#ff0055',
    },
    {
      name: 'Expenses',
      value: summary.totalExpenses / 12,
      color: '#ffff00',
    },
    {
      name: 'Savings',
      value: summary.totalSavings / 12,
      color: '#00ff88',
    },
    {
      name: 'Investments',
      value: summary.totalInvestments / 12,
      color: '#9d00ff',
    },
    {
      name: 'Remaining',
      value: Math.max(0, summary.remaining / 12),
      color: '#00f0ff',
    },
  ].filter((item) => item.value > 0);

  // Prepare monthly budget bar data
  const monthlyBudgetData = [
    {
      category: 'Income',
      amount: summary.netIncome / 12,
      fill: '#00ff88',
    },
    {
      category: 'Expenses',
      amount: summary.totalExpenses / 12,
      fill: '#ffff00',
    },
    {
      category: 'Savings',
      amount: (summary.totalSavings + summary.totalInvestments) / 12,
      fill: '#9d00ff',
    },
    {
      category: 'Remaining',
      amount: Math.max(0, summary.remaining / 12),
      fill: '#00f0ff',
    },
  ];

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const customTooltipStyle = {
    background: 'linear-gradient(135deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.95) 100%)',
    border: '2px solid rgba(0, 240, 255, 0.5)',
    borderRadius: '8px',
    color: '#00f0ff',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
    padding: '8px',
  };

  return (
    <div className="space-y-4">
      {/* Compact grid layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expense Breakdown */}
        {expenseData.length > 0 && (
          <div className="cyber-card rounded-lg p-4 relative overflow-hidden">
            <div className="scanline-effect"></div>
            <h3 className="text-lg font-bold mb-3 neon-magenta uppercase tracking-wider">
              Monthly Expenses
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={customTooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Income Allocation */}
        <div className="cyber-card rounded-lg p-4 relative overflow-hidden">
          <div className="scanline-effect"></div>
          <h3 className="text-lg font-bold mb-3 neon-cyan uppercase tracking-wider">
            Income Allocation
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={customTooltipStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Budget Overview - Full Width */}
      <div className="cyber-card rounded-lg p-4 relative overflow-hidden">
        <div className="scanline-effect"></div>
        <h3 className="text-lg font-bold mb-3 neon-green uppercase tracking-wider">
          Monthly Budget Overview
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyBudgetData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.2)" />
            <XAxis
              dataKey="category"
              stroke="#00f0ff"
              tick={{ fill: '#00f0ff' }}
            />
            <YAxis
              stroke="#00f0ff"
              tick={{ fill: '#00f0ff' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={customTooltipStyle}
            />
            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
              {monthlyBudgetData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
