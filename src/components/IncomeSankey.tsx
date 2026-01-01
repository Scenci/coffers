import { useMemo } from 'react';
import { useBudget } from '../context/BudgetContext';
import { calculateBudgetSummary } from '../utils/budgetCalculations';
import * as d3Sankey from 'd3-sankey';

interface SankeyNode extends d3Sankey.SankeyNodeMinimal<{}, {}> {
  name: string;
  color?: string;
}

interface SankeyLink extends d3Sankey.SankeyLinkMinimal<{}, {}> {
  color?: string;
}

export function IncomeSankey() {
  const { state } = useBudget();
  const summary = calculateBudgetSummary(state);

  const { nodes, links } = useMemo(() => {
    const monthlyNet = summary.netIncome / 12;
    const monthlyTaxes = summary.taxes.total / 12;
    const monthlyExpenses = summary.totalExpenses / 12;
    const monthlySavings = summary.totalSavings / 12;
    const monthlyInvestments = summary.totalInvestments / 12;
    const monthlyRemaining = Math.max(0, summary.remaining / 12);

    const nodes: SankeyNode[] = [
      { name: 'Gross Income', color: '#2A7F7F' }, // teal
      { name: 'Taxes', color: '#B7410E' }, // rust
      { name: 'Net Income', color: '#9CAF88' }, // sage
      { name: 'Expenses', color: '#FF6B6B' }, // coral
      { name: 'Savings', color: '#7A8450' }, // olive
      { name: 'Investments', color: '#2A7F7F' }, // teal
    ];

    if (monthlyRemaining > 0) {
      nodes.push({ name: 'Remaining', color: '#95CFC5' }); // seafoam
    }

    const links: SankeyLink[] = [
      { source: 0, target: 1, value: monthlyTaxes, color: '#B7410E' },
      { source: 0, target: 2, value: monthlyNet, color: '#9CAF88' },
      { source: 2, target: 3, value: monthlyExpenses, color: '#FF6B6B' },
      { source: 2, target: 4, value: monthlySavings, color: '#7A8450' },
      { source: 2, target: 5, value: monthlyInvestments, color: '#2A7F7F' },
    ];

    if (monthlyRemaining > 0) {
      links.push({ source: 2, target: 6, value: monthlyRemaining, color: '#95CFC5' });
    }

    return { nodes, links };
  }, [summary]);

  const width = 800;
  const height = 500;
  const padding = { top: 20, right: 200, bottom: 20, left: 200 };

  const sankeyGenerator = d3Sankey
    .sankey<{}, {}>()
    .nodeWidth(20)
    .nodePadding(20)
    .extent([
      [padding.left, padding.top],
      [width - padding.right, height - padding.bottom],
    ]);

  const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
    nodes: nodes.map((d) => ({ ...d })) as any,
    links: links.map((d) => ({ ...d })) as any,
  }) as { nodes: SankeyNode[]; links: SankeyLink[] };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="form-card pattern-grid">
      <div className="bg-mcm-warm-cream dark:bg-mcm-navy border-2 border-mcm-charcoal dark:border-mcm-cream p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-mcm-mustard/10 clip-path-hexagon"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-8 h-8 bg-mcm-teal dark:bg-mcm-seafoam clip-path-diamond"></div>
          <h3 className="text-2xl font-display font-bold text-mcm-charcoal dark:text-mcm-cream uppercase tracking-tight">
            Monthly Income Flow
          </h3>
        </div>
        <div className="overflow-x-auto bg-white dark:bg-mcm-slate p-4 border-2 border-mcm-charcoal/20 dark:border-mcm-cream/20 relative z-10">
          <svg width={width} height={height} className="mx-auto">
            {/* Links */}
            {sankeyLinks.map((link, i) => {
              const linkPath = d3Sankey.sankeyLinkHorizontal();
              const path = linkPath(link as any);
              const source = link.source as SankeyNode;
              const target = link.target as SankeyNode;
              return (
                <g key={`link-${i}`}>
                  <path
                    d={path || ''}
                    fill="none"
                    stroke={link.color || '#999'}
                    strokeOpacity={0.4}
                    strokeWidth={Math.max(1, (link.width ?? 0))}
                  />
                  <title>
                    {source.name} → {target.name}: {formatCurrency(link.value ?? 0)}
                  </title>
                </g>
              );
            })}

            {/* Nodes */}
            {sankeyNodes.map((node, i) => {
              const x0 = node.x0 ?? 0;
              const x1 = node.x1 ?? 0;
              const y0 = node.y0 ?? 0;
              const y1 = node.y1 ?? 0;
              return (
                <g key={`node-${i}`}>
                  <rect
                    x={x0}
                    y={y0}
                    width={x1 - x0}
                    height={y1 - y0}
                    fill={node.color || '#666'}
                    fillOpacity={0.85}
                    stroke="#2D2D2A"
                    strokeWidth={2}
                  />
                  <text
                    x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                    y={(y0 + y1) / 2}
                    dy="0.35em"
                    textAnchor={x0 < width / 2 ? 'start' : 'end'}
                    className="text-sm font-display font-semibold fill-mcm-charcoal dark:fill-mcm-cream"
                  >
                    {node.name}
                  </text>
                  <text
                    x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                    y={(y0 + y1) / 2 + 16}
                    dy="0.35em"
                    textAnchor={x0 < width / 2 ? 'start' : 'end'}
                    className="text-xs font-medium fill-mcm-slate dark:fill-mcm-cream/80"
                  >
                    {formatCurrency(node.value || 0)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-xs font-medium text-mcm-slate dark:text-mcm-cream/70 mt-4 text-center uppercase tracking-wide relative z-10">
          Hover over the flows to see exact amounts • Width represents relative amounts
        </p>
      </div>
    </div>
  );
}
