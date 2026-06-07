import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  AlertCircle,
  Users,
  Building2,
  Store,
  Siren,
  BarChart3,
  Bell,
  Phone,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "@/utils";
import { useAppStore } from "@/store/appStore";

const menuItems = [
  { path: "/dashboard", label: "值班看板", icon: LayoutDashboard },
  { path: "/patrol", label: "巡更路线", icon: Route },
  { path: "/events", label: "事件处置", icon: AlertCircle },
  { path: "/crowd", label: "客流预警", icon: Users },
  { path: "/facility", label: "设施检查", icon: Building2 },
  { path: "/merchant", label: "商户整改", icon: Store },
  { path: "/drill", label: "应急演练", icon: Siren },
  { path: "/reports", label: "经营报表", icon: BarChart3 },
  { path: "/notices", label: "通知公告", icon: Bell },
  { path: "/contacts", label: "应急联系人", icon: Phone },
];

export default function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, currentUser } = useAppStore();

  return (
    <aside
      className={cn(
        "flex flex-col bg-gradient-to-b from-primary-800 to-primary-900 text-white transition-all duration-300 h-screen sticky top-0",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-primary-700">
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-lg font-bold">智慧商管</h1>
              <p className="text-xs text-primary-300">公共安全值守系统</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-900/50"
                      : "text-primary-200 hover:bg-primary-700/50 hover:text-white",
                    sidebarCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3 border-t border-primary-700">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-primary-700/50",
            sidebarCollapsed && "justify-center"
          )}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full border-2 border-primary-500 flex-shrink-0"
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-primary-300 truncate">{currentUser.department}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary-600 border-2 border-primary-800 text-white flex items-center justify-center hover:bg-primary-500 transition-colors shadow-lg"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
