import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Sparkles, Plus, Edit, Trash2, Copy } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Route {
  id: string;
  path: string;
  method: string;
  target: string;
  condition: string;
  status: "active" | "inactive";
}

const mockRoutes: Route[] = [
  { id: "1", path: "/api/payment/**", method: "POST", target: "lb://payment-service", condition: "", status: "active" },
  { id: "2", path: "/api/user/**", method: "GET", target: "lb://user-service", condition: "", status: "active" },
  { id: "3", path: "/api/order/**", method: "ALL", target: "lb://order-service", condition: "region==EU", status: "active" },
  { id: "4", path: "/api/product/**", method: "GET", target: "lb://product-service", condition: "", status: "inactive" },
];

export function RouteConfigurator() {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    path: "",
    method: "GET",
    target: "",
    condition: "",
  });

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("请输入路由配置需求");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI generated config based on prompt
    const generated = {
      path: "/api/payment/**",
      method: "POST",
      target: "lb://de-payment-service",
      condition: "region==EU",
    };
    
    setFormData(generated);
    toast.success("AI 已生成路由配置，请检查后提交");
    setIsGenerating(false);
  };

  const handleAddRoute = () => {
    if (!formData.path || !formData.target) {
      toast.error("请填写路径和目标服务");
      return;
    }

    const newRoute: Route = {
      id: Date.now().toString(),
      ...formData,
      status: "active",
    };

    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...newRoute, id: editingRoute.id } : r));
      toast.success("路由已更新");
    } else {
      setRoutes([...routes, newRoute]);
      toast.success("路由已添加");
    }

    setFormData({ path: "", method: "GET", target: "", condition: "" });
    setEditingRoute(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (route: Route) => {
    setEditingRoute(route);
    setFormData({
      path: route.path,
      method: route.method,
      target: route.target,
      condition: route.condition,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    toast.success("路由已删除");
  };

  const handleDuplicate = (route: Route) => {
    const newRoute: Route = {
      ...route,
      id: Date.now().toString(),
      path: route.path + "-copy",
    };
    setRoutes([...routes, newRoute]);
    toast.success("路由已复制");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>动态路由配置器</h2>
          <p className="text-muted-foreground mt-2">可视化管理网关路由规则，支持 AI 智能生成</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingRoute(null);
              setFormData({ path: "", method: "GET", target: "", condition: "" });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              新增路由
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRoute ? "编辑路由" : "新增路由"}</DialogTitle>
              <DialogDescription>
                配置网关路由规则，或使用 AI 助手自动生成
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* AI Assistant */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    AI 路由助手
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="例如：将 /payment 的欧洲用户路由到法兰克福集群"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                  />
                  <Button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? "生成中..." : "AI 生成配置"}
                  </Button>
                </CardContent>
              </Card>

              {/* Manual Configuration */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>路由路径</Label>
                    <Input
                      placeholder="/api/service/**"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>请求方法</Label>
                    <Select value={formData.method} onValueChange={(v) => setFormData({ ...formData, method: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="ALL">ALL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>目标服务</Label>
                  <Input
                    placeholder="lb://service-name 或 http://backend-url"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>路由条件（可选）</Label>
                  <Input
                    placeholder="region==EU 或 Header['X-Version']=='v2'"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button onClick={handleAddRoute}>
                {editingRoute ? "更新" : "添加"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>路由列表</CardTitle>
          <CardDescription>当前共 {routes.length} 条路由规则</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>路径</TableHead>
                <TableHead>方法</TableHead>
                <TableHead>目标服务</TableHead>
                <TableHead>条件</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell className="font-mono text-sm">{route.path}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{route.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{route.target}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {route.condition || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={route.status === "active" ? "default" : "secondary"}>
                      {route.status === "active" ? "活跃" : "禁用"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(route)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(route)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(route.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
