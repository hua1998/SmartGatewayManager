import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, AlertCircle, Clock } from "lucide-react";

// Mock data for traffic monitoring
const trafficData = [
  { time: "00:00", requests: 1200, latency: 45, errors: 12 },
  { time: "04:00", requests: 800, latency: 38, errors: 5 },
  { time: "08:00", requests: 3200, latency: 52, errors: 28 },
  { time: "12:00", requests: 4500, latency: 68, errors: 45 },
  { time: "16:00", requests: 5200, latency: 75, errors: 52 },
  { time: "20:00", requests: 3800, latency: 58, errors: 31 },
  { time: "23:59", requests: 2100, latency: 48, errors: 18 },
];

const regionData = [
  { name: "亚太", value: 45, color: "#3b82f6" },
  { name: "欧洲", value: 30, color: "#8b5cf6" },
  { name: "北美", value: 20, color: "#10b981" },
  { name: "其他", value: 5, color: "#f59e0b" },
];

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  description 
}: { 
  title: string; 
  value: string; 
  trend: string; 
  icon: any;
  description: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="mt-2">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">
        {trend}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </CardContent>
  </Card>
);

export function TrafficDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2>流量监控仪表盘</h2>
        <p className="text-muted-foreground mt-2">实时监控网关流量、延迟和错误率</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="总请求量"
          value="2.4M"
          trend="+12.5%"
          icon={Activity}
          description="较昨天增长"
        />
        <MetricCard
          title="平均延迟"
          value="58ms"
          trend="-8.2%"
          icon={Clock}
          description="较昨天下降"
        />
        <MetricCard
          title="错误率"
          value="0.82%"
          trend="+0.3%"
          icon={AlertCircle}
          description="较昨天上升"
        />
        <MetricCard
          title="成功率"
          value="99.18%"
          trend="+0.1%"
          icon={TrendingUp}
          description="较昨天增长"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>请求量趋势</CardTitle>
            <CardDescription>过去 24 小时的请求量变化</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="请求量"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>延迟与错误</CardTitle>
            <CardDescription>过去 24 小时的系统性能指标</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#8b5cf6" 
                  name="延迟 (ms)"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="errors" 
                  stroke="#ef4444" 
                  name="错误数"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>流量地理分布</CardTitle>
            <CardDescription>按区域统计的请求占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>热门 API 路径</CardTitle>
            <CardDescription>访问量最高的前 5 个接口</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { path: "/api/payment/checkout", count: "458.2K", percent: 85 },
                { path: "/api/user/profile", count: "321.5K", percent: 68 },
                { path: "/api/order/list", count: "245.8K", percent: 52 },
                { path: "/api/product/search", count: "189.3K", percent: 40 },
                { path: "/api/auth/login", count: "156.7K", percent: 33 },
              ].map((api, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono">{api.path}</span>
                    <span className="text-muted-foreground">{api.count}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${api.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
