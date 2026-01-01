
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
    <div className="form-card">
      <div className="absolute top-0 right-0 w-32 h-32 sunburst opacity-10"></div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-6 h-6 bg-mcm-sage clip-path-diamond"></div>
        <h2 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Savings & Investments
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Savings Rate */}
        <div>
          <label className="label-retro">
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
              className="input-retro flex-1"
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
              className="select-retro"
            >
              <option value="percentage">% of Net Income</option>
              <option value="fixed">$ Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* Emergency Fund Target */}
        <div>
          <label className="label-retro">
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
            className="input-retro w-full"
            step="1000"
          />
        </div>

        {/* Investment Rate */}
        <div>
          <label className="label-retro">
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
              className="input-retro flex-1"
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
              className="select-retro"
            >
              <option value="percentage">% of Net Income</option>
              <option value="fixed">$ Fixed Amount</option>
            </select>
          </div>
        </div>

        {/* 401k Match */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-retro">
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
              className="input-retro w-full"
              step="0.5"
            />
          </div>
          <div>
            <label className="label-retro">
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
              className="input-retro w-full"
              step="0.5"
            />
          </div>
        </div>

        {/* Current Investments */}
        <div className="mt-6 pt-4 border-t-2 border-mcm-charcoal/20 dark:border-mcm-cream/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
              Current Investments
            </h3>
            <button
              onClick={handleAddInvestment}
              className="btn-retro flex items-center gap-2 px-4 py-2 bg-mcm-sage text-white font-display font-semibold uppercase text-xs tracking-wide"
            >
              <Plus size={16} />
              Add Investment
            </button>
          </div>

          {savings.investments.length === 0 ? (
            <p className="text-sm text-mcm-slate dark:text-mcm-cream/70 italic">
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
                  className="select-retro col-span-3 text-sm"
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
                  className="input-retro col-span-4 text-sm"
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
                  className="input-retro col-span-4 text-sm"
                />
                <button
                  onClick={() => handleRemoveInvestment(investment.id)}
                  className="col-span-1 flex items-center justify-center text-mcm-rust hover:text-mcm-coral transition-colors"
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
