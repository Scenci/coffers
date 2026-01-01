
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBudget } from '../context/BudgetContext';
import { calculateBudgetSummary, generateProjectionTimeSeries } from '../utils/budgetCalculations';

export function ProjectionsPanel() {
  const { state, dispatch } = useBudget();
  const { projectionSettings } = state;
  const summary = calculateBudgetSummary(state);

  const currentSavings = state.savings.investments.reduce(
    (sum, inv) => sum + inv.currentBalance,
    0
  );

  const monthlySavings = summary.totalSavings / 12;
  const monthlyInvestments = summary.totalInvestments / 12;

  const projectionData = generateProjectionTimeSeries(
    currentSavings,
    currentSavings,
    monthlySavings,
    monthlyInvestments,
    projectionSettings
  );

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const formatCurrencyFull = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const finalProjection = projectionData[projectionData.length - 1];

  return (
    <div className="form-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-mcm-sage clip-path-diamond"></div>
        <h2 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Financial Projections
        </h2>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Time Horizon Slider */}
        <div>
          <label className="label-retro">
            Time Horizon: {projectionSettings.timeHorizon} years
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={projectionSettings.timeHorizon}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECTION_SETTINGS',
                payload: { timeHorizon: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-mcm-cream dark:bg-mcm-slate rounded-lg appearance-none cursor-pointer accent-mcm-teal"
          />
          <div className="flex justify-between text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Expected Return Slider */}
        <div>
          <label className="label-retro">
            Expected Annual Return: {projectionSettings.expectedReturn}%
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={projectionSettings.expectedReturn}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECTION_SETTINGS',
                payload: { expectedReturn: parseFloat(e.target.value) },
              })
            }
            className="w-full h-2 bg-mcm-cream dark:bg-mcm-slate rounded-lg appearance-none cursor-pointer accent-mcm-sage"
          />
          <div className="flex justify-between text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Savings Rate Slider */}
        <div>
          <label className="label-retro">
            Savings Rate: {projectionSettings.savingsRate}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={projectionSettings.savingsRate}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECTION_SETTINGS',
                payload: { savingsRate: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-mcm-cream dark:bg-mcm-slate rounded-lg appearance-none cursor-pointer accent-mcm-coral"
          />
          <div className="flex justify-between text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Investment Rate Slider */}
        <div>
          <label className="label-retro">
            Investment Rate: {projectionSettings.investmentRate}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={projectionSettings.investmentRate}
            onChange={(e) =>
              dispatch({
                type: 'SET_PROJECTION_SETTINGS',
                payload: { investmentRate: parseInt(e.target.value) },
              })
            }
            className="w-full h-2 bg-mcm-cream dark:bg-mcm-slate rounded-lg appearance-none cursor-pointer accent-mcm-mustard"
          />
          <div className="flex justify-between text-xs text-mcm-slate dark:text-mcm-cream/70 mt-2">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Projection Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-mcm-coral to-mcm-burnt-orange border-2 border-mcm-charcoal dark:border-mcm-cream p-5">
          <div className="text-xs font-display font-semibold text-white uppercase tracking-wider mb-2">
            Projected Savings
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatCurrencyFull(finalProjection.savings)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div className="bg-gradient-to-br from-mcm-teal to-mcm-deep-teal border-2 border-mcm-charcoal dark:border-mcm-cream p-5">
          <div className="text-xs font-display font-semibold text-white uppercase tracking-wider mb-2">
            Projected Investments
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatCurrencyFull(finalProjection.investments)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div className="bg-gradient-to-br from-mcm-sage to-mcm-olive border-2 border-mcm-charcoal dark:border-mcm-cream p-5">
          <div className="text-xs font-display font-semibold text-white uppercase tracking-wider mb-2">
            Total Wealth
          </div>
          <div className="text-2xl font-display font-bold text-white">
            {formatCurrencyFull(finalProjection.total)}
          </div>
          <div className="text-xs text-white/80 mt-2 font-medium">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-mcm-teal clip-path-diamond"></div>
          <h3 className="text-lg font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Wealth Growth Over Time
          </h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              className="text-mcm-charcoal dark:text-mcm-cream"
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              className="text-mcm-charcoal dark:text-mcm-cream"
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(Number(value))}
              contentStyle={{
                backgroundColor: 'rgba(45, 45, 42, 0.95)',
                border: '2px solid #E3A857',
                borderRadius: '2px',
                color: '#F5F1E8',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="savings"
              name="Savings"
              stroke="#FF6B6B"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="investments"
              name="Investments"
              stroke="#2A7F7F"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Wealth"
              stroke="#9CAF88"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-mcm-slate dark:text-mcm-cream/70 mt-4 italic">
        Note: Projections are based on the assumption of consistent contributions and returns.
        Actual results may vary based on market conditions and life changes.
      </p>
    </div>
  );
}
