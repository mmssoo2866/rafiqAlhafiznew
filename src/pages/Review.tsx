import React from "react";
import { motion } from "motion/react";
import { RotateCcw, CheckCircle } from "lucide-react";
import { PageProps } from "../types";
import { getSurahName } from "../quranData";

interface ReviewProps extends PageProps {
  todayTasks: any[];
  onToggleReviewComplete: (id: string) => void;
  cumulativeGroups: any[];
}

const Review: React.FC<ReviewProps> = ({
  state,
  onNavigateToMushaf,
  todayTasks,
  onToggleReviewComplete,
  cumulativeGroups
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-emerald-800 text-white rounded-3xl p-6 shadow-md space-y-2">
        <h3 className="text-xl font-serif font-bold flex items-center gap-2">
          <RotateCcw className="w-6 h-6" />
          <span>هيكل المراجعة الذكية</span>
        </h3>
        <p className="text-xs text-emerald-100 leading-relaxed">توزيع المراجعة على 66 يوماً لضمان تثبيت الذاكرة بعيدة المدى.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
          <h4 className="text-lg font-serif font-bold text-emerald-900 border-b pb-2">🔥 مراجعة مكثفة (2-10)</h4>
          {todayTasks.filter(t => t.type === "review" && t.offset <= 10).length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">لا يوجد مراجعات مكثفة اليوم.</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.filter(t => t.type === "review" && t.offset <= 10).map(t => (
                <div key={t.block.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold">سورة {getSurahName(t.block.surahId)}</span>
                  <button onClick={() => onToggleReviewComplete(t.block.id)} className={`px-3 py-1 rounded-lg text-xs font-bold ${t.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>{t.isCompleted ? "✓" : "إتمام"}</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
          <h4 className="text-lg font-serif font-bold text-emerald-900 border-b pb-2">🌌 مراجعة متباعدة (12-66)</h4>
          {todayTasks.filter(t => t.type === "review" && t.offset > 10).length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">لا توجد مراجعات متباعدة اليوم.</p>
          ) : (
            <div className="space-y-2">
              {todayTasks.filter(t => t.type === "review" && t.offset > 10).map(t => (
                <div key={t.block.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-bold">سورة {getSurahName(t.block.surahId)}</span>
                  <button onClick={() => onToggleReviewComplete(t.block.id)} className={`px-3 py-1 rounded-lg text-xs font-bold ${t.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>{t.isCompleted ? "✓" : "إتمام"}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
        <h3 className="text-lg font-serif font-bold text-emerald-900 border-b pb-3">🧠 المجموعات التراكمية الكبرى</h3>
        {cumulativeGroups.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">سيتم تعيين المجموعات تلقائياً عند إضافة المزيد من المقررات.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cumulativeGroups.map(g => (
              <div key={g.id} className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex justify-between font-bold text-sm text-emerald-950">
                  <span>{g.name}</span>
                  <span className="bg-emerald-100 px-2 rounded">{g.blocks.length}</span>
                </div>
                <button onClick={() => onNavigateToMushaf(g.blocks[0].surahId, g.blocks[0].fromAyah)} className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">مراجعة المجموعة بالمصحف 📖</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Review;
