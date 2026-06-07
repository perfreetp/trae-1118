import { useState } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  MapPin,
  Thermometer,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import {
  cn,
  getCrowdTrendIcon,
  getCrowdTrendColor,
  calculateCrowdLevel,
} from "@/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid } from "recharts";

export default function Crowd() {
  const { crowdData, crowdTrend } = useAppStore();
  const [selectedFloor, setSelectedFloor] = useState("all");

  const floors = ["all", "1层", "2层", "3层", "4层", "5层", "B1"];

  const filteredCrowdData = crowdData.filter(
    (c) => selectedFloor === "all" || c.floor === selectedFloor
  );

  const totalCurrent = crowdData.reduce((sum, c) => sum + c.current, 0);
  const totalCapacity = crowdData.reduce((sum, c) => sum + c.capacity, 0);
  const highCongestionCount = crowdData.filter(
    (c) => c.current / c.capacity >= 0.9
  ).length;

  const floorDistribution = [
    { floor: "B1", count: 534 },
    { floor: "1层", count: 856 },
    { floor: "2层", count: 623 },
    { floor: "3层", count: 412 },
    { floor: "4层", count: 256 },
    { floor: "5层", count: 945 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">客流预警</h1>
          <p className="text-slate-500 mt-1">实时监测各区域客流情况</p>
        </div>
        <div className="flex items-center gap-2">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                selectedFloor === floor
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {floor === "all" ? "全部楼层" : floor}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">实时客流</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{totalCurrent}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-slate-500">满载率</span>
            <span className="font-medium text-primary-600">
              {Math.round((totalCurrent / totalCapacity) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-success-50 text-success-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">今日峰值</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">3,500</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-slate-500">出现时间</span>
            <span className="font-medium text-slate-700">18:00</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning-50 text-warning-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">拥堵区域</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {highCongestionCount}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-slate-500">需重点关注</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
              <Thermometer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">平均舒适度</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">良好</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-slate-500">整体客流适中</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">24小时客流趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdTrend}>
                <defs>
                  <linearGradient id="colorCrowd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b61f5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b61f5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
                  fill="url(#colorCrowd)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">楼层客流分布</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  dataKey="floor"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="count" fill="#3b61f5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-semibold text-slate-800">区域客流详情</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCrowdData.map((area, index) => {
            const level = calculateCrowdLevel(area.current, area.capacity);
            return (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-800">{area.area}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                    {area.floor}
                  </span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-2xl font-bold text-slate-800">
                      {area.current}
                    </span>
                    <span className="text-sm text-slate-400">/{area.capacity}</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      getCrowdTrendColor(area.trend)
                    )}
                  >
                    <span>{getCrowdTrendIcon(area.trend)}</span>
                    <span>
                      {area.trend === "up" ? "上升" : area.trend === "down" ? "下降" : "平稳"}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", level.color)}
                    style={{ width: `${(area.current / area.capacity) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    {Math.round((area.current / area.capacity) * 100)}%
                  </span>
                  <span className={cn("text-xs font-medium", level.textColor)}>
                    {level.level}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
