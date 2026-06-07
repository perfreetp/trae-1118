import { useState } from "react";
import {
  Building2,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  ArrowRight,
  X,
  User,
  MessageSquare,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import RepairForm from "@/components/forms/RepairForm";
import {
  cn,
  formatDate,
  formatDateTime,
  getFacilityStatusColor,
  getFacilityStatusText,
  getFacilityTypeText,
  getRepairStatusColor,
  getRepairStatusText,
} from "@/utils";
import type { FacilityType, FacilityStatus, RepairStatus } from "@/types";

export default function Facility() {
  const {
    facilities,
    repairs,
    repairLogs,
    currentUser,
    updateRepairStatus,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<"facilities" | "repairs">("facilities");
  const [selectedType, setSelectedType] = useState<FacilityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRepairForm, setShowRepairForm] = useState(false);
  const [showFacilityForm, setShowFacilityForm] = useState(false);
  const [formMode, setFormMode] = useState<"repair" | "facility">("repair");
  const [showRepairDetail, setShowRepairDetail] = useState<string | null>(null);
  const [repairResult, setRepairResult] = useState("");
  const [facilityStatusAfter, setFacilityStatusAfter] = useState<"normal" | "fault">("normal");
  const [verifyRemark, setVerifyRemark] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const typeOptions: { value: FacilityType | "all"; label: string }[] = [
    { value: "all", label: "全部" },
    { value: "escalator", label: "扶梯" },
    { value: "glass-railing", label: "玻璃护栏" },
    { value: "fire-equipment", label: "消防设备" },
    { value: "elevator", label: "电梯" },
    { value: "ac", label: "空调系统" },
    { value: "other", label: "其他" },
  ];

  const filteredFacilities = facilities.filter((f) => {
    const matchesType = selectedType === "all" || f.type === selectedType;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const stats = {
    total: facilities.length,
    normal: facilities.filter((f) => f.status === "normal").length,
    warning: facilities.filter((f) => f.status === "warning").length,
    fault: facilities.filter((f) => f.status === "fault").length,
    maintenance: facilities.filter((f) => f.status === "maintenance").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">设施检查</h1>
          <p className="text-slate-500 mt-1">设备巡检和维修管理</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setFormMode("facility");
              setShowFacilityForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            新增设施
          </button>
          <button
            onClick={() => {
              setFormMode("repair");
              setShowRepairForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            报修登记
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">设施总数</p>
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
              <p className="text-sm text-slate-500">正常运行</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning-50 text-warning-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.warning}</p>
              <p className="text-sm text-slate-500">异常预警</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-danger-50 text-danger-600">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.fault}</p>
              <p className="text-sm text-slate-500">故障设备</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.maintenance}</p>
              <p className="text-sm text-slate-500">维修中</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("facilities")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "facilities"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          设施列表
        </button>
        <button
          onClick={() => setActiveTab("repairs")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "repairs"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          维修工单
          <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-danger-100 text-danger-600">
            {repairs.filter((r) => r.status !== "verified").length}
          </span>
        </button>
      </div>

      {activeTab === "facilities" ? (
        <>
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
                placeholder="搜索设施..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 h-9 pl-10 pr-4 rounded-lg bg-slate-100 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      getFacilityStatusColor(facility.status)
                    )}
                  >
                    {getFacilityStatusText(facility.status)}
                  </span>
                </div>
                <h4 className="font-medium text-slate-800 mb-1">{facility.name}</h4>
                <p className="text-sm text-slate-500 mb-3">
                  {getFacilityTypeText(facility.type)}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-4 h-4" />
                    <span>{facility.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>上次检查：{formatDate(facility.lastInspectionDate)}</span>
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
                  <th className="px-4 py-3 font-medium">设施名称</th>
                  <th className="px-4 py-3 font-medium">报修人</th>
                  <th className="px-4 py-3 font-medium">处理人</th>
                  <th className="px-4 py-3 font-medium">问题描述</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">报修时间</th>
                  <th className="px-4 py-3 font-medium">优先级</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair) => (
                  <tr
                    key={repair.id}
                    className="border-t border-slate-50 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setShowRepairDetail(repair.id)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">
                        {repair.facilityName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{repair.reporterName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{repair.handlerName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 line-clamp-1">
                        {repair.description}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getRepairStatusColor(repair.status)
                        )}
                      >
                        {getRepairStatusText(repair.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 font-mono">
                        {formatDateTime(repair.createTime)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          repair.priority === "high"
                            ? "bg-danger-100 text-danger-700"
                            : repair.priority === "medium"
                            ? "bg-warning-100 text-warning-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {repair.priority === "high"
                          ? "高"
                          : repair.priority === "medium"
                          ? "中"
                          : "低"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {repair.status === "submitted" && (
                          <button
                            onClick={() =>
                              updateRepairStatus(
                                repair.id,
                                "repairing",
                                currentUser.id,
                                currentUser.name
                              )
                            }
                            className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center gap-1"
                          >
                            <Wrench className="w-3 h-3" />
                            开始维修
                          </button>
                        )}
                        {repair.status === "assigned" && (
                          <button
                            onClick={() =>
                              updateRepairStatus(
                                repair.id,
                                "repairing",
                                currentUser.id,
                                currentUser.name
                              )
                            }
                            className="text-xs px-3 py-1.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors flex items-center gap-1"
                          >
                            <Wrench className="w-3 h-3" />
                            开始维修
                          </button>
                        )}
                        {repair.status === "repairing" && (
                          <button
                            onClick={() => {
                              setRepairResult("");
                              setFacilityStatusAfter("normal");
                              setShowRepairDetail(repair.id);
                            }}
                            className="text-xs px-3 py-1.5 bg-success-100 text-success-700 rounded-lg hover:bg-success-200 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            完成维修
                          </button>
                        )}
                        {repair.status === "completed" && (
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

      <RepairForm
        isOpen={showRepairForm || showFacilityForm}
        onClose={() => {
          setShowRepairForm(false);
          setShowFacilityForm(false);
        }}
        mode={formMode}
      />

      {showRepairDetail && (() => {
        const repair = repairs.find((r) => r.id === showRepairDetail);
        if (!repair) return null;

        const logs = repairLogs
          .filter((l) => l.repairId === showRepairDetail)
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        const facility = facilities.find((f) => f.id === repair.facilityId);

        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  维修工单详情
                </h3>
                <button
                  onClick={() => setShowRepairDetail(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1 space-y-6">
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">
                      {repair.facilityName}
                    </h4>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        getRepairStatusColor(repair.status)
                      )}
                    >
                      {getRepairStatusText(repair.status)}
                    </span>
</div>
                </div>

                {repair.status === "completed" && (
                  <div className="bg-success-50 border border-success-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-slate-800">验收工单</h4>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        验收说明
                      </label>
                      <textarea
                        value={verifyRemark}
                        onChange={(e) => setVerifyRemark(e.target.value)}
                        placeholder="请填写验收说明..."
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-success-500 resize-none bg-white"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-2 block">
                        设施最终状态
                      </label>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="facilityStatusVerify"
                            value="normal"
                            checked={facilityStatusAfter === "normal"}
                            onChange={() => setFacilityStatusAfter("normal")}
                            className="text-success-600"
                          />
                          <span className="text-sm text-slate-700">
                            恢复正常
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="facilityStatusVerify"
                            value="fault"
                            checked={facilityStatusAfter === "fault"}
                            onChange={() => setFacilityStatusAfter("fault")}
                            className="text-danger-600"
                          />
                          <span className="text-sm text-slate-700">
                            保留异常
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          updateRepairStatus(
                            repair.id,
                            "verified",
                            currentUser.id,
                            currentUser.name,
                            repairResult,
                            facilityStatusAfter,
                            { remark: verifyRemark }
                          );
                          setShowRepairDetail(null);
                        }}
                        className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        验收通过
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("请输入退回原因：");
                          if (reason) {
                            updateRepairStatus(
                              repair.id,
                              "repairing",
                              currentUser.id,
                              currentUser.name,
                              undefined,
                              undefined,
                              { rejectReason: reason }
                            );
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        退回维修
                      </button>
                    </div>
                  </div>
                )}

                {repair.verifiedByName && (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-slate-800">验收信息</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">验收人</p>
                        <p className="text-slate-700">{repair.verifiedByName}</p>
                      </div>
                      {repair.verifyTime && (
                        <div>
                          <p className="text-xs text-slate-500">验收时间</p>
                          <p className="text-slate-700 font-mono">
                            {formatDateTime(repair.verifyTime)}
                          </p>
                        </div>
                      )}
                    </div>
                    {repair.verifyRemark && (
                      <div>
                        <p className="text-xs text-slate-500">验收说明</p>
                        <p className="text-sm text-slate-700">
                          {repair.verifyRemark}
                        </p>
                      </div>
                    )}
                    {repair.rejectReason && (
                      <div>
                        <p className="text-xs text-slate-500">退回原因</p>
                        <p className="text-sm text-danger-600">
                          {repair.rejectReason}
                        </p>
                      </div>
                    )}
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
                  {repair.status === "repairing" && (
                    <button
                      onClick={() => {
                        updateRepairStatus(
                          repair.id,
                          "completed",
                          currentUser.id,
                          currentUser.name,
                          repairResult,
                          facilityStatusAfter
                        );
                        setShowRepairDetail(null);
                      }}
                      className="flex-1 px-4 py-2.5 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      确认完成
                    </button>
                  )}
                  {repair.status === "submitted" && (
                    <button
                      onClick={() => {
                        updateRepairStatus(
                          repair.id,
                          "repairing",
                          currentUser.id,
                          currentUser.name
                        );
                      }}
                      className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-4 h-4" />
                      开始维修
                    </button>
                  )}
                  <button
                    onClick={() => setShowRepairDetail(null)}
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
