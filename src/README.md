# Coffers - Personal Budget Planning Application

A comprehensive React-based personal budgeting web application that provides real-time visualizations of income flow, expense tracking, and financial projections with interactive controls.

## Features

### Income Management
- Employment income input (salary or hourly)
- Multiple pay frequency options (weekly, bi-weekly, semi-monthly, monthly)
- Tax filing status selection
- Support for multiple income streams (freelance, side business, rental income, etc.)

### Tax Calculations
- Automatic federal income tax calculation based on 2025 tax brackets
- State income tax calculation (all 50 US states)
- FICA (Social Security + Medicare) calculations
- Real-time tax impact visualization

### Savings & Investments
- Flexible savings rate (percentage or fixed dollar amount)
- Emergency fund target tracking
- Investment account management (401k, IRA, Brokerage, Crypto, Real Estate)
- Employer 401k match calculator
- Multiple investment tracking

### Expense Tracking
- Pre-defined expense categories with color coding:
  - Housing, Utilities, Transportation, Food
  - Healthcare, Personal, Entertainment
  - Debt Payments, Miscellaneous
- Custom category creation with custom colors
- Monthly expense budgeting
- Real-time total expense calculation

### Visualizations
- **Sankey Diagram**: Interactive income flow visualization showing the flow from gross income through taxes to net income and allocations
- **Pie Charts**: Expense breakdown and income allocation visualizations
- **Bar Charts**: Monthly budget overview
- **Line Chart**: Long-term wealth projection over time

### Financial Projections
- Interactive sliders for:
  - Time horizon (1-30 years)
  - Expected annual return (1-12%)
  - Savings rate (0-50%)
  - Investment rate (0-50%)
- Projected savings and investment balance calculations
- Compound growth modeling
- Visual wealth growth over time

### Budget Presets
- 50/30/20 Rule
- Aggressive Saver
- Debt Payoff
- Balanced Investor

### User Experience Features
- **Auto-save**: All data automatically saved to browser localStorage
- **Export Options**: Export budget summary as PDF or detailed data as CSV
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: All calculations and visualizations update instantly

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Flow Diagrams**: D3-Sankey
- **Icons**: Lucide React
- **PDF Export**: jsPDF with html2canvas
- **State Management**: React Context + useReducer

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/Scenci/coffers.git
cd coffers
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser and navigate to \`http://localhost:5173\`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the \`dist\` directory.

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
coffers/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # App header with dark mode and export
│   │   ├── IncomeForm.tsx   # Income input form
│   │   ├── LocationForm.tsx # Location and tax context
│   │   ├── SavingsForm.tsx  # Savings and investments
│   │   ├── ExpensesForm.tsx # Expense categories
│   │   ├── SummaryDashboard.tsx # Budget summary
│   │   ├── IncomeSankey.tsx     # Sankey flow diagram
│   │   ├── BudgetCharts.tsx     # Pie and bar charts
│   │   └── ProjectionsPanel.tsx # Financial projections
│   ├── context/             # React Context for state management
│   │   └── BudgetContext.tsx
│   ├── utils/               # Utility functions
│   │   ├── taxCalculations.ts      # Tax calculation logic
│   │   ├── budgetCalculations.ts   # Budget calculations
│   │   └── presets.ts              # Budget presets
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── constants/           # Constants and predefined data
│   │   └── categories.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
\`\`\`

## Usage

### Input Data Tab
1. Enter your employment income (salary or hourly rate)
2. Select your pay frequency and tax filing status
3. Add any additional income streams
4. Set your location for tax calculation
5. Configure savings and investment targets
6. Enter your monthly expenses for each category

### Visualizations Tab
- View the Sankey diagram showing your income flow
- Analyze pie charts for expense breakdown and income allocation
- Review bar charts for monthly budget overview

### Projections Tab
- Adjust sliders to see how different savings rates and returns affect your future wealth
- View projected savings, investments, and total wealth over your chosen time horizon
- Analyze the growth chart to understand compound growth effects

### Using Presets
- Click the "Presets" button in the header
- Select a preset (50/30/20 Rule, Aggressive Saver, etc.)
- The app will automatically adjust your savings and investment rates

### Exporting Data
- Click the "Export" button in the header
- Choose "Export as PDF" for a visual summary
- Choose "Export as CSV" for detailed data you can analyze in Excel

## Features in Detail

### Tax Calculations
The app uses the 2025 federal tax brackets and automatically calculates:
- Federal income tax (progressive brackets based on filing status)
- FICA taxes (Social Security up to wage base + Medicare)
- State income tax (simplified flat rates, Texas = 0%)

### Sankey Diagram
The Sankey diagram visualizes money flow:
- Width of flows represents amount
- Colors match category colors
- Hover to see exact amounts
- Shows complete picture from gross income to final allocations

### Projections
The projection calculator uses:
- Compound interest formula for investments
- Linear growth for savings (no interest assumed)
- Monthly contribution compounding
- Adjustable time horizon and expected returns

## Data Privacy

All your budget data is stored locally in your browser using localStorage. No data is sent to any server. Your financial information remains completely private and secure on your device.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with React and Vite
- Charts powered by Recharts
- Flow diagrams powered by D3-Sankey
- Icons by Lucide
- Styling with Tailwind CSS

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Website**: coffers.benthan.com
**Repository**: https://github.com/Scenci/coffers
