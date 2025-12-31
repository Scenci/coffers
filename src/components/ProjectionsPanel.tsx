
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Financial Projections
      </h2>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Time Horizon Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1 year</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Expected Return Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>1%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Savings Rate Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Investment Rate Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Projection Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Projected Savings
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatCurrencyFull(finalProjection.savings)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Projected Investments
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrencyFull(finalProjection.investments)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            Total Wealth
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrencyFull(finalProjection.total)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            in {projectionSettings.timeHorizon} years
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Wealth Growth Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" className="dark:opacity-20" />
            <XAxis
              dataKey="year"
              label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
              className="dark:text-gray-400"
            />
            <YAxis
              tickFormatter={formatCurrency}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              className="dark:text-gray-400"
            />
            <Tooltip
              formatter={(value) => formatCurrencyFull(Number(value))}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="savings"
              name="Savings"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="investments"
              name="Investments"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Wealth"
              stroke="#10B981"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Note: Projections are based on the assumption of consistent contributions and returns.
        Actual results may vary based on market conditions and life changes.
      </p>
    </div>
  );
}
