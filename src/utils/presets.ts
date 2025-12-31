import type { BudgetState } from '../types';

export interface BudgetPreset {
  name: string;
  description: string;
  apply: (currentState: BudgetState, monthlyNetIncome: number) => Partial<BudgetState>;
}

export const BUDGET_PRESETS: BudgetPreset[] = [
  {
    name: '50/30/20 Rule',
    description: '50% needs, 30% wants, 20% savings',
    apply: (state) => ({
      savings: {
        ...state.savings,
        savingsRate: 20,
        savingsRateType: 'percentage',
      },
      projectionSettings: {
        ...state.projectionSettings,
        savingsRate: 20,
      },
    }),
  },
  {
    name: 'Aggressive Saver',
    description: '40% savings, 60% expenses',
    apply: (state) => ({
      savings: {
        ...state.savings,
        savingsRate: 25,
        savingsRateType: 'percentage',
        investmentRate: 15,
        investmentRateType: 'percentage',
      },
      projectionSettings: {
        ...state.projectionSettings,
        savingsRate: 25,
        investmentRate: 15,
      },
    }),
  },
  {
    name: 'Debt Payoff',
    description: 'Minimize savings, maximize debt payments',
    apply: (state) => ({
      savings: {
        ...state.savings,
        savingsRate: 5,
        savingsRateType: 'percentage',
        investmentRate: 5,
        investmentRateType: 'percentage',
      },
      projectionSettings: {
        ...state.projectionSettings,
        savingsRate: 5,
        investmentRate: 5,
      },
    }),
  },
  {
    name: 'Balanced Investor',
    description: '15% savings, 15% investments, 70% living',
    apply: (state) => ({
      savings: {
        ...state.savings,
        savingsRate: 15,
        savingsRateType: 'percentage',
        investmentRate: 15,
        investmentRateType: 'percentage',
      },
      projectionSettings: {
        ...state.projectionSettings,
        savingsRate: 15,
        investmentRate: 15,
      },
    }),
  },
];
