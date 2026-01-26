import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  time: number;
  value: number;
}

interface ChartProps {
  data: DataPoint[];
  color: string;
  label: string;
}

export function Chart({ data, color, label }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="time"
          tick={{ fill: "#888", fontSize: 12 }}
          tickFormatter={(value) => `${value}s`}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: "#888", fontSize: 12 }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "4px",
          }}
          labelFormatter={(value) => `${value}s ago`}
          formatter={(value) => [`${Number(value).toFixed(1)}%`, label]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
