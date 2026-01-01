import { Plus, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import type { PayFrequency, FilingStatus, IncomeStream } from '../types';

export function IncomeForm() {
  const { state, dispatch } = useBudget();
  const { income } = state;

  const handleAddIncomeStream = () => {
    const newStream: IncomeStream = {
      id: `income-${Date.now()}`,
      name: '',
      amount: 0,
      frequency: 'monthly',
    };

    dispatch({
      type: 'SET_INCOME',
      payload: {
        otherIncomes: [...income.otherIncomes, newStream],
      },
    });
  };

  const handleUpdateIncomeStream = (id: string, updates: Partial<IncomeStream>) => {
    dispatch({
      type: 'SET_INCOME',
      payload: {
        otherIncomes: income.otherIncomes.map((stream) =>
          stream.id === id ? { ...stream, ...updates } : stream
        ),
      },
    });
  };

  const handleRemoveIncomeStream = (id: string) => {
    dispatch({
      type: 'SET_INCOME',
      payload: {
        otherIncomes: income.otherIncomes.filter((stream) => stream.id !== id),
      },
    });
  };

  return (
    <div className="form-card">
      <div className="absolute top-0 right-0 w-32 h-32 pattern-dots opacity-10"></div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-6 h-6 bg-mcm-teal clip-path-diamond"></div>
        <h2 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Income Information
        </h2>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Income Type Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={income.isHourly}
              onChange={(e) =>
                dispatch({
                  type: 'SET_INCOME',
                  payload: { isHourly: e.target.checked },
                })
              }
              className="w-5 h-5 border-2 border-mcm-charcoal dark:border-mcm-cream accent-mcm-teal cursor-pointer"
            />
            <span className="text-sm font-semibold text-mcm-charcoal dark:text-mcm-cream tracking-wide">
              Hourly Employee
            </span>
          </label>
        </div>

        {/* Employment Income */}
        {income.isHourly ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-retro">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={income.hourlyRate || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_INCOME',
                    payload: { hourlyRate: parseFloat(e.target.value) || 0 },
                  })
                }
                className="input-retro w-full"
                step="0.01"
              />
            </div>
            <div>
              <label className="label-retro">
                Hours per Week
              </label>
              <input
                type="number"
                value={income.hoursPerWeek || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_INCOME',
                    payload: { hoursPerWeek: parseFloat(e.target.value) || 0 },
                  })
                }
                className="input-retro w-full"
                step="0.1"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="label-retro">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={income.employmentIncome || ''}
              onChange={(e) =>
                dispatch({
                  type: 'SET_INCOME',
                  payload: { employmentIncome: parseFloat(e.target.value) || 0 },
                })
              }
              className="input-retro w-full"
              step="1000"
            />
          </div>
        )}

        {/* Pay Frequency */}
        <div>
          <label className="label-retro">
            Pay Frequency
          </label>
          <select
            value={income.payFrequency}
            onChange={(e) =>
              dispatch({
                type: 'SET_INCOME',
                payload: { payFrequency: e.target.value as PayFrequency },
              })
            }
            className="select-retro w-full"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="semi-monthly">Semi-monthly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Filing Status */}
        <div>
          <label className="label-retro">
            Tax Filing Status
          </label>
          <select
            value={income.filingStatus}
            onChange={(e) =>
              dispatch({
                type: 'SET_INCOME',
                payload: { filingStatus: e.target.value as FilingStatus },
              })
            }
            className="select-retro w-full"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="head-of-household">Head of Household</option>
          </select>
        </div>

        {/* Other Income Streams */}
        <div className="mt-6 pt-4 border-t-2 border-mcm-charcoal/20 dark:border-mcm-cream/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
              Other Income Streams
            </h3>
            <button
              onClick={handleAddIncomeStream}
              className="btn-retro flex items-center gap-2 px-4 py-2 bg-mcm-teal text-white font-display font-semibold uppercase text-xs tracking-wide"
            >
              <Plus size={16} />
              Add Income
            </button>
          </div>

          {income.otherIncomes.map((stream) => (
            <div key={stream.id} className="grid grid-cols-12 gap-2 mb-3">
              <input
                type="text"
                placeholder="Income name"
                value={stream.name}
                onChange={(e) =>
                  handleUpdateIncomeStream(stream.id, { name: e.target.value })
                }
                className="input-retro col-span-4 text-sm"
              />
              <input
                type="number"
                placeholder="Amount"
                value={stream.amount || ''}
                onChange={(e) =>
                  handleUpdateIncomeStream(stream.id, {
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="input-retro col-span-3 text-sm"
              />
              <select
                value={stream.frequency}
                onChange={(e) =>
                  handleUpdateIncomeStream(stream.id, {
                    frequency: e.target.value as PayFrequency,
                  })
                }
                className="select-retro col-span-4 text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="semi-monthly">Semi-monthly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                onClick={() => handleRemoveIncomeStream(stream.id)}
                className="col-span-1 flex items-center justify-center text-mcm-rust hover:text-mcm-coral transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
