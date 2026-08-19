import React from "react";
import { motion } from "motion/react";
import { Compass, Check, BookOpen } from "lucide-react";
import { PageProps } from "../types";
import { SURAHS } from "../quranData";

interface PrayersProps extends PageProps {
  distributionSlots: any[];
  onUpdateReviewProgress: (idx: number) => void;
}

const Prayers: React.FC<PrayersProps> = ({ state, todayStr, distributionSlots, onUpdateReviewProgress, onNavigateToMushaf }) => {
  const currentProgress = state.reviewProgress[todayStr] || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
        <h3 className="text-xl font-serif font-bold text-emerald-900 border-b pb-3 flex justify-between items-center">
          <span>📿 خريطة توزيع الركعات</span>
          <Compass className="w-5 h-5 text-emerald-600" />
        </h3>

        {distributionSlots.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">لا يوجد مراجعات مستحقة للتوزيع اليوم.</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-800">تقدم المراجعة اليومي: {currentProgress} / {distributionSlots.length}</span>
              <div className="w-48 h-2 bg-white rounded-full overflow-hidden border border-emerald-100">
                <div className="h-full bg-emerald-600 transition-all" style={{ width: `${(currentProgress / distributionSlots.length) * 100}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {distributionSlots.map((slot, idx) => {
                const isCompleted = currentProgress > idx;
                const isCurrent = currentProgress === idx;
                return (
                  <div key={slot.id} className={`p-4 rounded-2xl border transition-all flex justify-between gap-3 ${isCompleted ? "bg-emerald-50/30 opacity-60" : isCurrent ? "bg-white border-amber-500 shadow-md ring-1 ring-amber-500/10 scale-[1.02]" : "bg-gray-50 border-gray-200"}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{slot.prayerName}</span>
                        <span className="text-[10px] text-gray-400">الركعة {slot.rakahNumber}</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-800 bg-white/50 p-1.5 rounded-lg border border-emerald-50 mt-1">{slot.assignedContent}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => onUpdateReviewProgress(isCompleted ? idx : idx + 1)} className={`p-2 rounded-xl border transition-all ${isCompleted ? "bg-emerald-600 border-emerald-700 text-white" : "bg-white text-gray-400 border-gray-300"}`}><Check className="w-4 h-4" /></button>
                      <button onClick={() => {
                        const match = slot.assignedContent.match(/سورة ([\u0600-\u06FF]+)/);
                        if (match) {
                          const found = SURAHS.find(s => s.name === match[1]);
                          if (found) onNavigateToMushaf(found.id, 1);
                        }
                      }} className="p-2 bg-white border border-gray-200 rounded-xl text-emerald-700"><BookOpen className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Prayers;
