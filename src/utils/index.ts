import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date) {
  if (!date) return "-";
  return format(new Date(date), "yyyy-MM-dd HH:mm", { locale: zhCN });
}

export function formatDate(date: string | Date) {
  if (!date) return "-";
  return format(new Date(date), "yyyy-MM-dd", { locale: zhCN });
}

export function formatTime(date: string | Date) {
  if (!date) return "-";
  return format(new Date(date), "HH:mm", { locale: zhCN });
}

export function getEventLevelColor(level: string) {
  const colors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700 border-slate-200",
    medium: "bg-warning-100 text-warning-700 border-warning-200",
    high: "bg-orange-100 text-orange-700 border-orange-200",
    critical: "bg-danger-100 text-danger-700 border-danger-200",
  };
  return colors[level] || colors.low;
}

export function getEventLevelText(level: string) {
  const texts: Record<string, string> = {
    low: "一般",
    medium: "重要",
    high: "紧急",
    critical: "特急",
  };
  return texts[level] || "一般";
}

export function getEventTypeText(type: string) {
  const texts: Record<string, string> = {
    "lost-item": "失物招领",
    "missing-person": "走失人员",
    congestion: "客流拥堵",
    "equipment-fault": "设备故障",
    "fire-hazard": "消防隐患",
    other: "其他事件",
  };
  return texts[type] || "其他事件";
}

export function getEventStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: "bg-warning-100 text-warning-700",
    processing: "bg-primary-100 text-primary-700",
    resolved: "bg-success-100 text-success-700",
    closed: "bg-slate-100 text-slate-600",
  };
  return colors[status] || colors.pending;
}

export function getEventStatusText(status: string) {
  const texts: Record<string, string> = {
    pending: "待处理",
    processing: "处理中",
    resolved: "已解决",
    closed: "已结案",
  };
  return texts[status] || "待处理";
}

export function getFacilityStatusColor(status: string) {
  const colors: Record<string, string> = {
    normal: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
    fault: "bg-danger-100 text-danger-700",
    maintenance: "bg-slate-100 text-slate-700",
  };
  return colors[status] || colors.normal;
}

export function getFacilityStatusText(status: string) {
  const texts: Record<string, string> = {
    normal: "正常",
    warning: "异常",
    fault: "故障",
    maintenance: "维修中",
  };
  return texts[status] || "正常";
}

export function getFacilityTypeText(type: string) {
  const texts: Record<string, string> = {
    escalator: "扶梯",
    "glass-railing": "玻璃护栏",
    "fire-equipment": "消防设备",
    elevator: "电梯",
    ac: "空调系统",
    other: "其他设备",
  };
  return texts[type] || "其他设备";
}

export function getRepairStatusColor(status: string) {
  const colors: Record<string, string> = {
    submitted: "bg-warning-100 text-warning-700",
    assigned: "bg-primary-100 text-primary-700",
    repairing: "bg-orange-100 text-orange-700",
    completed: "bg-success-100 text-success-700",
    verified: "bg-slate-100 text-slate-600",
  };
  return colors[status] || colors.submitted;
}

export function getRepairStatusText(status: string) {
  const texts: Record<string, string> = {
    submitted: "已提交",
    assigned: "已派单",
    repairing: "维修中",
    completed: "待验收",
    verified: "已验收",
  };
  return texts[status] || "已提交";
}

export function getRectificationStatusColor(status: string) {
  const colors: Record<string, string> = {
    issued: "bg-warning-100 text-warning-700",
    rectifying: "bg-primary-100 text-primary-700",
    reviewing: "bg-orange-100 text-orange-700",
    passed: "bg-success-100 text-success-700",
    failed: "bg-danger-100 text-danger-700",
  };
  return colors[status] || colors.issued;
}

export function getRectificationStatusText(status: string) {
  const texts: Record<string, string> = {
    issued: "已下发",
    rectifying: "整改中",
    reviewing: "待复查",
    passed: "整改通过",
    failed: "整改未过",
  };
  return texts[status] || "已下发";
}

export function getPatrolStatusColor(status: string) {
  const colors: Record<string, string> = {
    normal: "bg-success-100 text-success-700",
    missed: "bg-danger-100 text-danger-700",
    late: "bg-warning-100 text-warning-700",
    early: "bg-slate-100 text-slate-700",
  };
  return colors[status] || colors.normal;
}

export function getPatrolStatusText(status: string) {
  const texts: Record<string, string> = {
    normal: "正常",
    missed: "漏检",
    late: "超时",
    early: "早到",
  };
  return texts[status] || "正常";
}

export function getDrillTypeText(type: string) {
  const texts: Record<string, string> = {
    fire: "消防演练",
    evacuation: "疏散演练",
    earthquake: "地震演练",
    "first-aid": "急救演练",
    terrorism: "防恐演练",
  };
  return texts[type] || "其他演练";
}

export function getDrillStatusColor(status: string) {
  const colors: Record<string, string> = {
    planned: "bg-primary-100 text-primary-700",
    "in-progress": "bg-warning-100 text-warning-700",
    completed: "bg-success-100 text-success-700",
    cancelled: "bg-slate-100 text-slate-600",
  };
  return colors[status] || colors.planned;
}

export function getDrillStatusText(status: string) {
  const texts: Record<string, string> = {
    planned: "计划中",
    "in-progress": "进行中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return texts[status] || "计划中";
}

export function getUserStatusColor(status: string) {
  const colors: Record<string, string> = {
    "on-duty": "bg-success-500",
    "off-duty": "bg-slate-400",
    away: "bg-warning-500",
  };
  return colors[status] || colors["off-duty"];
}

export function getUserStatusText(status: string) {
  const texts: Record<string, string> = {
    "on-duty": "在岗",
    "off-duty": "离岗",
    away: "外出",
  };
  return texts[status] || "离岗";
}

export function getCrowdTrendIcon(trend: string) {
  const icons: Record<string, string> = {
    up: "↑",
    down: "↓",
    stable: "→",
  };
  return icons[trend] || "→";
}

export function getCrowdTrendColor(trend: string) {
  const colors: Record<string, string> = {
    up: "text-danger-600",
    down: "text-success-600",
    stable: "text-slate-600",
  };
  return colors[trend] || colors.stable;
}

export function calculateCrowdLevel(current: number, capacity: number) {
  const ratio = current / capacity;
  if (ratio >= 0.9) return { level: "严重拥堵", color: "bg-danger-500", textColor: "text-danger-700" };
  if (ratio >= 0.7) return { level: "较拥挤", color: "bg-warning-500", textColor: "text-warning-700" };
  if (ratio >= 0.5) return { level: "适中", color: "bg-primary-500", textColor: "text-primary-700" };
  return { level: "舒适", color: "bg-success-500", textColor: "text-success-700" };
}
