import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const colors = [
  'hsl(45, 93%, 47%)',   // Gold for #1
  'hsl(190, 100%, 50%)', // Cyan
  'hsl(280, 80%, 65%)',  // Purple
  'hsl(160, 84%, 39%)',  // Green
  'hsl(25, 95%, 53%)',   // Orange
];

const TopProductsChart = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-1">
            {item.name}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Units Sold:</span>
              <span className="font-medium text-foreground">
                {item.unitsSold}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Revenue:</span>
              <span className="font-medium text-emerald-400">
                ₹{item.revenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Trophy className="h-5 w-5 text-amber-400" />
          Top 5 Selling Products
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                stroke="hsl(200, 20%, 50%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="hsl(200, 20%, 50%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'hsl(240, 10%, 15%)' }}
              />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={30}>
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {data.slice(0, 5).map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: colors[index] }}
                />
                <span
                  className={
                    index === 0
                      ? 'font-medium text-amber-400'
                      : 'text-muted-foreground'
                  }
                >
                  {index === 0 && '👑 '}
                  {product.name}
                </span>
              </div>
              <span className="text-foreground font-medium">
                {product.unitsSold} units
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;
