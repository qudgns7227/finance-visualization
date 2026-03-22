import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function BalanceChart({ data }) {
  const formatAmount = (value) => {
    if (!value) return '0';
    const trillion = Math.floor(value / 1000000000000);
    const billion = Math.floor((value % 1000000000000) / 100000000);
    if (trillion > 0) return `${trillion}조`;
    if (billion > 0) return `${billion}억`;
    return Math.floor(value / 1000000) + '백만';
  };

  const chartData = data.map(item => ({
    year: item.year,
    assets: item.totalAssets || 0,
    liabilities: item.totalLiabilities || 0,
    equity: item.totalEquity || 0,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🏦 자산 · 부채 · 자본 구조
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatAmount} />
          <Tooltip 
            formatter={(value) => formatAmount(value)}
            labelFormatter={(label) => `${label}년`}
          />
          <Legend />
          <Bar dataKey="assets" stackId="a" fill="#10b981" name="자산" />
          <Bar dataKey="liabilities" stackId="a" fill="#ef4444" name="부채" />
          <Bar dataKey="equity" stackId="a" fill="#f59e0b" name="자본" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
