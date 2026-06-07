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
  FileText,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import EventForm from "@/components/forms/EventForm";
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
  const { events, users, currentUser, eventLogs, assignEvent, resolveEvent, updateEventLevel, updateEventReview } = useAppStore();
  const [activeTab, setActiveTab] = useState<"all" | EventStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [newLevel, setNewLevel] = useState<EventLevel>("medium");
  const [levelReason, setLevelReason] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSummary, setReviewSummary] = useState("");
  const [reviewImpact, setReviewImpact] = useState("");
  const [reviewDepartments, setReviewDepartments] = useState<string[]>([]);
  const [reviewMeasures, setReviewMeasures] = useState("");

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
        <button
          onClick={() => setShowEventForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
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

              {selectedEvent.reviewSummary && (
                <div className="mb-6 bg-warning-50 border border-warning-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    事件复盘纪要
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">复盘摘要</p>
                      <p className="text-slate-700">{selectedEvent.reviewSummary}</p>
                    </div>
                    {selectedEvent.impactScope && (
                      <div>
                        <p className="text-xs text-slate-500">影响范围</p>
                        <p className="text-slate-700">{selectedEvent.impactScope}</p>
                      </div>
                    )}
                    {selectedEvent.involvedDepartments && selectedEvent.involvedDepartments.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500">参与部门</p>
                        <div className="flex gap-1 flex-wrap">
                          {selectedEvent.involvedDepartments.map((dept, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-warning-100 text-warning-700 rounded-full"
                            >
                              {dept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedEvent.improvementMeasures && (
                      <div>
                        <p className="text-xs text-slate-500">改进措施</p>
                        <p className="text-slate-700">{selectedEvent.improvementMeasures}</p>
                      </div>
                    )}
                    {selectedEvent.reviewedByName && (
                      <div className="flex items-center gap-4 pt-2 border-t border-warning-200">
                        <div>
                          <p className="text-xs text-slate-500">复盘人</p>
                          <p className="text-slate-700">{selectedEvent.reviewedByName}</p>
                        </div>
                        {selectedEvent.reviewTime && (
                          <div>
                            <p className="text-xs text-slate-500">复盘时间</p>
                            <p className="text-slate-700 font-mono">
                              {formatDateTime(selectedEvent.reviewTime)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  操作时间线
                </h4>
                <div className="space-y-4">
                  {eventLogs
                    .filter((log) => log.eventId === selectedEvent.id)
                    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
                    .map((log) => (
                      <div key={log.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-800">
                              {log.userName}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatDateTime(log.time)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{log.action}</p>
                          {log.remark && (
                            <p className="text-xs text-slate-500 mt-1">
                              {log.remark}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                {selectedEvent.status === "pending" && (
                  <button
                    onClick={() => {
                      assignEvent(selectedEvent.id, currentUser.id, currentUser.name);
                    }}
                    className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    接手处理
                  </button>
                )}
                {selectedEvent.status === "processing" && (
                  <button
                    onClick={() => resolveEvent(selectedEvent.id)}
                    className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
                  >
                    标记已解决
                  </button>
                )}
                {(selectedEvent.status === "resolved" || selectedEvent.status === "closed") &&
                  (selectedEvent.level === "high" || selectedEvent.level === "critical") &&
                  !selectedEvent.reviewSummary && (
                    <button
                      onClick={() => {
                        setReviewSummary("");
                        setReviewImpact("");
                        setReviewDepartments([]);
                        setReviewMeasures("");
                        setShowReviewForm(true);
                      }}
                      className="flex-1 px-4 py-2.5 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      事件复盘
                    </button>
                  )}
                {selectedEvent.status !== "resolved" && selectedEvent.status !== "closed" && (
                  <button
                    onClick={() => {
                      setNewLevel(selectedEvent.level);
                      setLevelReason("");
                      setShowLevelModal(true);
                    }}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    调整等级
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

      {selectedEvent && showLevelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md animate-fade-in">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">调整事件等级</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  当前等级
                </label>
                <span
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-full border",
                    getEventLevelColor(selectedEvent.level)
                  )}
                >
                  {getEventLevelText(selectedEvent.level)}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  调整为
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["low", "medium", "high", "critical"] as EventLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setNewLevel(level)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm border transition-colors",
                        newLevel === level
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {getEventLevelText(level)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  调整原因
                </label>
                <textarea
                  value={levelReason}
                  onChange={(e) => setLevelReason(e.target.value)}
                  placeholder="请填写等级调整原因..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              {(newLevel === "high" || newLevel === "critical") && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <p className="text-xs text-warning-700">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    升级为{getEventLevelText(newLevel)}后将自动触发广播联动，发布通知公告。
                  </p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowLevelModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (levelReason.trim()) {
                    updateEventLevel(
                      selectedEvent.id,
                      newLevel,
                      levelReason,
                      currentUser.id,
                      currentUser.name
                    );
                    setShowLevelModal(false);
                  }
                }}
                disabled={!levelReason.trim()}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认调整
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEvent && showReviewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">事件复盘</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  复盘摘要 <span className="text-danger-500">*</span>
                </label>
                <textarea
                  value={reviewSummary}
                  onChange={(e) => setReviewSummary(e.target.value)}
                  placeholder="请简要描述事件复盘的核心结论..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  影响范围
                </label>
                <textarea
                  value={reviewImpact}
                  onChange={(e) => setReviewImpact(e.target.value)}
                  placeholder="请描述事件的影响范围和程度..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  参与部门
                </label>
                <input
                  type="text"
                  value={reviewDepartments.join(",")}
                  onChange={(e) =>
                    setReviewDepartments(
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="请输入参与部门，多个用逗号分隔，如：安保部,工程部,客服部"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  改进措施
                </label>
                <textarea
                  value={reviewMeasures}
                  onChange={(e) => setReviewMeasures(e.target.value)}
                  placeholder="请描述后续的改进措施和预防方案..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowReviewForm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (reviewSummary.trim()) {
                    updateEventReview(
                      selectedEvent.id,
                      {
                        summary: reviewSummary,
                        impactScope: reviewImpact,
                        involvedDepartments: reviewDepartments,
                        improvementMeasures: reviewMeasures,
                      },
                      currentUser.id,
                      currentUser.name
                    );
                    setShowReviewForm(false);
                  }
                }}
                disabled={!reviewSummary.trim()}
                className="flex-1 px-4 py-2.5 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存复盘
              </button>
            </div>
          </div>
        </div>
      )}

      <EventForm isOpen={showEventForm} onClose={() => setShowEventForm(false)} />
    </div>
  );
}
