import { create } from "zustand";
import type {
  User,
  Shift,
  Event,
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
    facilityStatusAfter?: Facility["status"]
  ) => void;
  addRepairLog: (log: Omit<RepairLog, "id">) => void;
  updateFacilityStatus: (facilityId: string, status: Facility["status"]) => void;
  rectificationLogs: RectificationLog[];
  addRectification: (rectification: Omit<Rectification, "id">) => void;
  updateRectificationStatus: (
    rectificationId: string,
    status: Rectification["status"],
    userId?: string,
    userName?: string
  ) => void;
  addRectificationLog: (log: Omit<RectificationLog, "id">) => void;
  markNoticeRead: (noticeId: string) => void;
  assignEvent: (eventId: string, handlerId: string, handlerName: string) => void;
  resolveEvent: (eventId: string) => void;
  addFacility: (facility: Omit<Facility, "id">) => void;
  addNotice: (notice: Omit<Notice, "id" | "publishTime" | "isRead">) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  shifts: mockShifts,
  events: mockEvents,
  eventLogs: [],
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

  updateRepairStatus: (repairId, status, userId, userName, result, facilityStatusAfter) =>
    set((state) => {
      const now = new Date().toISOString();
      const repair = state.repairs.find((r) => r.id === repairId);
      const actionMap: Record<string, string> = {
        assigned: "指派处理人",
        repairing: "开始维修",
        completed: "完成维修",
        verified: "验收通过",
      };

      let updatedFacilities = state.facilities;
      if (status === "completed" && repair && facilityStatusAfter) {
        updatedFacilities = state.facilities.map((f) =>
          f.id === repair.facilityId
            ? { ...f, status: facilityStatusAfter }
            : f
        );
      }

      return {
        repairs: state.repairs.map((r) =>
          r.id === repairId
            ? {
                ...r,
                status,
                finishTime:
                  status === "completed" ? now : r.finishTime,
                startTime:
                  status === "repairing" && !r.startTime ? now : r.startTime,
              }
            : r
        ),
        repairLogs: [
          {
            id: `rl${Date.now()}`,
            repairId,
            userId: userId || "",
            userName: userName || "",
            action: actionMap[status] || "状态更新",
            time: now,
            remark: result || "",
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

  updateRectificationStatus: (rectificationId, status, userId, userName) =>
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

      return {
        rectifications: state.rectifications.map((r) =>
          r.id === rectificationId ? { ...r, status } : r
        ),
        rectificationLogs: [
          {
            id: `rcl${Date.now()}`,
            rectificationId,
            userId: userId || "",
            userName: userName || "",
            action: actionMap[status] || "状态更新",
            time: now,
            remark: "",
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
}));
