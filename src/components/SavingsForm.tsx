
import { Plus, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import type { Investment } from '../types';

export function SavingsForm() {
  const { state, dispatch } = useBudget();
  const { savings } = state;

  const handleAddInvestment = () => {
    const newInvestment: Investment = {
      id: `investment-${Date.now()}`,
      type: 'Brokerage',
      currentBalance: 0,
      monthlyContribution: 0,
    };

    dispatch({
      type: 'SET_SAVINGS',
      payload: {
        investments: [...savings.investments, newInvestment],
      },
    });
  };

  const handleUpdateInvestment = (id: string, updates: Partial<Investment>) => {
    dispatch({
      type: 'SET_SAVINGS',
      payload: {
        investments: savings.investments.map((inv) =>
          inv.id === id ? { ...inv, ...updates } : inv
        ),
      },
    });
  };

  const handleRemoveInvestment = (id: string) => {
    dispatch({
      type: 'SET_SAVINGS',
      payload: {
        investments: savings.investments.filter((inv) => inv.id !== id),
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Savings & Investments
      </h2>

      <div className="space-y-4">
        {/* Savings Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Savings Target
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={savings.savingsRate || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { savingsRate: parseFloat(e.target.value) || 0 },
                })
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              step="0.1"
            />
            <select
              value={savings.savingsRateType}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { savingsRateType: e.target.value as 'percentage' | 'fixed' },
                })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="percentage">% of Net Income</option>
              <option value="fixed">$ Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* Emergency Fund Target */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emergency Fund Target ($) - Optional
          </label>
          <input
            type="number"
            value={savings.emergencyFundTarget || ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_SAVINGS',
                payload: { emergencyFundTarget: parseFloat(e.target.value) || undefined },
              })
            }
            placeholder="e.g., 10000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            step="1000"
          />
        </div>

        {/* Investment Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Investment Target
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={savings.investmentRate || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { investmentRate: parseFloat(e.target.value) || 0 },
                })
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              step="0.1"
            />
            <select
              value={savings.investmentRateType}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { investmentRateType: e.target.value as 'percentage' | 'fixed' },
                })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="percentage">% of Net Income</option>
              <option value="fixed">$ Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* 401k Match */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Employer 401k Match (%) - Optional
            </label>
            <input
              type="number"
              value={savings.employer401kMatch || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { employer401kMatch: parseFloat(e.target.value) || undefined },
                })
              }
              placeholder="e.g., 5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Match Up To (%) - Optional
            </label>
            <input
              type="number"
              value={savings.employer401kMatchLimit || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_SAVINGS',
                  payload: { employer401kMatchLimit: parseFloat(e.target.value) || undefined },
                })
              }
              placeholder="e.g., 6"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              step="0.5"
            />
          </div>
        </div>

        {/* Current Investments */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Current Investments
            </h3>
            <button
              onClick={handleAddInvestment}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              <Plus size={16} />
              Add Investment
            </button>
          </div>

          {savings.investments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No investments added yet. Click "Add Investment" to get started.
            </p>
          ) : (
            savings.investments.map((investment) => (
              <div
                key={investment.id}
                className="grid grid-cols-12 gap-2 mb-3 items-center"
              >
                <select
                  value={investment.type}
                  onChange={(e) =>
                    handleUpdateInvestment(investment.id, {
                      type: e.target.value as Investment['type'],
                    })
                  }
                  className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="401k">401k</option>
                  <option value="IRA">IRA</option>
                  <option value="Brokerage">Brokerage</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  placeholder="Current Balance"
                  value={investment.currentBalance || ''}
                  onChange={(e) =>
                    handleUpdateInvestment(investment.id, {
                      currentBalance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                />
                <input
                  type="number"
                  placeholder="Monthly Contribution"
                  value={investment.monthlyContribution || ''}
                  onChange={(e) =>
                    handleUpdateInvestment(investment.id, {
                      monthlyContribution: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                />
                <button
                  onClick={() => handleRemoveInvestment(investment.id)}
                  className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
