import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import type { ExpenseCategory } from '../types';

export function ExpensesForm() {
  const { state, dispatch } = useBudget();
  const { expenses } = state;
  const [newCategory, setNewCategory] = useState({ name: '', color: '#E3A857' });

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
    setNewCategory({ name: '', color: '#E3A857' });
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
    <div className="form-card">
      <div className="absolute top-0 right-0 w-32 h-32 pattern-grid opacity-10"></div>
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-6 h-6 bg-mcm-coral clip-path-diamond"></div>
        <h2 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
          Monthly Expenses
        </h2>
      </div>

      <div className="space-y-3 relative z-10">
        {expenses.map((category) => (
          <div key={category.id} className="flex items-center gap-3">
            <div
              className="w-5 h-5 flex-shrink-0 border-2 border-mcm-charcoal dark:border-mcm-cream"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={category.name}
                onChange={(e) =>
                  handleUpdateCategory(category.id, { name: e.target.value })
                }
                className={`input-retro text-sm ${!category.isCustom ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={!category.isCustom}
              />
              <div className="flex gap-2">
                <span className="flex items-center text-mcm-charcoal dark:text-mcm-cream font-bold">$</span>
                <input
                  type="number"
                  value={category.monthlyAmount || ''}
                  onChange={(e) =>
                    handleUpdateCategory(category.id, {
                      monthlyAmount: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.00"
                  className="input-retro flex-1 text-sm"
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
                  className="w-10 h-10 border-2 border-mcm-charcoal dark:border-mcm-cream cursor-pointer"
                />
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-mcm-rust hover:text-mcm-coral transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Custom Category */}
        <div className="mt-6 pt-6 border-t-2 border-mcm-charcoal/20 dark:border-mcm-cream/20">
          <h3 className="text-sm font-display font-bold text-mcm-charcoal dark:text-mcm-cream mb-4 uppercase tracking-wide">
            Add Custom Category
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="Category name"
              className="input-retro flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <input
              type="color"
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
              className="w-12 h-12 border-2 border-mcm-charcoal dark:border-mcm-cream cursor-pointer"
            />
            <button
              onClick={handleAddCategory}
              className="btn-retro flex items-center gap-2 px-5 py-3 bg-mcm-coral text-white font-display font-semibold uppercase text-xs tracking-wide"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t-4 border-mcm-charcoal dark:border-mcm-mustard bg-mcm-warm-cream dark:bg-mcm-navy p-5">
          <div className="flex justify-between items-center">
            <span className="text-lg font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-wide">
              Total Monthly Expenses:
            </span>
            <span className="text-2xl font-display font-bold text-mcm-teal dark:text-mcm-seafoam">
              ${expenses.reduce((sum, cat) => sum + cat.monthlyAmount, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
