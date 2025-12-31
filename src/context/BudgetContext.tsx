import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { BudgetState, BudgetAction } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

const initialState: BudgetState = {
  income: {
    employmentIncome: 75000,
    isHourly: false,
    payFrequency: 'bi-weekly',
    filingStatus: 'single',
    otherIncomes: [],
  },
  location: {
    country: 'United States',
    state: 'TX',
  },
  savings: {
    savingsRate: 20,
    savingsRateType: 'percentage',
    investmentRate: 15,
    investmentRateType: 'percentage',
    investments: [],
  },
  expenses: DEFAULT_CATEGORIES.map((cat, index) => ({
    ...cat,
    id: `category-${index}`,
    monthlyAmount: 0,
  })),
  projectionSettings: {
    savingsRate: 20,
    investmentRate: 15,
    timeHorizon: 10,
    expectedReturn: 7,
  },
  darkMode: false,
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'SET_INCOME':
      return {
        ...state,
        income: { ...state.income, ...action.payload },
      };

    case 'SET_LOCATION':
      return {
        ...state,
        location: { ...state.location, ...action.payload },
      };

    case 'SET_SAVINGS':
      return {
        ...state,
        savings: { ...state.savings, ...action.payload },
      };

    case 'ADD_EXPENSE':
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id
            ? { ...expense, ...action.payload.data }
            : expense
        ),
      };

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };

    case 'SET_PROJECTION_SETTINGS':
      return {
        ...state,
        projectionSettings: { ...state.projectionSettings, ...action.payload },
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    case 'LOAD_PRESET':
      return {
        ...state,
        ...action.payload,
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

interface BudgetContextType {
  state: BudgetState;
  dispatch: React.Dispatch<BudgetAction>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState, (initial) => {
    // Try to load from localStorage
    const saved = localStorage.getItem('budgetState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initial;
      }
    }
    return initial;
  });

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('budgetState', JSON.stringify(state));
  }, [state]);

  // Apply dark mode class to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  return (
    <BudgetContext.Provider value={{ state, dispatch }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
