import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import type { ExpenseCategory } from '../types';

export function ExpensesForm() {
  const { state, dispatch } = useBudget();
  const { expenses } = state;
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;

    const category: ExpenseCategory = {
      id: `category-${Date.now()}`,
      name: newCategory.name,
      color: newCategory.color,
      monthlyAmount: 0,
      isCustom: true,
    };

    dispatch({ type: 'ADD_EXPENSE', payload: category });
    setNewCategory({ name: '', color: '#3B82F6' });
  };

  const handleUpdateCategory = (id: string, updates: Partial<ExpenseCategory>) => {
    dispatch({
      type: 'UPDATE_EXPENSE',
      payload: { id, data: updates },
    });
  };

  const handleDeleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Monthly Expenses
      </h2>

      <div className="space-y-3">
        {expenses.map((category) => (
          <div key={category.id} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={category.name}
                onChange={(e) =>
                  handleUpdateCategory(category.id, { name: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                disabled={!category.isCustom}
              />
              <div className="flex gap-2">
                <span className="flex items-center text-gray-600 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={category.monthlyAmount || ''}
                  onChange={(e) =>
                    handleUpdateCategory(category.id, {
                      monthlyAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  step="0.01"
                />
              </div>
            </div>
            {category.isCustom && (
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={category.color}
                  onChange={(e) =>
                    handleUpdateCategory(category.id, { color: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Custom Category */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Add Custom Category
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              className="w-10 h-10 rounded cursor-pointer"
            />
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-800 dark:text-gray-100">Total Monthly Expenses:</span>
            <span className="text-blue-600 dark:text-blue-400">
              ${expenses.reduce((sum, cat) => sum + cat.monthlyAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
