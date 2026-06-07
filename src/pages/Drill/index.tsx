import { useState } from "react";
import {
  Siren,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Plus,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import {
  cn,
  formatDateTime,
  getDrillTypeText,
  getDrillStatusColor,
  getDrillStatusText,
} from "@/utils";

export default function Drill() {
  const { drills, drillSummaries } = useAppStore();
  const [showSummary, setShowSummary] = useState<string | null>(null);

  const selectedSummary = drillSummaries.find((s) => s.id === showSummary);

  const stats = {
    total: drills.length,
    planned: drills.filter((d) => d.status === "planned").length,
    completed: drills.filter((d) => d.status === "completed").length,
    avgScore:
      drillSummaries.length > 0
        ? Math.round(
            drillSummaries.reduce((sum, s) => sum + s.score, 0) / drillSummaries.length
          )
        : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">应急演练</h1>
          <p className="text-slate-500 mt-1">演练计划管理和复盘记录</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          新建演练
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">演练总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-warning-50 text-warning-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.planned}</p>
              <p className="text-sm text-slate-500">计划中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success-50 text-success-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
              <p className="text-sm text-slate-500">已完成</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary-50 text-primary-600">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.avgScore}分</p>
              <p className="text-sm text-slate-500">平均评分</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {drills.map((drill) => {
            const summary = drillSummaries.find((s) => s.drillId === drill.id);
            return (
              <div
                key={drill.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary-50 text-primary-600">
                      <Siren className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{drill.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                          {getDrillTypeText(drill.type)}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            getDrillStatusColor(drill.status)
                          )}
                        >
                          {getDrillStatusText(drill.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {summary && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">{summary.score}</p>
                      <p className="text-xs text-slate-500">评分</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{formatDateTime(drill.planTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{drill.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{drill.participants.length}人参与</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{drill.plan}</p>

                {drill.status === "completed" && summary && (
                  <button
                    onClick={() => setShowSummary(summary.id)}
                    className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    查看复盘纪要
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">演练日历</h3>
            <div className="space-y-3">
              {drills
                .filter((d) => d.status === "planned")
                .map((drill) => (
                  <div
                    key={drill.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <p className="text-sm font-medium text-slate-800">{drill.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDateTime(drill.planTime)}</span>
                    </div>
                  </div>
                ))}
              {drills.filter((d) => d.status === "planned").length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">暂无计划中的演练</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">演练类型统计</h3>
            <div className="space-y-3">
              {[
                { type: "fire", label: "消防演练", count: 1 },
                { type: "terrorism", label: "防恐演练", count: 1 },
                { type: "first-aid", label: "急救演练", count: 1 },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-medium text-slate-800">{item.count}次</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSummary && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">复盘纪要</h3>
              <button
                onClick={() => setShowSummary(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium text-slate-800">{selectedSummary.drillName}</h4>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-warning-500 fill-warning-500" />
                  <span className="text-xl font-bold text-warning-600">
                    {selectedSummary.score}
                  </span>
                  <span className="text-sm text-slate-500">/100分</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium text-slate-800 mb-2">存在问题</h5>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                    {selectedSummary.problems}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-800 mb-2">改进措施</h5>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                    {selectedSummary.improvements}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-slate-800 mb-2">总体评价</h5>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                    {selectedSummary.evaluation}
                  </p>
                </div>
                <div className="text-sm text-slate-500 text-right">
                  复盘时间：{formatDateTime(selectedSummary.createTime)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
