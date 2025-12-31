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
      backgroundColor: '#0a0a0f',
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
    <header className="cyber-card shadow-md" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold neon-cyan uppercase tracking-wider">COFFERS</h1>
            <p className="text-sm neon-magenta">
              Personal Budget Planning v2.077
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Presets Button */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="cyber-button flex items-center gap-2 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-wider"
              >
                <BookTemplate size={18} />
                Presets
              </button>

              {showPresets && (
                <div className="absolute right-0 mt-2 w-64 cyber-card rounded-lg z-10">
                  <div className="p-2">
                    {BUDGET_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(index)}
                        className="w-full text-left px-3 py-2 rounded-md transition-colors"
                        style={{
                          borderBottom: index < BUDGET_PRESETS.length - 1 ? '1px solid rgba(0, 240, 255, 0.2)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                          e.currentTarget.style.borderLeft = '3px solid var(--cyber-cyan)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.borderLeft = 'none';
                        }}
                      >
                        <div className="font-bold neon-cyan text-sm uppercase tracking-wide">
                          {preset.name}
                        </div>
                        <div className="text-xs opacity-70" style={{ color: 'var(--cyber-cyan)' }}>
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
              <button className="cyber-button flex items-center gap-2 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-wider">
                <Download size={18} />
                Export
              </button>

              <div className="absolute right-0 mt-2 w-40 cyber-card rounded-lg z-10 hidden group-hover:block">
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 rounded-t-md transition-colors neon-cyan text-sm font-bold uppercase"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Export PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2 rounded-b-md transition-colors neon-cyan text-sm font-bold uppercase"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 240, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="p-2 rounded-md transition-colors cyber-button"
              aria-label="Toggle dark mode"
            >
              {state.darkMode ? (
                <Sun className="neon-yellow" size={20} />
              ) : (
                <Moon className="neon-cyan" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
