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
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl cyberpunk-logo">₵ØFFER$</h1>
            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium tracking-wide">
              FINANCIAL INTELLIGENCE SYSTEM
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Presets Button */}
            <div className="relative">
              <button
                onClick={() => setShowPresets(!showPresets)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md cyberpunk-button"
              >
                <BookTemplate size={18} />
                Presets
              </button>

              {showPresets && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-600">
                  <div className="p-2">
                    {BUDGET_PRESETS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(index)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                      >
                        <div className="font-medium text-gray-800 dark:text-gray-100">
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
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
              <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md cyberpunk-button">
                <Download size={18} />
                Export
              </button>

              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-600 hidden group-hover:block">
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-md transition-colors text-gray-800 dark:text-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-md transition-colors text-gray-800 dark:text-gray-100"
                >
                  Export as CSV
                </button>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {state.darkMode ? (
                <Sun className="text-yellow-500" size={20} />
              ) : (
                <Moon className="text-gray-700" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
