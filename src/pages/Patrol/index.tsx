import { useState } from "react";
import {
  MapPin,
  Route,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Map,
  Navigation,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import {
  cn,
  formatDateTime,
  getPatrolStatusColor,
  getPatrolStatusText,
} from "@/utils";

export default function Patrol() {
  const { patrolRoutes, patrolRecords, users } = useAppStore();
  const [selectedRouteId, setSelectedRouteId] = useState(patrolRoutes[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"routes" | "records">("routes");

  const selectedRoute = patrolRoutes.find((r) => r.id === selectedRouteId);
  const routeRecords = patrolRecords.filter((r) => r.routeId === selectedRouteId);

  const stats = {
    total: patrolRecords.length,
    normal: patrolRecords.filter((r) => r.status === "normal").length,
    missed: patrolRecords.filter((r) => r.status === "missed").length,
    late: patrolRecords.filter((r) => r.status === "late").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">巡更路线</h1>
          <p className="text-slate-500 mt-1">管理巡更路线和打卡记录</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          新增路线
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">总打卡次数</p>
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
              <p className="text-sm text-slate-500">正常打卡</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-danger-50 text-danger-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.missed}</p>
              <p className="text-sm text-slate-500">漏检次数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning-50 text-warning-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.late}</p>
              <p className="text-sm text-slate-500">超时打卡</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("routes")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "routes"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          路线管理
        </button>
        <button
          onClick={() => setActiveTab("records")}
          className={cn(
            "px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
            activeTab === "records"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          )}
        >
          打卡记录
        </button>
      </div>

      {activeTab === "routes" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">巡更路线列表</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {patrolRoutes.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setSelectedRouteId(route.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    selectedRouteId === route.id
                      ? "bg-primary-50 border-l-4 border-primary-500"
                      : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                      <Route className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800">{route.name}</p>
                      <p className="text-sm text-slate-500 truncate">{route.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{route.points.length}个点</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {selectedRoute ? (
              <>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{selectedRoute.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{selectedRoute.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>每 {selectedRoute.intervalMinutes} 分钟巡更一次</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="relative">
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200" />
                    <div className="space-y-6">
                      {selectedRoute.points.map((point, index) => (
                        <div key={point.id} className="relative flex items-start gap-4">
                          <div className="relative z-10 w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm border-4 border-white shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-slate-800">{point.name}</h4>
                              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                                {point.floor}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                              <MapPin className="w-4 h-4" />
                              <span>{point.location}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                              <Navigation className="w-4 h-4" />
                              <span>NFC编号: {point.nfcCode}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Map className="w-12 h-12 mx-auto mb-3" />
                <p>请选择一条巡更路线查看详情</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 bg-slate-50">
                  <th className="px-4 py-3 font-medium">巡更路线</th>
                  <th className="px-4 py-3 font-medium">巡更点</th>
                  <th className="px-4 py-3 font-medium">巡更人员</th>
                  <th className="px-4 py-3 font-medium">打卡时间</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">备注</th>
                </tr>
              </thead>
              <tbody>
                {patrolRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-800">
                        {record.routeName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{record.pointName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">{record.userName}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500 font-mono">
                        {record.checkTime ? formatDateTime(record.checkTime) : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getPatrolStatusColor(record.status)
                        )}
                      >
                        {getPatrolStatusText(record.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500">{record.remark || "-"}</span>
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
