import { useState } from "react";
import { TrafficDashboard } from "./components/TrafficDashboard";
import { RouteConfigurator } from "./components/RouteConfigurator";
import { SecurityCenter } from "./components/SecurityCenter";
import { LogAnalytics } from "./components/LogAnalytics";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { 
  LayoutDashboard, 
  Route, 
  Shield, 
  FileText, 
  Menu,
  X
} from "lucide-react";

type Page = "dashboard" | "routes" | "security" | "logs";

const navigation = [
  { id: "dashboard" as Page, name: "流量监控", icon: LayoutDashboard },
  { id: "routes" as Page, name: "路由配置", icon: Route },
  { id: "security" as Page, name: "安全策略", icon: Shield },
  { id: "logs" as Page, name: "日志分析", icon: FileText },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <TrafficDashboard />;
      case "routes":
        return <RouteConfigurator />;
      case "security":
        return <SecurityCenter />;
      case "logs":
        return <LogAnalytics />;
      default:
        return <TrafficDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r transition-transform
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b">
            <h1 className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>智能网关平台</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Smart Gateway Manager
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm">系统版本</p>
              <p className="text-sm text-muted-foreground mt-1">
                v2.4.1 (2025-11-06)
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          {renderPage()}
        </div>
      </main>

      <Toaster />
    </div>
  );
}
