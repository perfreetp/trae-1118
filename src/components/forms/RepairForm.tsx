import { useState } from "react";
import { X, Send, Wrench, Plus } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { getFacilityTypeText } from "@/utils";
import type { FacilityType, FacilityStatus } from "@/types";

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "repair" | "facility";
}

const facilityTypeOptions: { value: FacilityType; label: string }[] = [
  { value: "escalator", label: "扶梯" },
  { value: "glass-railing", label: "玻璃护栏" },
  { value: "fire-equipment", label: "消防设备" },
  { value: "elevator", label: "电梯" },
  { value: "ac", label: "空调系统" },
  { value: "other", label: "其他设备" },
];

const floorOptions = ["B1", "1层", "2层", "3层", "4层", "5层"];

const priorityOptions = [
  { value: "low", label: "低" },
  { value: "medium", label: "中" },
  { value: "high", label: "高" },
];

export default function RepairForm({ isOpen, onClose, mode = "repair" }: RepairFormProps) {
  const { facilities, users, currentUser, addRepair, addFacility, updateFacilityStatus } =
    useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [repairData, setRepairData] = useState({
    facilityId: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    handlerId: "",
  });

  const [facilityData, setFacilityData] = useState({
    name: "",
    type: "escalator" as FacilityType,
    location: "",
    floor: "1层",
    status: "normal" as FacilityStatus,
    lastInspectionDate: "",
    nextInspectionDate: "",
  });

  const handleSubmitRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairData.facilityId || !repairData.description) return;

    setIsSubmitting(true);

    const facility = facilities.find((f) => f.id === repairData.facilityId);
    const handler = users.find((u) => u.id === repairData.handlerId);

    addRepair({
      facilityId: repairData.facilityId,
      facilityName: facility?.name || "",
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      handlerId: repairData.handlerId,
      handlerName: handler?.name || "",
      status: repairData.handlerId ? "assigned" : "submitted",
      createTime: new Date().toISOString(),
      finishTime: "",
      description: repairData.description,
      solution: "",
      priority: repairData.priority,
    });

    if (facility) {
      updateFacilityStatus(facility.id, "maintenance");
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setRepairData({
        facilityId: "",
        description: "",
        priority: "medium",
        handlerId: "",
      });
    }, 500);
  };

  const handleSubmitFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityData.name || !facilityData.location) return;

    setIsSubmitting(true);

    addFacility({
      ...facilityData,
      lastInspectionDate: facilityData.lastInspectionDate || new Date().toISOString().split("T")[0],
      nextInspectionDate: facilityData.nextInspectionDate || "",
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setFacilityData({
        name: "",
        type: "escalator",
        location: "",
        floor: "1层",
        status: "normal",
        lastInspectionDate: "",
        nextInspectionDate: "",
      });
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">
            {mode === "repair" ? "报修登记" : "新增设施"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form
          onSubmit={mode === "repair" ? handleSubmitRepair : handleSubmitFacility}
          className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]"
        >
          {mode === "repair" ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  故障设施 <span className="text-danger-500">*</span>
                </label>
                <select
                  value={repairData.facilityId}
                  onChange={(e) => setRepairData({ ...repairData, facilityId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">请选择故障设施</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} - {getFacilityTypeText(f.type)} ({f.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  问题描述 <span className="text-danger-500">*</span>
                </label>
                <textarea
                  value={repairData.description}
                  onChange={(e) => setRepairData({ ...repairData, description: e.target.value })}
                  placeholder="请详细描述故障情况"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    优先级
                  </label>
                  <select
                    value={repairData.priority}
                    onChange={(e) =>
                      setRepairData({
                        ...repairData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {priorityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    处理人（可选）
                  </label>
                  <select
                    value={repairData.handlerId}
                    onChange={(e) =>
                      setRepairData({ ...repairData, handlerId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="">暂不指定</option>
                    {users
                      .filter((u) => u.role === "engineering")
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  设施名称 <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={facilityData.name}
                  onChange={(e) => setFacilityData({ ...facilityData, name: e.target.value })}
                  placeholder="如：1号扶梯、东侧玻璃护栏A段"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    设施类型
                  </label>
                  <select
                    value={facilityData.type}
                    onChange={(e) =>
                      setFacilityData({
                        ...facilityData,
                        type: e.target.value as FacilityType,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {facilityTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    所在楼层
                  </label>
                  <select
                    value={facilityData.floor}
                    onChange={(e) =>
                      setFacilityData({ ...facilityData, floor: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {floorOptions.map((floor) => (
                      <option key={floor} value={floor}>
                        {floor}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  具体位置 <span className="text-danger-500">*</span>
                </label>
                <input
                  type="text"
                  value={facilityData.location}
                  onChange={(e) =>
                    setFacilityData({ ...facilityData, location: e.target.value })
                  }
                  placeholder="如：一层中庭北侧、三层东侧回廊"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    上次检查日期
                  </label>
                  <input
                    type="date"
                    value={facilityData.lastInspectionDate}
                    onChange={(e) =>
                      setFacilityData({
                        ...facilityData,
                        lastInspectionDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    下次检查日期
                  </label>
                  <input
                    type="date"
                    value={facilityData.nextInspectionDate}
                    onChange={(e) =>
                      setFacilityData({
                        ...facilityData,
                        nextInspectionDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mode === "repair" ? <Wrench className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isSubmitting ? "提交中..." : mode === "repair" ? "提交报修" : "添加设施"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
