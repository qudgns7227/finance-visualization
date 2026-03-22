import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function RevenueChart({ data }) {
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
    revenue: item.revenue,
    operatingProfit: item.operatingProfit,
    netIncome: item.netIncome,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 매출액 · 영업이익 · 순이익 추이
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" tickFormatter={formatAmount} />
          <YAxis yAxisId="right" orientation="right" tickFormatter={formatAmount} />
          <Tooltip 
            formatter={(value) => formatAmount(value)}
            labelFormatter={(label) => `${label}년`}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="매출액" />
          <Bar yAxisId="left" dataKey="operatingProfit" fill="#8b5cf6" name="영업이익" />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="netIncome" 
            stroke="#ec4899" 
            strokeWidth={2}
            name="순이익"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
