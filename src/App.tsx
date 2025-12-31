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
      <div id="budget-app" className="min-h-screen" style={{ background: 'var(--cyber-bg-primary)' }}>
        <Header />

        {/* Tab Navigation */}
        <div className="container mx-auto px-4 mt-6">
          <div className="flex gap-2" style={{ borderBottom: '2px solid rgba(0, 240, 255, 0.3)' }}>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'input'
                  ? 'neon-cyan'
                  : ''
              }`}
              style={{
                borderBottom: activeTab === 'input' ? '3px solid var(--cyber-cyan)' : 'none',
                background: activeTab === 'input' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                color: activeTab === 'input' ? 'var(--cyber-cyan)' : 'rgba(0, 240, 255, 0.5)',
                textShadow: activeTab === 'input' ? '0 0 10px var(--cyber-cyan)' : 'none'
              }}
            >
              Input Data
            </button>
            <button
              onClick={() => setActiveTab('visualize')}
              className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'visualize'
                  ? 'neon-magenta'
                  : ''
              }`}
              style={{
                borderBottom: activeTab === 'visualize' ? '3px solid var(--cyber-magenta)' : 'none',
                background: activeTab === 'visualize' ? 'rgba(255, 0, 255, 0.1)' : 'transparent',
                color: activeTab === 'visualize' ? 'var(--cyber-magenta)' : 'rgba(255, 0, 255, 0.5)',
                textShadow: activeTab === 'visualize' ? '0 0 10px var(--cyber-magenta)' : 'none'
              }}
            >
              Visualizations
            </button>
            <button
              onClick={() => setActiveTab('projections')}
              className={`px-6 py-3 font-bold uppercase tracking-wider text-sm transition-all ${
                activeTab === 'projections'
                  ? 'neon-green'
                  : ''
              }`}
              style={{
                borderBottom: activeTab === 'projections' ? '3px solid var(--cyber-green)' : 'none',
                background: activeTab === 'projections' ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                color: activeTab === 'projections' ? 'var(--cyber-green)' : 'rgba(0, 255, 136, 0.5)',
                textShadow: activeTab === 'projections' ? '0 0 10px var(--cyber-green)' : 'none'
              }}
            >
              Projections
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          {activeTab === 'input' && (
            <div className="space-y-4">
              <SummaryDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <IncomeForm />
                <LocationForm />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SavingsForm />
                <ExpensesForm />
              </div>
            </div>
          )}

          {activeTab === 'visualize' && (
            <div className="space-y-4">
              <SummaryDashboard />
              <IncomeSankey />
              <BudgetCharts />
            </div>
          )}

          {activeTab === 'projections' && (
            <div className="space-y-4">
              <SummaryDashboard />
              <ProjectionsPanel />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="cyber-card mt-8 py-4" style={{ borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
          <div className="container mx-auto px-4 text-center text-sm">
            <p className="neon-cyan uppercase tracking-wider font-bold">COFFERS - Personal Budget Planning Tool</p>
            <p className="mt-1 opacity-70" style={{ color: 'var(--cyber-cyan)' }}>Data saved locally in your browser</p>
          </div>
        </footer>
      </div>
    </BudgetProvider>
  );
}

export default App;
