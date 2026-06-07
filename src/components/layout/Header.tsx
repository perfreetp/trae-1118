import { useState } from "react";
import { Bell, Search, Clock, Calendar, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/utils";
import { formatDateTime } from "@/utils";

export default function Header() {
  const { notices, currentUser, shifts } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notices.filter((n) => !n.isRead).length;

  const activeShift = shifts.find((s) => s.userId === currentUser.id && s.status === "active");

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索事件、人员、设备..."
            className="w-64 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {activeShift && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-50 text-success-700">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-sm font-medium">{activeShift.name}值班中</span>
            <Clock className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-mono">{formatDateTime(new Date())}</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-800">通知消息</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className={cn(
                      "px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors",
                      !notice.isRead && "bg-primary-50/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                          notice.type === "emergency"
                            ? "bg-danger-500"
                            : notice.type === "urgent"
                            ? "bg-warning-500"
                            : "bg-primary-500"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{notice.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{notice.publishTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full border-2 border-slate-200"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">{currentUser.name}</p>
            <p className="text-xs text-slate-500">{currentUser.department}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
