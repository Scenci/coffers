
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { calculateBudgetSummary } from '../utils/budgetCalculations';

// MCM Color Palette
const MCM_COLORS = {
  teal: '#2A7F7F',
  coral: '#FF6B6B',
  mustard: '#E3A857',
  sage: '#9CAF88',
  rust: '#B7410E',
  olive: '#7A8450',
  seafoam: '#95CFC5',
  gold: '#DAA520',
};

export function BudgetCharts() {
  const { state } = useBudget();
  const summary = calculateBudgetSummary(state);

  // Dark mode aware colors
  const textColor = state.darkMode ? '#F5F1E8' : '#2D2D2A'; // cream : charcoal
  const strokeColor = state.darkMode ? '#F5F1E8' : '#2D2D2A'; // cream : charcoal

  // Prepare expense breakdown data
  const expenseData = state.expenses
    .filter((cat) => cat.monthlyAmount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.monthlyAmount,
      color: cat.color,
    }));

  // Prepare income allocation data with MCM colors
  const allocationData = [
    {
      name: 'Taxes',
      value: summary.taxes.total / 12,
      color: MCM_COLORS.rust,
    },
    {
      name: 'Expenses',
      value: summary.totalExpenses / 12,
      color: MCM_COLORS.coral,
    },
    {
      name: 'Savings',
      value: summary.totalSavings / 12,
      color: MCM_COLORS.sage,
    },
    {
      name: 'Investments',
      value: summary.totalInvestments / 12,
      color: MCM_COLORS.teal,
    },
    {
      name: 'Remaining',
      value: Math.max(0, summary.remaining / 12),
      color: MCM_COLORS.seafoam,
    },
  ].filter((item) => item.value > 0);

  // Prepare monthly budget bar data
  const monthlyBudgetData = [
    {
      category: 'Income',
      amount: summary.netIncome / 12,
      fill: MCM_COLORS.teal,
    },
    {
      category: 'Expenses',
      amount: summary.totalExpenses / 12,
      fill: MCM_COLORS.coral,
    },
    {
      category: 'Savings',
      amount: (summary.totalSavings + summary.totalInvestments) / 12,
      fill: MCM_COLORS.sage,
    },
    {
      category: 'Remaining',
      amount: Math.max(0, summary.remaining / 12),
      fill: MCM_COLORS.mustard,
    },
  ];

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-mcm-charcoal border-2 border-mcm-mustard p-3">
          <p className="font-display font-semibold text-mcm-cream text-sm uppercase">{payload[0].name}</p>
          <p className="font-bold text-mcm-seafoam text-lg">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom label for Pie charts with dark mode support
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={textColor}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-display font-semibold text-sm"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Expense Breakdown */}
      {expenseData.length > 0 && (
        <div className="form-card pattern-dots">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-mcm-coral clip-path-diamond"></div>
            <h3 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
              Monthly Expense Breakdown
            </h3>
          </div>
          <div className="bg-mcm-warm-cream dark:bg-mcm-navy border-2 border-mcm-charcoal dark:border-mcm-cream p-6">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  stroke={strokeColor}
                  strokeWidth={2}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Income Allocation */}
      <div className="form-card pattern-chevron">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-mcm-teal clip-path-hexagon"></div>
          <h3 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Monthly Income Allocation
          </h3>
        </div>
        <div className="bg-mcm-warm-cream dark:bg-mcm-navy border-2 border-mcm-charcoal dark:border-mcm-cream p-6">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                stroke={strokeColor}
                strokeWidth={2}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Budget Overview */}
      <div className="form-card pattern-grid">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-mcm-mustard clip-path-diamond"></div>
          <h3 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Monthly Budget Overview
          </h3>
        </div>
        <div className="bg-mcm-warm-cream dark:bg-mcm-navy border-2 border-mcm-charcoal dark:border-mcm-cream p-6">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyBudgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A7F7F" opacity={0.2} />
              <XAxis
                dataKey="category"
                tick={{ fill: textColor, fontFamily: 'Space Grotesk', fontWeight: 600 }}
                stroke={strokeColor}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: textColor, fontFamily: 'Space Grotesk', fontWeight: 600 }}
                stroke={strokeColor}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="amount"
                fill="#2A7F7F"
                stroke={strokeColor}
                strokeWidth={2}
              >
                {monthlyBudgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
