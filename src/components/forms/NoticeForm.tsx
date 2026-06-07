import { useState } from "react";
import { X, Send, Megaphone } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import type { UserRole } from "@/types";

interface NoticeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const noticeTypeOptions: { value: "normal" | "urgent" | "emergency"; label: string }[] = [
  { value: "normal", label: "普通通知" },
  { value: "urgent", label: "紧急通知" },
  { value: "emergency", label: "应急广播" },
];

const targetRoleOptions: { value: UserRole | "all"; label: string }[] = [
  { value: "all", label: "所有人" },
  { value: "security", label: "安保部" },
  { value: "engineering", label: "工程部" },
  { value: "supervisor", label: "监管人员" },
  { value: "admin", label: "管理员" },
];

export default function NoticeForm({ isOpen, onClose }: NoticeFormProps) {
  const { currentUser, addNotice } = useAppStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "normal" as "normal" | "urgent" | "emergency",
    targetRoles: [] as UserRole[],
  });

  const handleRoleToggle = (role: UserRole | "all") => {
    if (role === "all") {
      setFormData((prev) => ({
        ...prev,
        targetRoles: prev.targetRoles.length === 0 ? ["security", "engineering", "supervisor", "admin"] as UserRole[] : [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        targetRoles: prev.targetRoles.includes(role)
          ? prev.targetRoles.filter((r) => r !== role)
          : [...prev.targetRoles, role],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setIsSubmitting(true);

    addNotice({
      title: formData.title,
      content: formData.content,
      type: formData.type,
      publisher: currentUser.name,
      targetRoles: formData.targetRoles.length > 0 ? formData.targetRoles : ["security", "engineering", "supervisor", "admin"] as UserRole[],
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      setFormData({
        title: "",
        content: "",
        type: "normal",
        targetRoles: [],
      });
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">发布通知</h3>
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
                通知标题 <span className="text-danger-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请输入通知标题"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                通知类型
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as "normal" | "urgent" | "emergency" })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                {noticeTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                通知内容 <span className="text-danger-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请输入通知详细内容..."
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                接收对象
              </label>
              <div className="flex flex-wrap gap-2">
                {targetRoleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleRoleToggle(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      (opt.value === "all" && formData.targetRoles.length === 0) ||
                      (opt.value !== "all" && formData.targetRoles.includes(opt.value))
                        ? "bg-primary-100 text-primary-700 border border-primary-300"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
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
              className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "发布中..." : "立即发布"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
