import type { FilingStatus, PayFrequency, TaxCalculation } from '../types';

// 2025 Federal Tax Brackets (approximation)
const FEDERAL_TAX_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: Infinity, rate: 0.37 },
  ],
  'head-of-household': [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 },
  ],
};

// FICA Tax Rates
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const SOCIAL_SECURITY_WAGE_BASE = 168600; // 2025 limit

// Simplified state tax rates (flat rate approximation)
const STATE_TAX_RATES: Record<string, number> = {
  TX: 0, // Texas has no state income tax
  FL: 0,
  WA: 0,
  NV: 0,
  SD: 0,
  WY: 0,
  TN: 0,
  AK: 0,
  NH: 0,
  CA: 0.093, // Approximate average
  NY: 0.065,
  // Add more states as needed - these are simplified
};

export function calculateFederalTax(
  annualIncome: number,
  filingStatus: FilingStatus
): number {
  const brackets = FEDERAL_TAX_BRACKETS[filingStatus];
  let tax = 0;

  for (const bracket of brackets) {
    if (annualIncome > bracket.min) {
      const taxableInBracket = Math.min(annualIncome, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
    }
    if (annualIncome <= bracket.max) break;
  }

  return tax;
}

export function calculateFICA(annualIncome: number): number {
  const socialSecurity = Math.min(annualIncome, SOCIAL_SECURITY_WAGE_BASE) * SOCIAL_SECURITY_RATE;
  const medicare = annualIncome * MEDICARE_RATE;

  // Additional Medicare tax for high earners (0.9% on income over $200k single, $250k married)
  const additionalMedicare = annualIncome > 200000 ? (annualIncome - 200000) * 0.009 : 0;

  return socialSecurity + medicare + additionalMedicare;
}

export function calculateStateTax(annualIncome: number, state: string): number {
  const rate = STATE_TAX_RATES[state] || 0.05; // Default 5% if state not found
  return annualIncome * rate;
}

export function calculateTotalTaxes(
  annualIncome: number,
  filingStatus: FilingStatus,
  state: string
): TaxCalculation {
  const federalIncome = calculateFederalTax(annualIncome, filingStatus);
  const stateIncome = calculateStateTax(annualIncome, state);
  const fica = calculateFICA(annualIncome);

  return {
    federalIncome,
    stateIncome,
    fica,
    total: federalIncome + stateIncome + fica,
  };
}

export function convertToAnnual(amount: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return amount * 52;
    case 'bi-weekly':
      return amount * 26;
    case 'semi-monthly':
      return amount * 24;
    case 'monthly':
      return amount * 12;
  }
}

export function convertToMonthly(amount: number, frequency: PayFrequency): number {
  return convertToAnnual(amount, frequency) / 12;
}

export function convertFromAnnual(annualAmount: number, frequency: PayFrequency): number {
  switch (frequency) {
    case 'weekly':
      return annualAmount / 52;
    case 'bi-weekly':
      return annualAmount / 26;
    case 'semi-monthly':
      return annualAmount / 24;
    case 'monthly':
      return annualAmount / 12;
  }
}
