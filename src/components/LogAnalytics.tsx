import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search, Sparkles, Download, Filter, MapPin } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  method: string;
  path: string;
  status: number;
  ip: string;
  duration: number;
  message: string;
}

const mockLogs: LogEntry[] = [
  { timestamp: "2025-11-06 10:23:45", level: "INFO", method: "GET", path: "/api/user/profile", status: 200, ip: "192.168.1.100", duration: 45, message: "Request completed successfully" },
  { timestamp: "2025-11-06 10:23:42", level: "WARN", method: "POST", path: "/api/payment/checkout", status: 429, ip: "192.168.1.101", duration: 12, message: "Rate limit exceeded" },
  { timestamp: "2025-11-06 10:23:38", level: "ERROR", method: "POST", path: "/api/order/create", status: 500, ip: "192.168.1.102", duration: 234, message: "Database connection timeout" },
  { timestamp: "2025-11-06 10:23:35", level: "INFO", method: "GET", path: "/api/product/list", status: 200, ip: "192.168.1.103", duration: 67, message: "Request completed successfully" },
  { timestamp: "2025-11-06 10:23:30", level: "ERROR", method: "DELETE", path: "/api/admin/delete", status: 403, ip: "192.168.1.104", duration: 8, message: "Unauthorized access attempt" },
  { timestamp: "2025-11-06 10:23:28", level: "WARN", method: "POST", path: "/api/login", status: 401, ip: "192.168.1.105", duration: 156, message: "Invalid credentials" },
  { timestamp: "2025-11-06 10:23:25", level: "INFO", method: "GET", path: "/api/order/status", status: 200, ip: "192.168.1.106", duration: 32, message: "Request completed successfully" },
  { timestamp: "2025-11-06 10:23:20", level: "ERROR", method: "POST", path: "/api/payment/refund", status: 500, ip: "192.168.1.107", duration: 189, message: "Payment service unavailable" },
];

const ipGeoData = [
  { country: "中国", count: 450 },
  { country: "美国", count: 320 },
  { country: "日本", count: 180 },
  { country: "英国", count: 120 },
  { country: "德国", count: 95 },
  { country: "其他", count: 235 },
];

const attackerIPs = [
  { ip: "192.168.1.105", requests: 1247, blocked: 1180, threat: "暴力破解", location: "俄罗斯" },
  { ip: "192.168.1.204", requests: 856, blocked: 802, threat: "SQL 注入", location: "乌克兰" },
  { ip: "192.168.1.88", requests: 432, blocked: 398, threat: "XSS 攻击", location: "美国" },
];

export function LogAnalytics() {
  const [searchQuery, setSearchQuery] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string>("");
  const [logLevel, setLogLevel] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("1h");

  const handleAIAnalysis = async () => {
    if (!aiPrompt.trim()) {
      toast.error("请输入分析需求");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult = `📊 AI 分析报告

🔍 分析范围：最近 1 小时日志
🎯 关键发现：

1. 检测到 3 个高频攻击 IP 地址
   - 192.168.1.105 (俄罗斯) - 1247 次请求，95% 被拦截
   - 192.168.1.204 (乌克兰) - 856 次请求，94% 被拦截
   - 192.168.1.88 (美国) - 432 次请求，92% 被拦截

2. 主要攻击类型分布：
   - 暴力破解：43%
   - SQL 注入：30%
   - XSS 攻击：27%

3. 威胁等级评估：⚠️ 中等偏高
   - 建议立即将上述 IP 加入黑名单
   - 考虑启用地理位置限制

4. 受影响的 API 端点：
   - /api/login (暴力破解攻击)
   - /api/payment/** (SQL 注入尝试)
   - /api/user/search (XSS 攻击)

✅ 推荐措施：
- 加强 /api/login 接口的限流策略
- 对支付相关接口启用严格的参数验证
- 更新 WAF 规则以应对新型攻击模式`;

    setAiResult(mockResult);
    toast.success("AI 分析完成");
    setIsAnalyzing(false);
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchLevel = logLevel === "all" || log.level === logLevel;
    const matchSearch = !searchQuery || 
      log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchLevel && matchSearch;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "text-red-500";
      case "WARN": return "text-yellow-500";
      default: return "text-green-500";
    }
  };

  const getLevelBadgeVariant = (level: string): "default" | "secondary" | "destructive" => {
    switch (level) {
      case "ERROR": return "destructive";
      case "WARN": return "default";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>日志分析工作台</h2>
        <p className="text-muted-foreground mt-2">智能日志查询与威胁分析</p>
      </div>

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">日志查询</TabsTrigger>
          <TabsTrigger value="ai">AI 分析</TabsTrigger>
          <TabsTrigger value="threats">威胁情报</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>日志过滤器</CardTitle>
              <CardDescription>根据条件筛选日志记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>关键词搜索</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="路径、IP 或消息..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>日志级别</Label>
                  <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="INFO">INFO</SelectItem>
                      <SelectItem value="WARN">WARN</SelectItem>
                      <SelectItem value="ERROR">ERROR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>时间范围</Label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">最近 1 小时</SelectItem>
                      <SelectItem value="6h">最近 6 小时</SelectItem>
                      <SelectItem value="24h">最近 24 小时</SelectItem>
                      <SelectItem value="7d">最近 7 天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  高级筛选
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  导出日志
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>日志记录</CardTitle>
              <CardDescription>
                显示 {filteredLogs.length} / {mockLogs.length} 条日志
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-3">
                  {filteredLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className="flex flex-col space-y-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground font-mono">
                            {log.timestamp}
                          </span>
                          <Badge variant={getLevelBadgeVariant(log.level)}>
                            {log.level}
                          </Badge>
                          <Badge variant="outline">{log.method}</Badge>
                          <span className={`text-sm ${log.status >= 400 ? 'text-red-500' : 'text-green-500'}`}>
                            {log.status}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {log.duration}ms
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{log.path}</span>
                        <span className="text-sm text-muted-foreground">from {log.ip}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI 智能分析
                </CardTitle>
                <CardDescription>
                  使用自然语言描述分析需求，AI 将自动生成报告
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>分析需求</Label>
                  <Textarea
                    placeholder="例如：找出最近 1 小时的高频攻击 IP"
                    rows={5}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "分析中..." : "开始 AI 分析"}
                </Button>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">快速查询示例：</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "最近的错误日志",
                      "高频攻击 IP",
                      "慢查询接口",
                      "异常流量峰值"
                    ].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => setAiPrompt(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>分析结果</CardTitle>
                <CardDescription>AI 生成的可视化报告</CardDescription>
              </CardHeader>
              <CardContent>
                {aiResult ? (
                  <ScrollArea className="h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap">
                      {aiResult}
                    </pre>
                  </ScrollArea>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Sparkles className="h-12 w-12 mx-auto opacity-50" />
                      <p>输入分析需求后，AI 将在此处展示结果</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  IP 地理分布
                </CardTitle>
                <CardDescription>请求来源地理位置统计</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ipGeoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="请求数" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>高频攻击 IP</CardTitle>
                <CardDescription>检测到的可疑 IP 地址</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attackerIPs.map((attacker, i) => (
                    <div 
                      key={i}
                      className="p-4 rounded-lg border bg-card space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{attacker.ip}</span>
                        <Badge variant="destructive">{attacker.threat}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">请求数</p>
                          <p>{attacker.requests}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">拦截数</p>
                          <p>{attacker.blocked}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">位置</p>
                          <p>{attacker.location}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        加入黑名单
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
