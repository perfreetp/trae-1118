import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertCircle,
  Route,
  Building2,
  Store,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useAppStore } from "@/store/appStore";
import {
  cn,
  formatDateTime,
  getEventLevelColor,
  getEventLevelText,
  getEventStatusColor,
  getEventStatusText,
  getUserStatusColor,
  getUserStatusText,
  getEventTypeText,
} from "@/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    events,
    users,
    patrolRecords,
    facilities,
    merchants,
    crowdTrend,
    crowdData,
    notices,
    currentUser,
  } = useAppStore();

  const pendingEvents = events.filter((e) => e.status === "pending").length;
  const processingEvents = events.filter((e) => e.status === "processing").length;
  const onDutyUsers = users.filter((u) => u.status === "on-duty").length;
  const faultFacilities = facilities.filter((f) => f.status === "fault" || f.status === "maintenance").length;
  const rectificationMerchants = merchants.filter((m) => m.status === "rectification").length;
  const todayPatrols = patrolRecords.length;

  const recentEvents = events.slice(0, 5);
  const recentNotices = notices.slice(0, 3);
  const onDutyList = users.filter((u) => u.status === "on-duty").slice(0, 5);

  const highCrowdAreas = crowdData
    .filter((c) => c.current / c.capacity >= 0.7)
    .sort((a, b) => b.current - a.current);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">值班看板</h1>
          <p className="text-slate-500 mt-1">
            欢迎回来，{currentUser.name}。当前时间：{formatDateTime(new Date())}
          </p>
        </div>
        <button
          onClick={() => navigate("/events/new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
        >
          <AlertCircle className="w-4 h-4" />
          上报事件
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="待处理事件"
          value={pendingEvents}
          icon={AlertTriangle}
          color="warning"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="处理中事件"
          value={processingEvents}
          icon={Clock}
          color="primary"
          trend={{ value: 5, isUp: false }}
        />
        <StatCard
          title="在岗人员"
          value={`${onDutyUsers}/${users.length}`}
          icon={Users}
          color="success"
        />
        <StatCard
          title="今日巡更"
          value={todayPatrols}
          icon={Route}
          color="primary"
          trend={{ value: 8, isUp: true }}
        />
        <StatCard
          title="异常设备"
          value={faultFacilities}
          icon={Building2}
          color="danger"
        />
        <StatCard
          title="整改商户"
          value={rectificationMerchants}
          icon={Store}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">今日客流趋势</h2>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>今日</option>
              <option>昨日</option>
              <option>本周</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b61f5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b61f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b61f5"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">客流预警区域</h2>
            <button
              onClick={() => navigate("/crowd")}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {highCrowdAreas.length > 0 ? (
              highCrowdAreas.map((area, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{area.area}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning-100 text-warning-700">
                      {Math.round((area.current / area.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          area.current / area.capacity >= 0.9
                            ? "bg-danger-500"
                            : "bg-warning-500"
                        )}
                        style={{ width: `${(area.current / area.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {area.current}/{area.capacity}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-success-400" />
                <p className="text-sm">暂无客流预警区域</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">最新事件</h2>
            <button
              onClick={() => navigate("/events")}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">事件标题</th>
                  <th className="pb-3 font-medium">类型</th>
                  <th className="pb-3 font-medium">等级</th>
                  <th className="pb-3 font-medium">位置</th>
                  <th className="pb-3 font-medium">状态</th>
                  <th className="pb-3 font-medium">上报时间</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <td className="py-3">
                      <span className="text-sm font-medium text-slate-800">{event.title}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-slate-600">{getEventTypeText(event.type)}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full border",
                          getEventLevelColor(event.level)
                        )}
                      >
                        {getEventLevelText(event.level)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-slate-600">{event.location}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          getEventStatusColor(event.status)
                        )}
                      >
                        {getEventStatusText(event.status)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-slate-500 font-mono">
                        {formatDateTime(event.createTime)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">在岗人员</h2>
            <div className="space-y-3">
              {onDutyList.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        getUserStatusColor(user.status)
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.department}</p>
                  </div>
                  <span className="text-xs text-success-600">{getUserStatusText(user.status)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">最新通知</h2>
            <div className="space-y-3">
              {recentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-colors",
                    notice.isRead ? "bg-slate-50" : "bg-primary-50"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        notice.type === "emergency"
                          ? "bg-danger-500"
                          : notice.type === "urgent"
                          ? "bg-warning-500"
                          : "bg-primary-500"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">
                        {notice.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{notice.publishTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
