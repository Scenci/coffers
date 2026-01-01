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
      <div id="budget-app" className="min-h-screen bg-mcm-cream dark:bg-mcm-charcoal pattern-diagonal">
        <Header />

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 mt-8">
          <div className="flex gap-3 relative">
            <button
              onClick={() => setActiveTab('input')}
              className={`tab-retro px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all ${
                activeTab === 'input'
                  ? 'active bg-mcm-teal text-white dark:bg-mcm-seafoam dark:text-mcm-charcoal'
                  : 'bg-white dark:bg-mcm-slate text-mcm-slate dark:text-mcm-cream hover:bg-mcm-teal/10 dark:hover:bg-mcm-seafoam/20'
              }`}
            >
              Input Data
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              className={`tab-retro px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all ${
                activeTab === 'visualize'
                  ? 'active bg-mcm-mustard text-white dark:bg-mcm-mustard dark:text-mcm-charcoal'
                  : 'bg-white dark:bg-mcm-slate text-mcm-slate dark:text-mcm-cream hover:bg-mcm-mustard/10 dark:hover:bg-mcm-mustard/20'
              }`}
            >
              Visualizations
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`tab-retro px-8 py-4 font-display font-semibold uppercase tracking-wide text-sm transition-all ${
                activeTab === 'projections'
                  ? 'active bg-mcm-olive text-white dark:bg-mcm-sage dark:text-mcm-charcoal'
                  : 'bg-white dark:bg-mcm-slate text-mcm-slate dark:text-mcm-cream hover:bg-mcm-olive/10 dark:hover:bg-mcm-sage/20'
              }`}
            >
              Projections
            </button>
          </div>
          <div className="divider-geometric mt-4"></div>
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
              <IncomeSankey />
              <BudgetCharts />
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
        <footer className="bg-mcm-navy dark:bg-mcm-charcoal mt-12 py-8 border-t-4 border-mcm-mustard relative overflow-hidden">
          <div className="absolute inset-0 pattern-dots opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <p className="font-display font-bold text-mcm-cream text-lg tracking-wide uppercase">Coffers</p>
            <p className="mt-2 text-mcm-seafoam text-sm">Personal Budget Planning Tool</p>
            <p className="mt-1 text-mcm-cream/70 text-xs">Data is saved locally in your browser</p>
          </div>
        </footer>
      </div>
    </BudgetProvider>
  );
}

export default App;
