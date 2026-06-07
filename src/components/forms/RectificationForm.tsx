import { useState } from "react";
import { X, FileText, Plus, Image } from "lucide-react";
import { useAppStore } from "@/store/appStore";

interface RectificationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const rectificationTypeOptions: { value: string; label: string }[] = [
  { value: "fire-blockage", label: "消防通道占用" },
  { value: "safety-hazard", label: "安全隐患" },
  { value: "equipment-failure", label: "设备故障" },
  { value: "sanitation", label: "卫生问题" },
  { value: "other", label: "其他问题" },
];

export default function RectificationForm({ isOpen, onClose }: RectificationFormProps) {
  const { merchants, users, currentUser, addRectification } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    merchantId: "",
    type: "fire-blockage",
    description: "",
    deadline: "",
    imageUrls: [] as string[],
    handlerId: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.imageUrls.includes(imageUrl.trim())) {
      setFormData({ ...formData, imageUrls: [...formData.imageUrls, imageUrl.trim()] });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (url: string) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((u) => u !== url),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchantId || !formData.description || !formData.deadline) return;

    setIsSubmitting(true);

    const merchant = merchants.find((m) => m.id === formData.merchantId);
    const handler = users.find((u) => u.id === formData.handlerId);

    addRectification({
      merchantId: formData.merchantId,
      merchantName: merchant?.name || "",
      inspectionId: "",
      issue: formData.description,
      issueTime: new Date().toISOString(),
      deadline: formData.deadline,
      status: "issued",
      rectificationDescription: "",
      reviewTime: "",
      reviewerId: "",
      reviewerName: "",
      images: formData.imageUrls,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setFormData({
        merchantId: "",
        type: "fire-blockage",
        description: "",
        deadline: "",
        imageUrls: [],
        handlerId: "",
      });
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">新建整改通知</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                选择商户 <span className="text-danger-500">*</span>
              </label>
              <select
                value={formData.merchantId}
                onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              >
                <option value="">请选择商户</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.floor} - {m.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                问题类型
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {rectificationTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                问题描述 <span className="text-danger-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请详细描述问题情况，如：消防通道被货物占用约2米宽..."
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                整改期限 <span className="text-danger-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                处理人（可选）
              </label>
              <select
                value={formData.handlerId}
                onChange={(e) => setFormData({ ...formData, handlerId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">暂不指定</option>
                {users
                  .filter((u) => u.role === "supervisor" || u.role === "security")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                现场图片链接
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="输入图片URL地址"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>
              {formData.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg"
                    >
                      <Image className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-600 max-w-[150px] truncate">
                        {url}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url)}
                        className="text-slate-400 hover:text-danger-500"
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {isSubmitting ? "提交中..." : "下发整改通知"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
