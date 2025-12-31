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
      { name: 'Gross Income', color: '#00f0ff' },
      { name: 'Taxes', color: '#ff0055' },
      { name: 'Net Income', color: '#00ff88' },
      { name: 'Expenses', color: '#ffff00' },
      { name: 'Savings', color: '#9d00ff' },
      { name: 'Investments', color: '#ff00ff' },
    ];

    if (monthlyRemaining > 0) {
      nodes.push({ name: 'Remaining', color: '#00f0ff' });
    }

    const links: SankeyLink[] = [
      { source: 0, target: 1, value: monthlyTaxes, color: '#ff0055' },
      { source: 0, target: 2, value: monthlyNet, color: '#00ff88' },
      { source: 2, target: 3, value: monthlyExpenses, color: '#ffff00' },
      { source: 2, target: 4, value: monthlySavings, color: '#9d00ff' },
      { source: 2, target: 5, value: monthlyInvestments, color: '#ff00ff' },
    ];

    if (monthlyRemaining > 0) {
      links.push({ source: 2, target: 6, value: monthlyRemaining, color: '#00f0ff' });
    }

    return { nodes, links };
  }, [summary]);

  const width = 800;
  const height = 350;
  const padding = { top: 15, right: 180, bottom: 15, left: 180 };

  const sankeyGenerator = d3Sankey
    .sankey<{}, {}>()
    .nodeWidth(15)
    .nodePadding(15)
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
    <div className="cyber-card rounded-lg p-4 relative overflow-hidden">
      <div className="scanline-effect"></div>
      <h3 className="text-lg font-bold mb-3 neon-cyan uppercase tracking-wider">
        Monthly Income Flow
      </h3>
      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto" style={{ background: 'transparent' }}>
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
                  strokeOpacity={0.5}
                  strokeWidth={Math.max(1, (link.width ?? 0))}
                  style={{
                    filter: `drop-shadow(0 0 5px ${link.color})`
                  }}
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
                  fillOpacity={0.9}
                  stroke={node.color}
                  strokeWidth={2}
                  style={{
                    filter: `drop-shadow(0 0 8px ${node.color})`
                  }}
                />
                <text
                  x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                  y={(y0 + y1) / 2}
                  dy="0.35em"
                  textAnchor={x0 < width / 2 ? 'start' : 'end'}
                  className="text-sm font-bold uppercase"
                  fill={node.color}
                  style={{
                    textShadow: `0 0 10px ${node.color}`
                  }}
                >
                  {node.name}
                </text>
                <text
                  x={x0 < width / 2 ? x1 + 6 : x0 - 6}
                  y={(y0 + y1) / 2 + 15}
                  dy="0.35em"
                  textAnchor={x0 < width / 2 ? 'start' : 'end'}
                  className="text-xs"
                  fill="#00f0ff"
                  style={{
                    opacity: 0.8
                  }}
                >
                  {formatCurrency(node.value || 0)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs opacity-70 mt-2 text-center" style={{ color: 'var(--cyber-cyan)' }}>
        Hover over flows for details · Flow width = relative amount
      </p>
    </div>
  );
}
