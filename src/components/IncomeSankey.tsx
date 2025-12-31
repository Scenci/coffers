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
      { name: 'Gross Income', color: '#3B82F6' },
      { name: 'Taxes', color: '#EF4444' },
      { name: 'Net Income', color: '#10B981' },
      { name: 'Expenses', color: '#F97316' },
      { name: 'Savings', color: '#8B5CF6' },
      { name: 'Investments', color: '#6366F1' },
    ];

    if (monthlyRemaining > 0) {
      nodes.push({ name: 'Remaining', color: '#06B6D4' });
    }

    const links: SankeyLink[] = [
      { source: 0, target: 1, value: monthlyTaxes, color: '#EF4444' },
      { source: 0, target: 2, value: monthlyNet, color: '#10B981' },
      { source: 2, target: 3, value: monthlyExpenses, color: '#F97316' },
      { source: 2, target: 4, value: monthlySavings, color: '#8B5CF6' },
      { source: 2, target: 5, value: monthlyInvestments, color: '#6366F1' },
    ];

    if (monthlyRemaining > 0) {
      links.push({ source: 2, target: 6, value: monthlyRemaining, color: '#06B6D4' });
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cyberpunk-card">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 cyberpunk-glow-text">
        Monthly Income Flow
      </h3>
      <div className="overflow-x-auto">
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
                  strokeOpacity={0.3}
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
                  fillOpacity={0.8}
                  stroke="#333"
                  strokeWidth={1}
                />
                <text
                  x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                  y={(y0 + y1) / 2}
                  dy="0.35em"
                  textAnchor={x0 < width / 2 ? 'start' : 'end'}
                  className="text-sm font-medium fill-gray-800 dark:fill-gray-100"
                >
                  {node.name}
                </text>
                <text
                  x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                  y={(y0 + y1) / 2 + 15}
                  dy="0.35em"
                  textAnchor={x0 < width / 2 ? 'start' : 'end'}
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {formatCurrency(node.value || 0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
        Hover over the flows to see exact amounts. Width of flows represents relative amounts.
      </p>
    </div>
  );
}
