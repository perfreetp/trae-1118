import { create } from "zustand";
import type {
  User,
  Shift,
  Event,
  PatrolRoute,
  PatrolRecord,
  Facility,
  Repair,
  Merchant,
  Rectification,
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
  crowdData: CrowdData[];
  notices: Notice[];
  contacts: Contact[];
  performanceData: PerformanceData[];
  crowdTrend: { time: string; count: number }[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  addEvent: (event: Omit<Event, "id" | "createTime" | "updateTime">) => void;
  updateEventStatus: (eventId: string, status: Event["status"]) => void;
  addPatrolRecord: (record: Omit<PatrolRecord, "id">) => void;
  addRepair: (repair: Omit<Repair, "id">) => void;
  updateRepairStatus: (repairId: string, status: Repair["status"]) => void;
  addRectification: (rectification: Omit<Rectification, "id">) => void;
  updateRectificationStatus: (
    rectificationId: string,
    status: Rectification["status"]
  ) => void;
  markNoticeRead: (noticeId: string) => void;
  assignEvent: (eventId: string, handlerId: string, handlerName: string) => void;
  resolveEvent: (eventId: string) => void;
  addFacility: (facility: Omit<Facility, "id">) => void;
  updateFacilityStatus: (facilityId: string, status: Facility["status"]) => void;
  addNotice: (notice: Omit<Notice, "id" | "publishTime" | "isRead">) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  shifts: mockShifts,
  events: mockEvents,
  patrolRoutes: mockPatrolRoutes,
  patrolRecords: mockPatrolRecords,
  facilities: mockFacilities,
  repairs: mockRepairs,
  merchants: mockMerchants,
  rectifications: mockRectifications,
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
    set((state) => ({
      events: [
        {
          ...event,
          id: `e${Date.now()}`,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        },
        ...state.events,
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
    set((state) => ({
      repairs: [
        {
          ...repair,
          id: `r${Date.now()}`,
        },
        ...state.repairs,
      ],
    })),

  updateRepairStatus: (repairId, status) =>
    set((state) => ({
      repairs: state.repairs.map((r) =>
        r.id === repairId
          ? {
              ...r,
              status,
              finishTime:
                status === "completed" ? new Date().toISOString() : r.finishTime,
            }
          : r
      ),
    })),

  addRectification: (rectification) =>
    set((state) => ({
      rectifications: [
        {
          ...rectification,
          id: `rc${Date.now()}`,
        },
        ...state.rectifications,
      ],
    })),

  updateRectificationStatus: (rectificationId, status) =>
    set((state) => ({
      rectifications: state.rectifications.map((r) =>
        r.id === rectificationId ? { ...r, status } : r
      ),
    })),

  markNoticeRead: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.id === noticeId ? { ...n, isRead: true } : n
      ),
    })),

  assignEvent: (eventId, handlerId, handlerName) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              handlerId,
              handlerName,
              status: "processing",
              updateTime: new Date().toISOString(),
            }
          : e
      ),
    })),

  resolveEvent: (eventId) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, status: "resolved", updateTime: new Date().toISOString() }
          : e
      ),
    })),

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
  updateFacilityStatus: (facilityId, status) =>
    set((state) => ({
      facilities: state.facilities.map((f) =>
        f.id === facilityId ? { ...f, status } : f
      ),
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
