import { useState } from 'react';
import { Moon, Sun, Download, BookTemplate } from 'lucide-react';
import { useBudget } from '../context/BudgetContext';
import { BUDGET_PRESETS } from '../utils/presets';
import { calculateBudgetSummary } from '../utils/budgetCalculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function Header() {
  const { state, dispatch } = useBudget();
  const [showPresets, setShowPresets] = useState(false);
  const summary = calculateBudgetSummary(state);

  const handlePresetSelect = (presetIndex: number) => {
    const preset = BUDGET_PRESETS[presetIndex];
    const monthlyNetIncome = summary.netIncome / 12;
    const updates = preset.apply(state, monthlyNetIncome);
    dispatch({ type: 'LOAD_PRESET', payload: updates });
    setShowPresets(false);
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('budget-app');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: state.darkMode ? '#1F2937' : '#FFFFFF',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('budget-summary.pdf');
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Category', 'Annual Amount', 'Monthly Amount'],
      ['Gross Income', summary.grossIncome.toFixed(2), (summary.grossIncome / 12).toFixed(2)],
      ['Federal Tax', summary.taxes.federalIncome.toFixed(2), (summary.taxes.federalIncome / 12).toFixed(2)],
      ['State Tax', summary.taxes.stateIncome.toFixed(2), (summary.taxes.stateIncome / 12).toFixed(2)],
      ['FICA Tax', summary.taxes.fica.toFixed(2), (summary.taxes.fica / 12).toFixed(2)],
      ['Net Income', summary.netIncome.toFixed(2), (summary.netIncome / 12).toFixed(2)],
      ['Total Expenses', summary.totalExpenses.toFixed(2), (summary.totalExpenses / 12).toFixed(2)],
      ...state.expenses.map((expense) => [
        `  - ${expense.name}`,
        (expense.monthlyAmount * 12).toFixed(2),
        expense.monthlyAmount.toFixed(2),
      ]),
      ['Savings', summary.totalSavings.toFixed(2), (summary.totalSavings / 12).toFixed(2)],
      ['Investments', summary.totalInvestments.toFixed(2), (summary.totalInvestments / 12).toFixed(2)],
      ['Remaining', summary.remaining.toFixed(2), (summary.remaining / 12).toFixed(2)],
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'budget-data.csv';
    link.click();
  };

  return (
    <header className="bg-gradient-to-r from-mcm-navy via-mcm-deep-teal to-mcm-navy dark:from-mcm-charcoal dark:via-mcm-slate dark:to-mcm-charcoal border-b-4 border-mcm-gold relative overflow-hidden">
      <div className="absolute inset-0 pattern-grid opacity-10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mcm-mustard clip-path-diamond flex items-center justify-center">
              <span className="text-mcm-navy font-display font-bold text-xl">$</span>
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-mcm-cream uppercase tracking-tight">
                Coffers
              </h1>
              <p className="text-sm text-mcm-seafoam font-medium tracking-wide">
                PERSONAL BUDGET PLANNING
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Presets Button */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="btn-retro flex items-center gap-2 px-5 py-2 bg-mcm-coral text-white font-display font-semibold uppercase text-xs tracking-wide"
              >
                <BookTemplate size={16} />
                Presets
              </button>

              {showPresets && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-mcm-slate border-2 border-mcm-charcoal dark:border-mcm-cream shadow-retro z-20">
                  <div className="p-2">
                    {BUDGET_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(index)}
                        className="w-full text-left px-3 py-3 hover:bg-mcm-teal hover:text-white dark:hover:bg-mcm-seafoam dark:hover:text-mcm-charcoal transition-colors border-b border-mcm-cream/20 last:border-b-0"
                      >
                        <div className="font-display font-semibold text-mcm-charcoal dark:text-mcm-cream">
                          {preset.name}
                        </div>
                        <div className="text-xs text-mcm-slate dark:text-mcm-cream/70 mt-1">
                          {preset.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="btn-retro flex items-center gap-2 px-5 py-2 bg-mcm-olive text-white font-display font-semibold uppercase text-xs tracking-wide">
                <Download size={16} />
                Export
              </button>

              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-mcm-slate border-2 border-mcm-charcoal dark:border-mcm-cream shadow-retro z-20 hidden group-hover:block">
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-3 hover:bg-mcm-olive hover:text-white dark:hover:bg-mcm-sage dark:hover:text-mcm-charcoal transition-colors font-medium text-mcm-charcoal dark:text-mcm-cream border-b border-mcm-cream/20"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-3 hover:bg-mcm-olive hover:text-white dark:hover:bg-mcm-sage dark:hover:text-mcm-charcoal transition-colors font-medium text-mcm-charcoal dark:text-mcm-cream"
                >
                  Export as CSV
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="btn-retro p-3 bg-mcm-mustard hover:bg-mcm-gold transition-colors"
              aria-label="Toggle dark mode"
            >
              {state.darkMode ? (
                <Sun className="text-mcm-charcoal" size={20} />
              ) : (
                <Moon className="text-mcm-navy" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
