import { create } from "zustand";
import type {
  User,
  Shift,
  Event,
  EventLevel,
  EventLog,
  PatrolRoute,
  PatrolRecord,
  Facility,
  Repair,
  RepairLog,
  Merchant,
  Rectification,
  RectificationLog,
  Drill,
  CrowdData,
  Notice,
  Contact,
  PerformanceData,
} from "../types";
import {
  mockUsers,
  mockShifts,
  mockEvents,
  mockPatrolRoutes,
  mockPatrolRecords,
  mockFacilities,
  mockRepairs,
  mockMerchants,
  mockRectifications,
  mockDrills,
  mockDrillSummaries,
  mockCrowdData,
  mockNotices,
  mockContacts,
  mockPerformanceData,
  mockCrowdTrend,
} from "../mock";

interface AppState {
  currentUser: User;
  users: User[];
  shifts: Shift[];
  events: Event[];
  patrolRoutes: PatrolRoute[];
  patrolRecords: PatrolRecord[];
  facilities: Facility[];
  repairs: Repair[];
  merchants: Merchant[];
  rectifications: Rectification[];
  drills: Drill[];
  drillSummaries: any[];
  eventLogs: EventLog[];
  crowdData: CrowdData[];
  notices: Notice[];
  contacts: Contact[];
  performanceData: PerformanceData[];
  crowdTrend: { time: string; count: number }[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addEvent: (event: Omit<Event, "id" | "createTime" | "updateTime">) => void;
  updateEventStatus: (eventId: string, status: Event["status"]) => void;
  updateEventLevel: (
    eventId: string,
    level: EventLevel,
    reason: string,
    userId: string,
    userName: string
  ) => void;
  addEventLog: (log: Omit<EventLog, "id">) => void;
  addPatrolRecord: (record: Omit<PatrolRecord, "id">) => void;
  repairLogs: RepairLog[];
  addRepair: (repair: Omit<Repair, "id">) => void;
  updateRepairStatus: (
    repairId: string,
    status: Repair["status"],
    userId?: string,
    userName?: string,
    result?: string,
    facilityStatusAfter?: Facility["status"],
    verifyData?: {
      remark?: string;
      rejectReason?: string;
    },
    repairImages?: string[]
  ) => void;
  addRepairLog: (log: Omit<RepairLog, "id">) => void;
  updateFacilityStatus: (facilityId: string, status: Facility["status"]) => void;
  rectificationLogs: RectificationLog[];
  addRectification: (rectification: Omit<Rectification, "id">) => void;
  updateRectificationStatus: (
    rectificationId: string,
    status: Rectification["status"],
    userId?: string,
    userName?: string,
    reviewData?: {
      result?: "passed" | "failed";
      remark?: string;
      images?: string[];
    }
  ) => void;
  addRectificationLog: (log: Omit<RectificationLog, "id">) => void;
  markNoticeRead: (noticeId: string) => void;
  assignEvent: (eventId: string, handlerId: string, handlerName: string) => void;
  resolveEvent: (eventId: string) => void;
  addFacility: (facility: Omit<Facility, "id">) => void;
  addNotice: (notice: Omit<Notice, "id" | "publishTime" | "isRead">) => void;
  updateEventReview: (
    eventId: string,
    reviewData: {
      summary: string;
      impactScope: string;
      involvedDepartments: string[];
      improvementMeasures: string;
    },
    userId: string,
    userName: string
  ) => void;
}

export const useAppStore = create<AppState>((set) => {
  const generateInitialEventLogs = (): EventLog[] => {
    const logs: EventLog[] = [];
    mockEvents.forEach((event) => {
      logs.push({
        id: `log-${event.id}-1`,
        eventId: event.id,
        action: "事件上报",
        time: event.createTime,
        userId: event.reporterId,
        userName: event.reporterName,
        remark: `事件类型：${event.type}，位置：${event.location}`,
      });
      if (event.handlerId && event.status !== "pending") {
        logs.push({
          id: `log-${event.id}-2`,
          eventId: event.id,
          action: "接手处理",
          time: event.createTime,
          userId: event.handlerId,
          userName: event.handlerName || "",
          remark: "已指派处理人",
        });
      }
      if (event.status === "resolved" || event.status === "closed") {
        logs.push({
          id: `log-${event.id}-3`,
          eventId: event.id,
          action: "事件解决",
          time: event.updateTime,
          userId: event.handlerId || "",
          userName: event.handlerName || "",
          remark: "事件已处理完成",
        });
      }
    });
    return logs.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
  };

  return {
    currentUser: mockUsers[0],
    users: mockUsers,
    shifts: mockShifts,
    events: mockEvents,
    eventLogs: generateInitialEventLogs(),
    patrolRoutes: mockPatrolRoutes,
    patrolRecords: mockPatrolRecords,
    facilities: mockFacilities,
    repairs: mockRepairs,
    repairLogs: [],
    merchants: mockMerchants,
    rectifications: mockRectifications,
    rectificationLogs: [],
    drills: mockDrills,
    drillSummaries: mockDrillSummaries,
    crowdData: mockCrowdData,
    notices: mockNotices,
    contacts: mockContacts,
    performanceData: mockPerformanceData,
    crowdTrend: mockCrowdTrend,
    sidebarCollapsed: false,

    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    addEvent: (event) =>
    set((state) => {
      const newEventId = `e${Date.now()}`;
      const now = new Date().toISOString();
      return {
        events: [
          {
            ...event,
            id: newEventId,
            createTime: now,
            updateTime: now,
          },
          ...state.events,
        ],
        eventLogs: [
          {
            id: `el${Date.now()}`,
            eventId: newEventId,
            userId: event.reporterId,
            userName: event.reporterName,
            action: "上报事件",
            time: now,
            remark: event.description || "",
          },
          ...(event.handlerId
            ? [
                {
                  id: `el${Date.now() + 1}`,
                  eventId: newEventId,
                  userId: event.handlerId,
                  userName: event.handlerName,
                  action: "指定处理人",
                  time: now,
                  remark: "",
                },
              ]
            : []),
          ...state.eventLogs,
        ],
      };
    }),
  addEventLog: (log) =>
    set((state) => ({
      eventLogs: [
        {
          ...log,
          id: `el${Date.now()}`,
        },
        ...state.eventLogs,
      ],
    })),

  updateEventStatus: (eventId, status) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, status, updateTime: new Date().toISOString() }
          : e
      ),
    })),

  addPatrolRecord: (record) =>
    set((state) => ({
      patrolRecords: [
        {
          ...record,
          id: `pc${Date.now()}`,
        },
        ...state.patrolRecords,
      ],
    })),

  addRepair: (repair) =>
    set((state) => {
      const newId = `r${Date.now()}`;
      const now = new Date().toISOString();
      return {
        repairs: [
          {
            ...repair,
            id: newId,
          },
          ...state.repairs,
        ],
        repairLogs: [
          {
            id: `rl${Date.now()}`,
            repairId: newId,
            userId: repair.handlerId || "",
            userName: repair.handlerName || "",
            action: "提交报修",
            time: now,
            remark: repair.description || "",
          },
          ...state.repairLogs,
        ],
      };
    }),

  updateRepairStatus: (repairId, status, userId, userName, result, facilityStatusAfter, verifyData, repairImages) =>
    set((state) => {
      const now = new Date().toISOString();
      const repair = state.repairs.find((r) => r.id === repairId);
      if (!repair) return state;

      const actionMap: Record<string, string> = {
        assigned: "指派处理人",
        repairing: "开始维修",
        completed: "完成维修（待验收）",
        verified: "验收通过",
      };

      let updatedFacilities = state.facilities;
      if (status === "verified" && facilityStatusAfter) {
        updatedFacilities = state.facilities.map((f) =>
          f.id === repair.facilityId
            ? { ...f, status: facilityStatusAfter }
            : f
        );
      }

      let newHandlerId = repair.handlerId;
      let newHandlerName = repair.handlerName;
      if (status === "repairing" && !repair.handlerId && userId && userName) {
        newHandlerId = userId;
        newHandlerName = userName;
      }

      return {
        repairs: state.repairs.map((r) =>
          r.id === repairId
            ? {
                ...r,
                status,
                handlerId: newHandlerId,
                handlerName: newHandlerName,
                finishTime:
                  status === "completed" ? now : r.finishTime,
                startTime:
                  status === "repairing" && !r.startTime ? now : r.startTime,
                verifyTime:
                  status === "verified" ? now : r.verifyTime,
                verifiedBy:
                  status === "verified" ? userId : r.verifiedBy,
                verifiedByName:
                  status === "verified" ? userName : r.verifiedByName,
                verifyRemark:
                  status === "verified"
                    ? verifyData?.remark
                    : r.verifyRemark,
                rejectReason:
                  status === "repairing" && r.status === "completed"
                    ? verifyData?.rejectReason
                    : r.rejectReason,
                solution:
                  status === "completed" && result ? result : r.solution,
                repairImages:
                  status === "completed" && repairImages
                    ? repairImages
                    : r.repairImages,
              }
            : r
        ),
        repairLogs: [
          {
            id: `rl${Date.now()}`,
            repairId,
            userId: userId || "",
            userName: userName || "",
            action:
              status === "repairing" && repair.status === "completed"
                ? "退回维修"
                : actionMap[status] || "状态更新",
            time: now,
            remark:
              status === "repairing" && repair.status === "completed"
                ? verifyData?.rejectReason || ""
                : result || "",
          },
          ...state.repairLogs,
        ],
        facilities: updatedFacilities,
      };
    }),

  addRepairLog: (log) =>
    set((state) => ({
      repairLogs: [
        {
          ...log,
          id: `rl${Date.now()}`,
        },
        ...state.repairLogs,
      ],
    })),

  updateFacilityStatus: (facilityId, status) =>
    set((state) => ({
      facilities: state.facilities.map((f) =>
        f.id === facilityId ? { ...f, status } : f
      ),
    })),

  addRectification: (rectification) =>
    set((state) => {
      const newId = `rc${Date.now()}`;
      const now = new Date().toISOString();
      return {
        rectifications: [
          {
            ...rectification,
            id: newId,
          },
          ...state.rectifications,
        ],
        rectificationLogs: [
          {
            id: `rcl${Date.now()}`,
            rectificationId: newId,
            userId: "",
            userName: rectification.reviewerName || "",
            action: "下发整改通知",
            time: now,
            remark: rectification.issue,
          },
          ...state.rectificationLogs,
        ],
        merchants: state.merchants.map((m) =>
          m.id === rectification.merchantId
            ? { ...m, status: "rectification" }
            : m
        ),
      };
    }),

  updateRectificationStatus: (rectificationId, status, userId, userName, reviewData) =>
    set((state) => {
      const now = new Date().toISOString();
      const rectification = state.rectifications.find(
        (r) => r.id === rectificationId
      );
      const actionMap: Record<string, string> = {
        rectifying: "开始整改",
        reviewing: "申请复查",
        passed: "整改通过",
        failed: "整改不通过",
      };

      let updatedMerchants = state.merchants;
      if (status === "passed" && rectification) {
        updatedMerchants = state.merchants.map((m) =>
          m.id === rectification.merchantId ? { ...m, status: "normal" } : m
        );
      }

      const isFailedReview = status === "failed";
      const actualStatus = isFailedReview ? "rectifying" : status;

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId
            ? {
                ...r,
                status: actualStatus,
                ...(status === "passed" || status === "failed"
                  ? {
                      reviewTime: now,
                      reviewerId: userId || r.reviewerId,
                      reviewerName: userName || r.reviewerName,
                      reviewResult: status as "passed" | "failed",
                      reviewRemark: reviewData?.remark || r.reviewRemark,
                      reviewImages: reviewData?.images || r.reviewImages,
                    }
                  : {}),
              }
            : r
        ),
        rectificationLogs: [
          {
            id: `rcl${Date.now()}`,
            rectificationId,
            userId: userId || "",
            userName: userName || "",
            action: actionMap[status] || "状态更新",
            time: now,
            remark: reviewData?.remark || "",
          },
          ...state.rectificationLogs,
        ],
        merchants: updatedMerchants,
      };
    }),

  addRectificationLog: (log) =>
    set((state) => ({
      rectificationLogs: [
        {
          ...log,
          id: `rcl${Date.now()}`,
        },
        ...state.rectificationLogs,
      ],
    })),

  markNoticeRead: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, isRead: true } : n
      ),
    })),

  assignEvent: (eventId, handlerId, handlerName) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        events: state.events.map((e) =>
          e.id === eventId
            ? {
                ...e,
                handlerId,
                handlerName,
                status: "processing",
                updateTime: now,
              }
            : e
        ),
        eventLogs: [
          {
            id: `el${Date.now()}`,
            eventId,
            userId: handlerId,
            userName: handlerName,
            action: "接手处理",
            time: now,
            remark: "",
          },
          ...state.eventLogs,
        ],
      };
    }),

  resolveEvent: (eventId) =>
    set((state) => {
      const now = new Date().toISOString();
      const event = state.events.find((e) => e.id === eventId);
      return {
        events: state.events.map((e) =>
          e.id === eventId
            ? { ...e, status: "resolved", updateTime: now }
            : e
        ),
        eventLogs: [
          {
            id: `el${Date.now()}`,
            eventId,
            userId: event?.handlerId || "",
            userName: event?.handlerName || "",
            action: "标记已解决",
            time: now,
            remark: "",
          },
          ...state.eventLogs,
        ],
      };
    }),

  updateEventLevel: (eventId, level, reason, userId, userName) =>
    set((state) => {
      const now = new Date().toISOString();
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return state;

      const levelMap: Record<string, string> = {
        low: "一般",
        medium: "重要",
        high: "紧急",
        critical: "特急",
      };

      const isUpgrade =
        (level === "medium" && event.level === "low") ||
        (level === "high" && (event.level === "low" || event.level === "medium")) ||
        (level === "critical" && event.level !== "critical");

      const action = isUpgrade ? "升级事件" : "降级事件";
      const actionText = `${action}为【${levelMap[level]}】`;

      let newNotices = state.notices;
      let newEventLogs = state.eventLogs;

      if (isUpgrade && (level === "high" || level === "critical")) {
        const noticeType: "urgent" | "emergency" = level === "critical" ? "emergency" : "urgent";
        const broadcastNotice: Notice = {
          id: `n${Date.now()}`,
          title: `【${levelMap[level]}事件通知】${event.title}`,
          content: `事件位置：${event.location}\n事件描述：${event.description}\n\n请相关人员立即响应！`,
          type: noticeType,
          publisher: userName,
          publishTime: now,
          isRead: false,
          targetRoles: ["security", "engineering", "admin"],
        };
        newNotices = [broadcastNotice, ...state.notices];

        newEventLogs = [
          {
            id: `el${Date.now() + 1}`,
            eventId,
            userId,
            userName,
            action: "触发广播联动",
            time: now,
            remark: `已发布${levelMap[level]}事件通知公告`,
          },
          ...newEventLogs,
        ];
      }

      newEventLogs = [
        {
          id: `el${Date.now()}`,
          eventId,
          userId,
          userName,
          action: actionText,
          time: now,
          remark: reason,
        },
        ...newEventLogs,
      ];

      return {
        events: state.events.map((e) =>
          e.id === eventId ? { ...e, level, updateTime: now } : e
        ),
        eventLogs: newEventLogs,
        notices: newNotices,
      };
    }),

  addFacility: (facility) =>
    set((state) => ({
      facilities: [
        {
          ...facility,
          id: `F${Date.now()}`,
        },
        ...state.facilities,
      ],
    })),
  addNotice: (notice) =>
    set((state) => ({
      notices: [
        {
          ...notice,
          id: `n${Date.now()}`,
          publishTime: new Date().toISOString(),
          isRead: false,
        },
        ...state.notices,
      ],
    })),
  updateEventReview: (eventId, reviewData, userId, userName) =>
    set((state) => {
      const now = new Date().toISOString();
      return {
        events: state.events.map((e) =>
          e.id === eventId
            ? {
                ...e,
                reviewSummary: reviewData.summary,
                impactScope: reviewData.impactScope,
                involvedDepartments: reviewData.involvedDepartments,
                improvementMeasures: reviewData.improvementMeasures,
                reviewTime: now,
                reviewedBy: userId,
                reviewedByName: userName,
              }
            : e
        ),
        eventLogs: [
          {
            id: `el${Date.now()}`,
            eventId,
            userId,
            userName,
            action: "事件复盘",
            time: now,
            remark: `已完成事件复盘，纪要：${reviewData.summary.substring(0, 50)}...`,
          },
          ...state.eventLogs,
        ],
      };
    }),
  };
});
