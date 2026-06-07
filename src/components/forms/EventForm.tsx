import { useState } from "react";
import { X, Upload, Image as ImageIcon, Send } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn, getEventTypeText, getEventLevelText } from "@/utils";
import type { EventType, EventLevel } from "@/types";

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "lost-item", label: "失物招领" },
  { value: "missing-person", label: "走失人员" },
  { value: "congestion", label: "客流拥堵" },
  { value: "equipment-fault", label: "设备故障" },
  { value: "fire-hazard", label: "消防隐患" },
  { value: "other", label: "其他事件" },
];

const eventLevelOptions: { value: EventLevel; label: string }[] = [
  { value: "low", label: "一般" },
  { value: "medium", label: "重要" },
  { value: "high", label: "紧急" },
  { value: "critical", label: "特急" },
];

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const { users, currentUser, addEvent } = useAppStore();
  const [formData, setFormData] = useState({
    title: "",
    type: "equipment-fault" as EventType,
    level: "medium" as EventLevel,
    location: "",
    handlerId: "",
    description: "",
    images: [] as string[],
  });
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) return;

    setIsSubmitting(true);

    const handler = users.find((u) => u.id === formData.handlerId);

    addEvent({
      title: formData.title,
      type: formData.type,
      level: formData.level,
      location: formData.location,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      handlerId: formData.handlerId || "",
      handlerName: handler?.name || "",
      status: formData.handlerId ? "processing" : "pending",
      description: formData.description,
      images: formData.images,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setFormData({
        title: "",
        type: "equipment-fault",
        level: "medium",
        location: "",
        handlerId: "",
        description: "",
        images: [],
      });
    }, 500);
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData({ ...formData, images: [...formData.images, imageUrl.trim()] });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">上报安全事件</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                事件标题 <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请输入事件标题"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  事件类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as EventType })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {eventTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  事件等级
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value as EventLevel })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                >
                  {eventLevelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                发生位置 <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="如：一层中庭A区、三层美食区入口"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                处理人（可选，不选则进入待处理池）
              </label>
              <select
                value={formData.handlerId}
                onChange={(e) => setFormData({ ...formData, handlerId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">暂不指定，进入待处理池</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                事件描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请详细描述事件情况，包括发现时间、现场状况、已采取的措施等"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                现场图片
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="输入图片URL链接"
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  添加
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`现场图片${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
              disabled={isSubmitting || !formData.title || !formData.location}
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "提交中..." : "提交上报"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
