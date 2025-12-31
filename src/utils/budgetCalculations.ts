import type {
  BudgetState,
  BudgetSummary,
  ProjectionResult,
  ProjectionSettings,
} from '../types';
import { calculateTotalTaxes, convertToAnnual } from './taxCalculations';

export function calculateBudgetSummary(state: BudgetState): BudgetSummary {
  // Calculate gross annual income
  let grossAnnualIncome = state.income.isHourly && state.income.hourlyRate && state.income.hoursPerWeek
    ? state.income.hourlyRate * state.income.hoursPerWeek * 52
    : state.income.employmentIncome;

  // Add other income streams
  state.income.otherIncomes.forEach((stream) => {
    grossAnnualIncome += convertToAnnual(stream.amount, stream.frequency);
  });

  // Calculate taxes
  const taxes = calculateTotalTaxes(
    grossAnnualIncome,
    state.income.filingStatus,
    state.location.state
  );

  const netAnnualIncome = grossAnnualIncome - taxes.total;
  const netMonthlyIncome = netAnnualIncome / 12;

  // Calculate total expenses
  const totalMonthlyExpenses = state.expenses.reduce(
    (sum, category) => sum + category.monthlyAmount,
    0
  );

  // Calculate savings and investments
  let monthlySavings = 0;
  let monthlyInvestments = 0;

  if (state.savings.savingsRateType === 'percentage') {
    monthlySavings = (netMonthlyIncome * state.savings.savingsRate) / 100;
  } else {
    monthlySavings = state.savings.savingsRate;
  }

  if (state.savings.investmentRateType === 'percentage') {
    monthlyInvestments = (netMonthlyIncome * state.savings.investmentRate) / 100;
  } else {
    monthlyInvestments = state.savings.investmentRate;
  }

  // Add existing investment contributions
  state.savings.investments.forEach((investment) => {
    monthlyInvestments += investment.monthlyContribution;
  });

  // Calculate 401k match if applicable
  if (state.savings.employer401kMatch && state.savings.employer401kMatchLimit) {
    const matchAmount = Math.min(
      (netMonthlyIncome * state.savings.employer401kMatch) / 100,
      (netMonthlyIncome * state.savings.employer401kMatchLimit) / 100
    );
    monthlyInvestments += matchAmount;
  }

  const totalMonthlySavings = monthlySavings + monthlyInvestments;
  const remaining = netMonthlyIncome - totalMonthlyExpenses - totalMonthlySavings;

  return {
    grossIncome: grossAnnualIncome,
    taxes,
    netIncome: netAnnualIncome,
    totalExpenses: totalMonthlyExpenses * 12,
    totalSavings: monthlySavings * 12,
    totalInvestments: monthlyInvestments * 12,
    remaining: remaining * 12,
    savingsRate: (totalMonthlySavings / netMonthlyIncome) * 100,
  };
}

export function calculateProjection(
  currentSavings: number,
  currentInvestments: number,
  monthlySavings: number,
  monthlyInvestments: number,
  settings: ProjectionSettings
): ProjectionResult {
  const months = settings.timeHorizon * 12;
  const monthlyReturn = settings.expectedReturn / 100 / 12;

  // Savings grow linearly (no interest assumed for simplicity)
  const savingsBalance = currentSavings + monthlySavings * months;

  // Investments grow with compound interest
  let investmentBalance = currentInvestments;
  for (let i = 0; i < months; i++) {
    investmentBalance = investmentBalance * (1 + monthlyReturn) + monthlyInvestments;
  }

  return {
    savingsBalance,
    investmentBalance,
    totalWealth: savingsBalance + investmentBalance,
  };
}

export function generateProjectionTimeSeries(
  currentSavings: number,
  currentInvestments: number,
  monthlySavings: number,
  monthlyInvestments: number,
  settings: ProjectionSettings
): Array<{ year: number; savings: number; investments: number; total: number }> {
  const data = [];
  const monthlyReturn = settings.expectedReturn / 100 / 12;

  let savings = currentSavings;
  let investments = currentInvestments;

  data.push({
    year: 0,
    savings: currentSavings,
    investments: currentInvestments,
    total: currentSavings + currentInvestments,
  });

  for (let year = 1; year <= settings.timeHorizon; year++) {
    for (let month = 0; month < 12; month++) {
      savings += monthlySavings;
      investments = investments * (1 + monthlyReturn) + monthlyInvestments;
    }

    data.push({
      year,
      savings: Math.round(savings),
      investments: Math.round(investments),
      total: Math.round(savings + investments),
    });
  }

  return data;
}
