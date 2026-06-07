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
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
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
import type { FacilityType, FacilityStatus } from "@/types";

export default function Facility() {
  const { facilities, repairs } = useAppStore();
  const [activeTab, setActiveTab] = useState<"facilities" | "repairs">("facilities");
  const [selectedType, setSelectedType] = useState<FacilityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Building2 className="w-4 h-4" />
            新增设施
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
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
                </tr>
              </thead>
              <tbody>
                {repairs.map((repair) => (
                  <tr key={repair.id} className="border-t border-slate-50 hover:bg-slate-50">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
