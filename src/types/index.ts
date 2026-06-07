export type UserRole = "security" | "engineering" | "supervisor" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  department: string;
  avatar: string;
  status: "on-duty" | "off-duty" | "away";
}

export type ShiftStatus = "active" | "completed" | "upcoming";

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  userId: string;
  userName: string;
  status: ShiftStatus;
}

export interface Handover {
  id: string;
  shiftId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  handoverTime: string;
  content: string;
  signature: string;
}

export type EventType =
  | "lost-item"
  | "missing-person"
  | "congestion"
  | "equipment-fault"
  | "fire-hazard"
  | "other";

export type EventLevel = "low" | "medium" | "high" | "critical";

export type EventStatus = "pending" | "processing" | "resolved" | "closed";

export interface Event {
  id: string;
  title: string;
  type: EventType;
  level: EventLevel;
  location: string;
  reporterId: string;
  reporterName: string;
  handlerId: string;
  handlerName: string;
  status: EventStatus;
  createTime: string;
  updateTime: string;
  description: string;
  images: string[];
}

export interface EventLog {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  action: string;
  time: string;
  remark: string;
}

export interface PatrolRoute {
  id: string;
  name: string;
  description: string;
  points: PatrolPoint[];
  intervalMinutes: number;
}

export interface PatrolPoint {
  id: string;
  name: string;
  location: string;
  nfcCode: string;
  order: number;
  floor: string;
}

export type PatrolStatus = "normal" | "missed" | "late" | "early";

export interface PatrolRecord {
  id: string;
  routeId: string;
  routeName: string;
  pointId: string;
  pointName: string;
  userId: string;
  userName: string;
  checkTime: string;
  status: PatrolStatus;
  remark: string;
}

export type FacilityType = "escalator" | "glass-railing" | "fire-equipment" | "elevator" | "ac" | "other";

export type FacilityStatus = "normal" | "warning" | "fault" | "maintenance";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  location: string;
  floor: string;
  status: FacilityStatus;
  lastInspectionDate: string;
  nextInspectionDate: string;
}

export interface Inspection {
  id: string;
  facilityId: string;
  facilityName: string;
  inspectorId: string;
  inspectorName: string;
  inspectionTime: string;
  result: "pass" | "fail";
  remark: string;
  images: string[];
}

export type RepairStatus = "submitted" | "assigned" | "repairing" | "completed" | "verified";

export interface Repair {
  id: string;
  facilityId: string;
  facilityName: string;
  reporterId: string;
  reporterName: string;
  handlerId: string;
  handlerName: string;
  status: RepairStatus;
  createTime: string;
  startTime?: string;
  finishTime?: string;
  description: string;
  solution: string;
  priority: "low" | "medium" | "high";
}

export interface Merchant {
  id: string;
  name: string;
  floor: string;
  location: string;
  contact: string;
  phone: string;
  status: "normal" | "rectification" | "closed";
  category: string;
}

export interface InspectionRecord {
  id: string;
  merchantId: string;
  merchantName: string;
  inspectorId: string;
  inspectorName: string;
  inspectionTime: string;
  issues: string[];
  overallResult: "pass" | "fail" | "conditional";
}

export type RectificationStatus = "issued" | "rectifying" | "reviewing" | "passed" | "failed";

export interface Rectification {
  id: string;
  merchantId: string;
  merchantName: string;
  inspectionId: string;
  issue: string;
  issueTime: string;
  deadline: string;
  status: RectificationStatus;
  rectificationDescription: string;
  reviewTime: string;
  reviewerId: string;
  reviewerName: string;
  images: string[];
}

export interface RectificationLog {
  id: string;
  rectificationId: string;
  userId: string;
  userName: string;
  action: string;
  time: string;
  remark: string;
}

export interface RepairLog {
  id: string;
  repairId: string;
  userId: string;
  userName: string;
  action: string;
  time: string;
  remark: string;
}

export type DrillType = "fire" | "evacuation" | "earthquake" | "first-aid" | "terrorism";

export type DrillStatus = "planned" | "in-progress" | "completed" | "cancelled";

export interface Drill {
  id: string;
  name: string;
  type: DrillType;
  planTime: string;
  location: string;
  participants: string[];
  plan: string;
  status: DrillStatus;
}

export interface DrillRecord {
  id: string;
  drillId: string;
  drillName: string;
  startTime: string;
  endTime: string;
  actualParticipants: string[];
  processRecord: string;
}

export interface DrillSummary {
  id: string;
  drillId: string;
  drillName: string;
  problems: string;
  improvements: string;
  evaluation: string;
  createTime: string;
  score: number;
}

export interface CrowdData {
  area: string;
  floor: string;
  current: number;
  capacity: number;
  trend: "up" | "down" | "stable";
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: "normal" | "urgent" | "emergency";
  publisher: string;
  publishTime: string;
  isRead: boolean;
  targetRoles: UserRole[];
}

export interface Contact {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  type: "internal" | "police" | "fire" | "hospital" | "government";
}

export interface PerformanceData {
  userId: string;
  userName: string;
  department: string;
  eventsHandled: number;
  avgHandlingTime: number;
  patrolsCompleted: number;
  patrolAccuracy: number;
  score: number;
}
