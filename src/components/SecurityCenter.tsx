import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Shield, AlertTriangle, Lock, Zap } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface SecurityPolicy {
  id: string;
  name: string;
  type: "jwt" | "ratelimit" | "waf" | "cors";
  path: string;
  config: string;
  enabled: boolean;
  priority: number;
}

const mockPolicies: SecurityPolicy[] = [
  { id: "1", name: "JWT 认证", type: "jwt", path: "/api/**", config: "issuer=auth-server", enabled: true, priority: 1 },
  { id: "2", name: "API 限流", type: "ratelimit", path: "/api/payment/**", config: "10req/s", enabled: true, priority: 2 },
  { id: "3", name: "SQL 注入防护", type: "waf", path: "/**", config: "block-sql-injection", enabled: true, priority: 3 },
  { id: "4", name: "跨域配置", type: "cors", path: "/api/**", config: "allow-origin=*", enabled: false, priority: 4 },
  { id: "5", name: "支付接口限流", type: "ratelimit", path: "/api/payment/checkout", config: "5req/s", enabled: true, priority: 5 },
];

const threatStats = [
  { type: "SQL 注入", blocked: 1247, severity: "high" },
  { type: "XSS 攻击", blocked: 856, severity: "high" },
  { type: "暴力破解", blocked: 432, severity: "medium" },
  { type: "CSRF", blocked: 218, severity: "medium" },
  { type: "路径遍历", blocked: 143, severity: "low" },
];

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon,
  color 
}: { 
  title: string; 
  value: string; 
  icon: any;
  color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="mt-2">{value}</div>
    </CardContent>
  </Card>
);

export function SecurityCenter() {
  const [policies, setPolicies] = useState<SecurityPolicy[]>(mockPolicies);
  const [filterPath, setFilterPath] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredPolicies = policies.filter(p => {
    const matchPath = !filterPath || p.path.toLowerCase().includes(filterPath.toLowerCase());
    const matchType = filterType === "all" || p.type === filterType;
    return matchPath && matchType;
  });

  const handleTogglePolicy = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    toast.success("策略状态已更新");
  };

  const getPolicyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      jwt: "JWT 认证",
      ratelimit: "流量限制",
      waf: "WAF 防护",
      cors: "跨域配置",
    };
    return labels[type] || type;
  };

  const getPolicyTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      jwt: "default",
      ratelimit: "secondary",
      waf: "destructive",
      cors: "outline",
    };
    return variants[type] || "outline";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>安全策略管理中心</h2>
        <p className="text-muted-foreground mt-2">集中管理 JWT 认证、限流、WAF 等安全规则</p>
      </div>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="活跃策略"
          value={policies.filter(p => p.enabled).length.toString()}
          icon={Shield}
          color="text-green-500"
        />
        <MetricCard
          title="今日拦截"
          value="2,896"
          icon={AlertTriangle}
          color="text-red-500"
        />
        <MetricCard
          title="JWT 验证"
          value="18.4K"
          icon={Lock}
          color="text-blue-500"
        />
        <MetricCard
          title="限流触发"
          value="1,234"
          icon={Zap}
          color="text-yellow-500"
        />
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">策略管理</TabsTrigger>
          <TabsTrigger value="threats">威胁统计</TabsTrigger>
          <TabsTrigger value="config">配置中心</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>策略筛选</CardTitle>
              <CardDescription>按路径或类型过滤安全策略</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>API 路径</Label>
                  <Input
                    placeholder="输入路径进行过滤..."
                    value={filterPath}
                    onChange={(e) => setFilterPath(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>策略类型</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="jwt">JWT 认证</SelectItem>
                      <SelectItem value="ratelimit">流量限制</SelectItem>
                      <SelectItem value="waf">WAF 防护</SelectItem>
                      <SelectItem value="cors">跨域配置</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>策略列表</CardTitle>
              <CardDescription>
                显示 {filteredPolicies.length} / {policies.length} 条策略
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>策略名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>应用路径</TableHead>
                    <TableHead>配置</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow key={policy.id}>
                      <TableCell>{policy.name}</TableCell>
                      <TableCell>
                        <Badge variant={getPolicyTypeBadgeVariant(policy.type)}>
                          {getPolicyTypeLabel(policy.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{policy.path}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {policy.config}
                      </TableCell>
                      <TableCell>{policy.priority}</TableCell>
                      <TableCell>
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => handleTogglePolicy(policy.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          编辑
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>威胁拦截统计</CardTitle>
              <CardDescription>过去 24 小时检测到的安全威胁</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>威胁类型</TableHead>
                    <TableHead>拦截次数</TableHead>
                    <TableHead>严重等级</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threatStats.map((threat, i) => {
                    const total = threatStats.reduce((sum, t) => sum + t.blocked, 0);
                    const percentage = ((threat.blocked / total) * 100).toFixed(1);
                    
                    return (
                      <TableRow key={i}>
                        <TableCell>{threat.type}</TableCell>
                        <TableCell>{threat.blocked.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              threat.severity === "high" ? "destructive" : 
                              threat.severity === "medium" ? "default" : 
                              "secondary"
                            }
                          >
                            {threat.severity === "high" ? "高危" : 
                             threat.severity === "medium" ? "中危" : "低危"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{percentage}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>全局安全配置</CardTitle>
              <CardDescription>配置全局安全策略参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用 WAF 防护</Label>
                  <p className="text-sm text-muted-foreground">
                    自动检测并拦截常见 Web 攻击
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>强制 HTTPS</Label>
                  <p className="text-sm text-muted-foreground">
                    将所有 HTTP 请求重定向到 HTTPS
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>IP 黑名单</Label>
                  <p className="text-sm text-muted-foreground">
                    启用 IP 黑名单过滤
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>请求签名验证</Label>
                  <p className="text-sm text-muted-foreground">
                    要求所有请求携带有效签名
                  </p>
                </div>
                <Switch />
              </div>

              <div className="pt-4">
                <Button>保存配置</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
