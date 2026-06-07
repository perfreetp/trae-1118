import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  AlertCircle,
  Route,
  Store,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Reports() {
  const { performanceData, events, patrolRecords, rectifications, facilities, repairs } = useAppStore();
  const [timeRange, setTimeRange] = useState("month");

  const handleExportReport = () => {
    const today = new Date().toISOString().split("T")[0];
    let csvContent = "";

    csvContent += "商场公共安全值守系统 - 经营报表\n";
    csvContent += `生成日期: ${today}\n\n`;

    csvContent += "一、核心指标统计\n";
    csvContent += "指标,数值\n";
    csvContent += `总事件数,${events.length}\n`;
    csvContent += `已解决事件数,${events.filter((e) => e.status === "resolved" || e.status === "closed").length}\n`;
    csvContent += `待处理事件数,${events.filter((e) => e.status === "pending").length}\n`;
    csvContent += `处理中事件数,${events.filter((e) => e.status === "processing").length}\n`;
    csvContent += `巡更记录数,${patrolRecords.length}\n`;
    csvContent += `整改完成率,${
      rectifications.length > 0
        ? Math.round(
            (rectifications.filter((r) => r.status === "passed").length /
              rectifications.length) *
              100
          )
        : 0
    }%\n`;
    csvContent += `设施总数,${facilities.length}\n`;
    csvContent += `维修工单总数,${repairs.length}\n\n`;

    csvContent += "二、事件类型分布\n";
    csvContent += "事件类型,数量\n";
    csvContent += `失物招领,${events.filter((e) => e.type === "lost-item").length}\n`;
    csvContent += `走失人员,${events.filter((e) => e.type === "missing-person").length}\n`;
    csvContent += `客流拥堵,${events.filter((e) => e.type === "congestion").length}\n`;
    csvContent += `设备故障,${events.filter((e) => e.type === "equipment-fault").length}\n`;
    csvContent += `消防隐患,${events.filter((e) => e.type === "fire-hazard").length}\n\n`;

    csvContent += "三、事件列表\n";
    csvContent += "ID,事件标题,类型,位置,状态,上报人,处理人,上报时间\n";
    events.forEach((e) => {
      csvContent += `${e.id},${e.title},${e.type},${e.location},${e.status},${e.reporterName || ""},${e.handlerName || ""},${e.createTime}\n`;
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `安全经营报表_${today}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const eventTypeData = [
    { name: "失物招领", value: events.filter((e) => e.type === "lost-item").length, color: "#3b61f5" },
    { name: "走失人员", value: events.filter((e) => e.type === "missing-person").length, color: "#10b981" },
    { name: "客流拥堵", value: events.filter((e) => e.type === "congestion").length, color: "#f59e0b" },
    { name: "设备故障", value: events.filter((e) => e.type === "equipment-fault").length, color: "#ef4444" },
    { name: "消防隐患", value: events.filter((e) => e.type === "fire-hazard").length, color: "#8b5cf6" },
  ];

  const monthlyEvents = [
    { month: "1月", count: 45 },
    { month: "2月", count: 38 },
    { month: "3月", count: 52 },
    { month: "4月", count: 48 },
    { month: "5月", count: 55 },
    { month: "6月", count: events.length },
  ];

  const sortedPerformance = [...performanceData].sort((a, b) => b.score - a.score);

  const stats = {
    totalEvents: events.length,
    resolvedEvents: events.filter((e) => e.status === "resolved" || e.status === "closed").length,
    totalPatrols: patrolRecords.length,
    rectificationRate:
      rectifications.length > 0
        ? Math.round(
            (rectifications.filter((r) => r.status === "passed").length /
              rectifications.length) *
              100
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">经营报表</h1>
          <p className="text-slate-500 mt-1">安全运营数据统计和绩效分析</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年</option>
            </select>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">总事件数</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalEvents}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-success-600">
            <TrendingUp className="w-4 h-4" />
            <span>较上月增长 12.5%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">事件结案率</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {Math.round((stats.resolvedEvents / stats.totalEvents) * 100)}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-success-50 text-success-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-success-600">
            <TrendingUp className="w-4 h-4" />
            <span>较上月提升 3.2%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">巡更打卡次数</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalPatrols}</p>
            </div>
            <div className="p-3 rounded-xl bg-warning-50 text-warning-600">
              <Route className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-success-600">
            <TrendingUp className="w-4 h-4" />
            <span>较上月增长 8.7%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">整改完成率</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {stats.rectificationRate}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-danger-50 text-danger-600">
              <Store className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-sm text-danger-600">
            <TrendingUp className="w-4 h-4 rotate-180" />
            <span>较上月下降 2.1%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">月度事件趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
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
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b61f5"
                  strokeWidth={2}
                  dot={{ fill: "#3b61f5", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">事件类型分布</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {eventTypeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">人员绩效排行</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 bg-slate-50">
                <th className="px-4 py-3 font-medium rounded-l-lg">排名</th>
                <th className="px-4 py-3 font-medium">姓名</th>
                <th className="px-4 py-3 font-medium">部门</th>
                <th className="px-4 py-3 font-medium">处理事件</th>
                <th className="px-4 py-3 font-medium">平均处理时长</th>
                <th className="px-4 py-3 font-medium">巡更完成率</th>
                <th className="px-4 py-3 font-medium rounded-r-lg">综合评分</th>
              </tr>
            </thead>
            <tbody>
              {sortedPerformance.map((person, index) => (
                <tr key={person.userId} className="border-t border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        index === 0
                          ? "bg-warning-100 text-warning-700"
                          : index === 1
                          ? "bg-slate-200 text-slate-700"
                          : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.userName}`}
                        alt={person.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-slate-800">
                        {person.userName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{person.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-800 font-medium">
                      {person.eventsHandled}件
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">
                      {person.avgHandlingTime}分钟
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600">{person.patrolAccuracy}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-bold ${
                        person.score >= 90
                          ? "text-success-600"
                          : person.score >= 80
                          ? "text-primary-600"
                          : "text-warning-600"
                      }`}
                    >
                      {person.score}分
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
