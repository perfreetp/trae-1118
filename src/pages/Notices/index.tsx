import { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import NoticeForm from "@/components/forms/NoticeForm";
import { cn, formatDateTime } from "@/utils";
import type { Notice } from "@/types";

export default function Notices() {
  const { notices, markNoticeRead } = useAppStore();
  const [selectedType, setSelectedType] = useState<Notice["type"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);

  const typeOptions = [
    { value: "all" as const, label: "全部" },
    { value: "normal" as const, label: "普通通知" },
    { value: "urgent" as const, label: "紧急通知" },
    { value: "emergency" as const, label: "应急广播" },
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesType = selectedType === "all" || n.type === selectedType;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = {
    total: notices.length,
    unread: notices.filter((n) => !n.isRead).length,
    urgent: notices.filter((n) => n.type === "urgent" || n.type === "emergency").length,
  };

  const getTypeIcon = (type: Notice["type"]) => {
    switch (type) {
      case "emergency":
        return <AlertCircle className="w-5 h-5 text-danger-600" />;
      case "urgent":
        return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      default:
        return <Bell className="w-5 h-5 text-primary-600" />;
    }
  };

  const getTypeColor = (type: Notice["type"]) => {
    switch (type) {
      case "emergency":
        return "bg-danger-50 border-danger-200";
      case "urgent":
        return "bg-warning-50 border-warning-200";
      default:
        return "bg-primary-50 border-primary-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">通知公告</h1>
          <p className="text-slate-500 mt-1">系统通知和公告管理</p>
        </div>
        <button
          onClick={() => setShowNoticeForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          发布通知
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">通知总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning-50 text-warning-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.unread}</p>
              <p className="text-sm text-slate-500">未读通知</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-danger-50 text-danger-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.urgent}</p>
              <p className="text-sm text-slate-500">紧急通知</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedType(opt.value)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                selectedType === opt.value
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索通知..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className={cn(
              "bg-white rounded-xl shadow-sm border overflow-hidden transition-all",
              getTypeColor(notice.type),
              !notice.isRead && "ring-2 ring-primary-500 ring-offset-2"
            )}
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => {
                setExpandedId(expandedId === notice.id ? null : notice.id);
                if (!notice.isRead) {
                  markNoticeRead(notice.id);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-white shadow-sm">
                  {getTypeIcon(notice.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-slate-800 text-lg">{notice.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notice.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                      )}
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          notice.type === "emergency"
                            ? "bg-danger-100 text-danger-700"
                            : notice.type === "urgent"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-primary-100 text-primary-700"
                        )}
                      >
                        {notice.type === "emergency"
                          ? "应急广播"
                          : notice.type === "urgent"
                          ? "紧急"
                          : "普通"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-slate-400 transition-transform",
                          expandedId === notice.id && "rotate-180"
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {notice.publisher}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDateTime(notice.publishTime)}
                    </span>
                  </div>
                </div>
              </div>

              {expandedId === notice.id && (
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <p className="text-slate-700 leading-relaxed">{notice.content}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="text-xs text-slate-500">接收对象：</span>
                    {notice.targetRoles.map((role) => (
                      <span
                        key={role}
                        className="text-xs px-2 py-0.5 rounded-full bg-white text-slate-600"
                      >
                        {role === "security"
                          ? "安保部"
                          : role === "engineering"
                          ? "工程部"
                          : role === "supervisor"
                          ? "监管人员"
                          : "管理员"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredNotices.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-slate-400 shadow-sm border border-slate-100">
            <Bell className="w-12 h-12 mx-auto mb-3" />
            <p>暂无符合条件的通知</p>
          </div>
        )}
      </div>

      <NoticeForm
        isOpen={showNoticeForm}
        onClose={() => setShowNoticeForm(false)}
      />
    </div>
  );
}
