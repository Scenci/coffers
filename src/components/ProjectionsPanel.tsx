
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
    <div className="cyber-card rounded-lg p-6 relative overflow-hidden">
      <div className="scanline-effect"></div>
      <h2 className="text-3xl font-bold mb-6 neon-cyan">
        FINANCIAL PROJECTIONS
      </h2>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Time Horizon Slider */}
        <div className="relative">
          <label className="block text-sm font-bold mb-3 neon-cyan uppercase tracking-wider">
            Time Horizon: <span className="neon-yellow">{projectionSettings.timeHorizon}</span> years
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
          />
          <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--cyber-cyan)' }}>
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Expected Return Slider */}
        <div className="relative">
          <label className="block text-sm font-bold mb-3 neon-green uppercase tracking-wider">
            Expected Annual Return: <span className="neon-yellow">{projectionSettings.expectedReturn}</span>%
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
          />
          <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--cyber-green)' }}>
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Savings Rate Slider */}
        <div className="relative">
          <label className="block text-sm font-bold mb-3 neon-purple uppercase tracking-wider">
            Savings Rate: <span className="neon-yellow">{projectionSettings.savingsRate}</span>%
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
          />
          <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--cyber-purple)' }}>
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Investment Rate Slider */}
        <div className="relative">
          <label className="block text-sm font-bold mb-3 neon-magenta uppercase tracking-wider">
            Investment Rate: <span className="neon-yellow">{projectionSettings.investmentRate}</span>%
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
          />
          <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--cyber-magenta)' }}>
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Projection Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div
          className="rounded-lg p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(157, 0, 255, 0.5)',
            boxShadow: '0 0 20px rgba(157, 0, 255, 0.3)'
          }}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-2 neon-purple">
            Projected Savings
          </div>
          <div className="text-2xl font-bold neon-purple">
            {formatCurrencyFull(finalProjection.savings)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--cyber-cyan)' }}>
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div
          className="rounded-lg p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(255, 0, 255, 0.5)',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
          }}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-2 neon-magenta">
            Projected Investments
          </div>
          <div className="text-2xl font-bold neon-magenta">
            {formatCurrencyFull(finalProjection.investments)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--cyber-cyan)' }}>
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div
          className="rounded-lg p-4 relative overflow-hidden pulse-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.15) 0%, rgba(26, 26, 40, 0.9) 100%)',
            border: '2px solid rgba(0, 255, 136, 0.5)',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)'
          }}
        >
          <div className="text-xs font-bold uppercase tracking-wider mb-2 neon-green">
            Total Wealth
          </div>
          <div className="text-3xl font-bold neon-green">
            {formatCurrencyFull(finalProjection.total)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--cyber-cyan)' }}>
            in {projectionSettings.timeHorizon} years
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-3 neon-cyan uppercase tracking-wider">
          WEALTH GROWTH OVER TIME
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.2)" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years', position: 'insideBottom', offset: -5, fill: '#00f0ff' }}
              stroke="#00f0ff"
              tick={{ fill: '#00f0ff' }}
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', fill: '#00f0ff' }}
              stroke="#00f0ff"
              tick={{ fill: '#00f0ff' }}
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(Number(value))}
              contentStyle={{
                background: 'linear-gradient(135deg, rgba(26, 26, 40, 0.95) 0%, rgba(18, 18, 26, 0.95) 100%)',
                border: '2px solid rgba(0, 240, 255, 0.5)',
                borderRadius: '8px',
                color: '#00f0ff',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
              }}
              labelStyle={{ color: '#ff00ff' }}
            />
            <Legend
              wrapperStyle={{ color: '#00f0ff' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="savings"
              name="Savings"
              stroke="#9d00ff"
              strokeWidth={3}
              dot={false}
              filter="drop-shadow(0 0 8px #9d00ff)"
            />
            <Line
              type="monotone"
              dataKey="investments"
              name="Investments"
              stroke="#ff00ff"
              strokeWidth={3}
              dot={false}
              filter="drop-shadow(0 0 8px #ff00ff)"
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Wealth"
              stroke="#00ff88"
              strokeWidth={4}
              dot={false}
              filter="drop-shadow(0 0 10px #00ff88)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs mt-3 opacity-70" style={{ color: 'var(--cyber-cyan)' }}>
        Note: Projections are based on the assumption of consistent contributions and returns.
        Actual results may vary based on market conditions and life changes.
      </p>
    </div>
  );
}
