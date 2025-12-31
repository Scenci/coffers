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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Income Information
      </h2>

      <div className="space-y-4">
        {/* Income Type Toggle */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={income.isHourly}
              onChange={(e) =>
                dispatch({
                  type: 'SET_INCOME',
                  payload: { isHourly: e.target.checked },
                })
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hourly Employee
            </span>
          </label>
        </div>

        {/* Employment Income */}
        {income.isHourly ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                step="0.1"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              step="1000"
            />
          </div>
        )}

        {/* Pay Frequency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="semi-monthly">Semi-monthly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Filing Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          >
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="head-of-household">Head of Household</option>
          </select>
        </div>

        {/* Other Income Streams */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Other Income Streams
            </h3>
            <button
              onClick={handleAddIncomeStream}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
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
                className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
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
                className="col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
              />
              <select
                value={stream.frequency}
                onChange={(e) =>
                  handleUpdateIncomeStream(stream.id, {
                    frequency: e.target.value as PayFrequency,
                  })
                }
                className="col-span-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="semi-monthly">Semi-monthly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                onClick={() => handleRemoveIncomeStream(stream.id)}
                className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700"
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
