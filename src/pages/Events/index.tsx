import { useState } from "react";
import {
  AlertCircle,
  Plus,
  Filter,
  Search,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Image,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import {
  cn,
  formatDateTime,
  getEventLevelColor,
  getEventLevelText,
  getEventStatusColor,
  getEventStatusText,
  getEventTypeText,
} from "@/utils";
import type { EventStatus, EventLevel, EventType } from "@/types";

export default function Events() {
  const { events, users, currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<"all" | EventStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesTab = activeTab === "all" || event.status === activeTab;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const selectedEvent = events.find((e) => e.id === showDetail);

  const tabs = [
    { key: "all" as const, label: "全部", count: events.length },
    { key: "pending" as const, label: "待处理", count: events.filter((e) => e.status === "pending").length },
    { key: "processing" as const, label: "处理中", count: events.filter((e) => e.status === "processing").length },
    { key: "resolved" as const, label: "已解决", count: events.filter((e) => e.status === "resolved").length },
    { key: "closed" as const, label: "已结案", count: events.filter((e) => e.status === "closed").length },
  ];

  const levelOptions: { value: EventLevel; label: string }[] = [
    { value: "low", label: "一般" },
    { value: "medium", label: "重要" },
    { value: "high", label: "紧急" },
    { value: "critical", label: "特急" },
  ];

  const typeOptions: { value: EventType; label: string }[] = [
    { value: "lost-item", label: "失物招领" },
    { value: "missing-person", label: "走失人员" },
    { value: "congestion", label: "客流拥堵" },
    { value: "equipment-fault", label: "设备故障" },
    { value: "fire-hazard", label: "消防隐患" },
    { value: "other", label: "其他事件" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">事件处置</h1>
          <p className="text-slate-500 mt-1">管理和处置各类安全事件</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          上报事件
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex border-b border-slate-200 -mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                    activeTab === tab.key
                      ? "border-primary-600 text-primary-600"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab.label}
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索事件..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">筛选</span>
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setShowDetail(event.id)}
              className={cn(
                "p-4 cursor-pointer transition-colors",
                showDetail === event.id ? "bg-primary-50" : "hover:bg-slate-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-2.5 rounded-lg flex-shrink-0",
                    event.level === "critical"
                      ? "bg-danger-100 text-danger-600"
                      : event.level === "high"
                      ? "bg-orange-100 text-orange-600"
                      : event.level === "medium"
                      ? "bg-warning-100 text-warning-600"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-slate-800">{event.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                        {event.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full border",
                          getEventLevelColor(event.level)
                        )}
                      >
                        {getEventLevelText(event.level)}
                      </span>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getEventStatusColor(event.status)
                        )}
                      >
                        {getEventStatusText(event.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      上报人：{event.reporterName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDateTime(event.createTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      {getEventTypeText(event.type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-3" />
              <p>暂无符合条件的事件</p>
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      getEventLevelColor(selectedEvent.level)
                    )}
                  >
                    {getEventLevelText(selectedEvent.level)}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      getEventStatusColor(selectedEvent.status)
                    )}
                  >
                    {getEventStatusText(selectedEvent.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetail(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">事件类型</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    {getEventTypeText(selectedEvent.type)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">发生位置</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    {selectedEvent.location}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">上报人</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    {selectedEvent.reporterName}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">处理人</p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    {selectedEvent.handlerName || "待分派"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">上报时间</p>
                  <p className="text-sm font-medium text-slate-800 mt-1 font-mono">
                    {formatDateTime(selectedEvent.createTime)}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">更新时间</p>
                  <p className="text-sm font-medium text-slate-800 mt-1 font-mono">
                    {formatDateTime(selectedEvent.updateTime)}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-800 mb-2">事件描述</h4>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    现场图片
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedEvent.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`现场图片${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  处理记录
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-800">
                          {selectedEvent.reporterName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDateTime(selectedEvent.createTime)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">事件已上报</p>
                    </div>
                  </div>

                  {selectedEvent.status !== "pending" && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-success-100 text-success-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-800">
                            {selectedEvent.handlerName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(selectedEvent.updateTime)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">已接手处理</p>
                      </div>
                    </div>
                  )}

                  {selectedEvent.status === "resolved" && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-success-100 text-success-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-800">系统</span>
                          <span className="text-xs text-slate-400">
                            {formatDateTime(selectedEvent.updateTime)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">事件已解决</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                {selectedEvent.status === "pending" && (
                  <button className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    接手处理
                  </button>
                )}
                {selectedEvent.status === "processing" && (
                  <button className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors">
                    标记已解决
                  </button>
                )}
                <button
                  onClick={() => setShowDetail(null)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
