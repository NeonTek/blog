"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { format, parseISO } from "date-fns"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartData = Record<string, string | number>

type BaseChartProps = {
  data: ChartData[]
  label?: string
}

// ✅ LineChart Props
type LineChartProps = BaseChartProps & {
  xField: string
  yField: string
}

// ✅ BarChart Props
type BarChartProps = BaseChartProps & {
  categoryField: string
  valueField: string
}

// ✅ PieChart & DonutChart Props
type PieChartProps = {
  data: ChartData[]
  categoryField: string
  valueField: string
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// ✅ Line Chart Component
export function LineChart({ data, xField, yField, label }: LineChartProps) {
  return (
    <ChartContainer
      config={{
        [yField]: {
          label: label || "Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey={xField}
            tickFormatter={(value: string) => {
              try {
                return format(parseISO(value), "MMM d")
              } catch {
                return value
              }
            }}
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey={yField}
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// ✅ Bar Chart Component
export function BarChart({
  data,
  categoryField,
  valueField,
  label,
}: BarChartProps) {
  return (
    <ChartContainer
      config={{
        [valueField]: {
          label: label || "Value",
          color: "#0891b2", // Tailwind's cyan-600
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={categoryField} tick={{ fontSize: 12 }} tickMargin={10} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey={valueField}
            radius={[4, 4, 0, 0]}
            fill="#0891b2" // ✅ cyan-600
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

// ✅ Pie Chart Component
export function PieChart({ data, categoryField, valueField }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueField}
          nameKey={categoryField}
          label={({ name, percent }) =>
            percent != null ? `${name}: ${(percent * 100).toFixed(0)}%` : name
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Count"]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// ✅ Donut Chart Component
export function DonutChart({ data, categoryField, valueField }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey={valueField}
          nameKey={categoryField}
          label={({ name, percent }) =>
            percent != null ? `${name}: ${(percent * 100).toFixed(0)}%` : name
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Count"]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}