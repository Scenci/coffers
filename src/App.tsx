import { useState } from 'react';
import { BudgetProvider } from './context/BudgetContext';
import { Header } from './components/Header';
import { IncomeForm } from './components/IncomeForm';
import { LocationForm } from './components/LocationForm';
import { SavingsForm } from './components/SavingsForm';
import { ExpensesForm } from './components/ExpensesForm';
import { SummaryDashboard } from './components/SummaryDashboard';
import { IncomeSankey } from './components/IncomeSankey';
import { BudgetCharts } from './components/BudgetCharts';
import { ProjectionsPanel } from './components/ProjectionsPanel';

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'visualize' | 'projections'>('input');

  return (
    <BudgetProvider>
      <div id="budget-app" className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 mt-6">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'input'
                  ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 cyberpunk-tab-active'
                  : 'text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              Input Data
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'visualize'
                  ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 cyberpunk-tab-active'
                  : 'text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              Visualizations
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'projections'
                  ? 'border-b-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 cyberpunk-tab-active'
                  : 'text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400'
              }`}
            >
              Projections
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {activeTab === 'input' && (
            <div className="space-y-6">
              <SummaryDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <IncomeForm />
                <LocationForm />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SavingsForm />
                <ExpensesForm />
              </div>
            </div>
          )}

          {activeTab === 'visualize' && (
            <div className="space-y-6">
              <SummaryDashboard />
              {/* Grid layout: Sankey on left, Charts on right */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="xl:row-span-2">
                  <IncomeSankey />
                </div>
                <div>
                  <BudgetCharts />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projections' && (
            <div className="space-y-6">
              <SummaryDashboard />
              <ProjectionsPanel />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>Coffers - Personal Budget Planning Tool</p>
            <p className="mt-1">Data is saved locally in your browser</p>
          </div>
        </footer>
      </div>
    </BudgetProvider>
  );
}

export default App;
