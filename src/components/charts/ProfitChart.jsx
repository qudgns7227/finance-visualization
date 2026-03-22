import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ProfitChart({ data }) {
  const chartData = data.map(item => ({
    year: item.year,
    operatingMargin: parseFloat(item.operatingMargin) || 0,
    netMargin: parseFloat(item.netMargin) || 0,
  }));

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💹 수익성 지표 (이익률)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: '%', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => `${value.toFixed(2)}%`}
            labelFormatter={(label) => `${label}년`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="operatingMargin" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="영업이익률"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="netMargin" 
            stroke="#ec4899" 
            strokeWidth={2}
            name="순이익률"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
        <p>💡 <strong>이익률이란:</strong> 매출액 대비 얼마나 이익이 남는지를 나타내는 지표입니다. 높을수록 좋습니다.</p>
      </div>
    </div>
  );
}
