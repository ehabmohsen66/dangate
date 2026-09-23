'use client';
// "Results you can measure" card for the homepage, built on components/ui/area-chart-1.
// The figures are an ILLUSTRATIVE example of the dashboard every client gets,
// not a specific client's results. Swap in real, approved client data here.
import { Target, Search, Wallet } from 'lucide-react';
import IncidentReportCard, { UpTrendIcon, DownTrendIcon, type ChartSeries, type MetricInfo } from '@/components/ui/area-chart-1';

const month = (back: number) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - back); return d; };
const pts = (vals: number[]) => vals.map((v, i) => ({ key: month(vals.length - 1 - i), data: v }));

const series: ChartSeries[] = [
  { key: 'Qualified leads', data: pts([38, 46, 52, 61, 74, 88]) },
  { key: 'Organic traffic', data: pts([20, 24, 31, 36, 45, 57]) },
  { key: 'Paid conversions', data: pts([12, 15, 14, 19, 23, 27]) },
];

const good = { trendBaseColor: '#bfe6d0', trendStrokeColor: '#1f8a52' };
const icon = (I: typeof Target) => { const C = ({ className }: { className?: string }) => <I className={className} size={18} color="#075794" strokeWidth={1.8} />; return C; };

const metrics: MetricInfo[] = [
  { id: 'cpl', Icon: icon(Wallet), label: 'Cost per lead', tooltip: 'Cost per qualified lead', value: '−38%', TrendIcon: DownTrendIcon, delay: 0, ...good },
  { id: 'org', Icon: icon(Search), label: 'Organic revenue', tooltip: 'Revenue from organic search', value: '2.4×', TrendIcon: UpTrendIcon, delay: 0.08, ...good },
  { id: 'pipe', Icon: icon(Target), label: 'Pipeline value', tooltip: 'Sales pipeline value', value: '+65%', TrendIcon: UpTrendIcon, delay: 0.16, ...good },
];

export function ResultsCard() {
  return (
    <IncidentReportCard
      title="Growth dashboard"
      subtitle="Illustrative example of the reporting every client receives"
      legend={[{ name: 'Qualified leads', color: '#075794' }, { name: 'Organic traffic', color: '#f15a22' }, { name: 'Paid conversions', color: '#8fb3d1' }]}
      series={series}
      colorScheme={['#075794', '#f15a22', '#8fb3d1']}
      metrics={metrics}
      formatTick={(d) => d.toLocaleDateString('en-US', { month: 'short' })}
      animateOnView
      className="results-card max-w-none"
    />
  );
}
