export type PayFrequency = 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
export type FilingStatus = 'single' | 'married' | 'head-of-household';

export interface IncomeStream {
  id: string;
  name: string;
  amount: number;
  frequency: PayFrequency;
}

export interface IncomeData {
  employmentIncome: number;
  isHourly: boolean;
  hourlyRate?: number;
  hoursPerWeek?: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  otherIncomes: IncomeStream[];
}

export interface LocationData {
  country: string;
  state: string;
  city?: string;
}

export interface Investment {
  id: string;
  type: '401k' | 'IRA' | 'Brokerage' | 'Crypto' | 'Real Estate' | 'Other';
  currentBalance: number;
  monthlyContribution: number;
}

export interface SavingsData {
  savingsRate: number;
  savingsRateType: 'percentage' | 'fixed';
  emergencyFundTarget?: number;
  investmentRate: number;
  investmentRateType: 'percentage' | 'fixed';
  investments: Investment[];
  employer401kMatch?: number;
  employer401kMatchLimit?: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  monthlyAmount: number;
  subcategories?: { name: string; amount: number }[];
  isCustom: boolean;
}

export interface TaxCalculation {
  federalIncome: number;
  stateIncome: number;
  fica: number;
  total: number;
}

export interface BudgetSummary {
  grossIncome: number;
  taxes: TaxCalculation;
  netIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalInvestments: number;
  remaining: number;
  savingsRate: number;
}

export interface ProjectionSettings {
  savingsRate: number;
  investmentRate: number;
  timeHorizon: number;
  expectedReturn: number;
}

export interface ProjectionResult {
  savingsBalance: number;
  investmentBalance: number;
  totalWealth: number;
}

export interface BudgetState {
  income: IncomeData;
  location: LocationData;
  savings: SavingsData;
  expenses: ExpenseCategory[];
  projectionSettings: ProjectionSettings;
  darkMode: boolean;
}

export type BudgetAction =
  | { type: 'SET_INCOME'; payload: Partial<IncomeData> }
  | { type: 'SET_LOCATION'; payload: Partial<LocationData> }
  | { type: 'SET_SAVINGS'; payload: Partial<SavingsData> }
  | { type: 'ADD_EXPENSE'; payload: ExpenseCategory }
  | { type: 'UPDATE_EXPENSE'; payload: { id: string; data: Partial<ExpenseCategory> } }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_PROJECTION_SETTINGS'; payload: Partial<ProjectionSettings> }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_PRESET'; payload: Partial<BudgetState> }
  | { type: 'LOAD_STATE'; payload: BudgetState };
