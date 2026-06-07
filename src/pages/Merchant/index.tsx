import { useState } from "react";
import {
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  MapPin,
  Phone,
  FileText,
  ArrowRight,
  X,
  User,
  Image,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import RectificationForm from "@/components/forms/RectificationForm";
import {
  cn,
  formatDateTime,
  getRectificationStatusColor,
  getRectificationStatusText,
} from "@/utils";
import type { RectificationStatus } from "@/types";

export default function Merchant() {
  const {
    merchants,
    rectifications,
    rectificationLogs,
    currentUser,
    updateRectificationStatus,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<"merchants" | "rectifications">("merchants");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRectificationForm, setShowRectificationForm] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [reviewRemark, setReviewRemark] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  const floors = ["all", "1层", "2层", "3层", "4层", "5层", "B1"];

  const filteredMerchants = merchants.filter((m) => {
    const matchesFloor = selectedFloor === "all" || m.floor === selectedFloor;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFloor && matchesSearch;
  });

  const stats = {
    total: merchants.length,
    normal: merchants.filter((m) => m.status === "normal").length,
    rectification: merchants.filter((m) => m.status === "rectification").length,
    closed: merchants.filter((m) => m.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">商户整改</h1>
          <p className="text-slate-500 mt-1">商户安全检查和整改管理</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <FileText className="w-4 h-4" />
            检查记录
          </button>
          <button
            onClick={() => setShowRectificationForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            新建整改
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">商户总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success-50 text-success-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.normal}</p>
              <p className="text-sm text-slate-500">正常商户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning-50 text-warning-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.rectification}</p>
              <p className="text-sm text-slate-500">整改中商户</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-danger-50 text-danger-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {rectifications.filter((r) => r.status === "rectifying").length}
              </p>
              <p className="text-sm text-slate-500">待完成整改</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("merchants")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "merchants"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          商户列表
        </button>
        <button
          onClick={() => setActiveTab("rectifications")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "rectifications"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          整改通知
          <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-warning-100 text-warning-600">
            {rectifications.filter((r) => r.status !== "passed").length}
          </span>
        </button>
      </div>

      {activeTab === "merchants" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              {floors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-lg transition-colors",
                    selectedFloor === floor
                      ? "bg-primary-600 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {floor === "all" ? "全部楼层" : floor}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索商户..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
                    <Store className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      merchant.status === "normal"
                        ? "bg-success-100 text-success-700"
                        : merchant.status === "rectification"
                        ? "bg-warning-100 text-warning-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {merchant.status === "normal"
                      ? "正常"
                      : merchant.status === "rectification"
                      ? "整改中"
                      : "停业"}
                  </span>
                </div>
                <h4 className="font-medium text-slate-800 mb-1">{merchant.name}</h4>
                <p className="text-sm text-slate-500 mb-3">{merchant.category}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {merchant.floor} {merchant.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-4 h-4" />
                    <span>{merchant.contact}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 bg-slate-50">
                  <th className="px-4 py-3 font-medium">商户名称</th>
                  <th className="px-4 py-3 font-medium">整改问题</th>
                  <th className="px-4 py-3 font-medium">下发时间</th>
                  <th className="px-4 py-3 font-medium">截止时间</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">复查人</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {rectifications.map((rect) => (
                  <tr
                    key={rect.id}
                    className="border-t border-slate-50 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setShowDetail(rect.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">
                        {rect.merchantName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 line-clamp-2">
                        {rect.issue}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 font-mono">
                        {formatDateTime(rect.issueTime)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 font-mono">
                        {formatDateTime(rect.deadline)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getRectificationStatusColor(rect.status)
                        )}
                      >
                        {getRectificationStatusText(rect.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {rect.reviewerName || (rect.status === "passed" ? "-" : "待复查")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {rect.status === "issued" && (
                          <button
                            onClick={() =>
                              updateRectificationStatus(
                                rect.id,
                                "rectifying",
                                currentUser.id,
                                currentUser.name
                              )
                            }
                            className="text-xs px-3 py-1.5 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors flex items-center gap-1"
                          >
                            <Clock className="w-3 h-3" />
                            开始整改
                          </button>
                        )}
                        {rect.status === "rectifying" && (
                          <button
                            onClick={() =>
                              updateRectificationStatus(
                                rect.id,
                                "reviewing",
                                currentUser.id,
                                currentUser.name
                              )
                            }
                            className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            申请复查
                          </button>
                        )}
                        {rect.status === "reviewing" && (
                          <button
                            onClick={() =>
                              updateRectificationStatus(
                                rect.id,
                                "passed",
                                currentUser.id,
                                currentUser.name
                              )
                            }
                            className="text-xs px-3 py-1.5 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            整改通过
                          </button>
                        )}
                          {(rect.status === "passed" || rect.status === "failed") && (
                          <span className="text-xs text-slate-400">已完成</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RectificationForm
        isOpen={showRectificationForm}
        onClose={() => setShowRectificationForm(false)}
      />

      {showDetail && (() => {
        const rectification = rectifications.find((r) => r.id === showDetail);
        if (!rectification) return null;

        const logs = rectificationLogs
          .filter((l) => l.rectificationId === showDetail)
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  整改详情
                </h3>
                <button
                  onClick={() => setShowDetail(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">
                      {rectification.merchantName}
                    </h4>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        getRectificationStatusColor(rectification.status)
                      )}
                    >
                      {getRectificationStatusText(rectification.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">整改问题</p>
                    <p className="text-sm text-slate-700">
                      {rectification.issue}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">下发时间</p>
                      <p className="text-sm text-slate-700 font-mono">
                        {formatDateTime(rectification.issueTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">截止时间</p>
                      <p className="text-sm text-slate-700 font-mono">
                        {formatDateTime(rectification.deadline)}
                      </p>
                    </div>
                  </div>
                  {rectification.reviewerName && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">复查人</p>
                      <p className="text-sm text-slate-700">
                        {rectification.reviewerName}
                      </p>
                    </div>
                  )}
                  {rectification.reviewResult && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">复查结论</p>
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          rectification.reviewResult === "passed"
                            ? "bg-success-100 text-success-700"
                            : "bg-danger-100 text-danger-700"
                        )}
                      >
                        {rectification.reviewResult === "passed" ? "整改通过" : "整改不通过"}
                      </span>
                    </div>
                  )}
                  {rectification.reviewRemark && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">复查说明</p>
                      <p className="text-sm text-slate-700">
                        {rectification.reviewRemark}
                      </p>
                    </div>
                  )}
                  {rectification.reviewTime && rectification.reviewResult && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">复查时间</p>
                      <p className="text-sm text-slate-700 font-mono">
                        {formatDateTime(rectification.reviewTime)}
                      </p>
                    </div>
                  )}
                  {rectification.reviewImages && rectification.reviewImages.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">复查图片</p>
                      <div className="flex gap-2 flex-wrap">
                        {rectification.reviewImages.map((img, i) => (
                          <div
                            key={i}
                            className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center"
                          >
                            <Image className="w-6 h-6 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {rectification.images.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">现场图片</p>
                      <div className="flex gap-2 flex-wrap">
                        {rectification.images.map((img, i) => (
                          <div
                            key={i}
                            className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center"
                          >
                            <Image className="w-6 h-6 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {rectification.status === "reviewing" && (
                  <div className="bg-primary-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">复查验收</h4>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        复查说明
                      </label>
                      <textarea
                        value={reviewRemark}
                        onChange={(e) => setReviewRemark(e.target.value)}
                        placeholder="请填写复查验收说明..."
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none bg-white"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          updateRectificationStatus(
                            rectification.id,
                            "passed",
                            currentUser.id,
                            currentUser.name,
                            {
                              result: "passed",
                              remark: reviewRemark,
                              images: reviewImages,
                            }
                          );
                          setReviewRemark("");
                          setReviewImages([]);
                          setShowDetail(null);
                        }}
                        className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        整改通过
                      </button>
                      <button
                        onClick={() => {
                          updateRectificationStatus(
                            rectification.id,
                            "failed",
                            currentUser.id,
                            currentUser.name,
                            {
                              result: "failed",
                              remark: reviewRemark,
                              images: reviewImages,
                            }
                          );
                          setReviewRemark("");
                          setReviewImages([]);
                        }}
                        className="flex-1 px-4 py-2.5 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        整改不通过
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    操作记录
                  </h4>
                  <div className="space-y-3">
                    {logs.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">
                        暂无操作记录
                      </p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1 bg-slate-50 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-800">
                                {log.userName || "系统"}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">
                                {formatDateTime(log.time)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1">
                              {log.action}
                            </p>
                            {log.remark && (
                              <p className="text-xs text-slate-500 mt-1">
                                {log.remark}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {rectification.status === "issued" && (
                    <button
                      onClick={() => {
                        updateRectificationStatus(
                          rectification.id,
                          "rectifying",
                          currentUser.id,
                          currentUser.name
                        );
                      }}
                      className="flex-1 px-4 py-2.5 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      开始整改
                    </button>
                  )}
                  {rectification.status === "rectifying" && (
                    <button
                      onClick={() => {
                        updateRectificationStatus(
                          rectification.id,
                          "reviewing",
                          currentUser.id,
                          currentUser.name
                        );
                      }}
                      className="flex-1 px-4 py-2.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      申请复查
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
        );
      })()}
    </div>
  );
}
