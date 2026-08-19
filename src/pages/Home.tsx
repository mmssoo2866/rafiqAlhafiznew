import React from "react";
import { motion } from "motion/react";
import {
  Book,
  BookOpen,
  Check,
  CheckCircle,
  Clock,
  Compass,
  Flame,
  MapPin,
  Bell,
  Activity
} from "lucide-react";
import { PageProps } from "../types";
import { getSurahName, getSurahById, getPageForAyah, getSurahForPage, SURAHS } from "../quranData";

interface HomeProps extends PageProps {
  onDetectLocation: () => void;
  gpsLoading: boolean;
  prayerTimesList: any[];
  todayTasks: any[];
  repetitions: Record<string, number>;
  onDecrementRepetition: (id: string) => void;
  onToggleReviewComplete: (id: string) => void;
  onCompleteDay66: () => void;
  hasDay66: boolean;
  distributionSlots: any[];
  onCompleteKhatmahReview: () => void;
}

const Home: React.FC<HomeProps> = ({
  state,
  todayStr,
  onNavigateToMushaf,
  onToggleTab,
  onDetectLocation,
  gpsLoading,
  prayerTimesList,
  todayTasks,
  repetitions,
  onDecrementRepetition,
  onToggleReviewComplete,
  onCompleteDay66,
  hasDay66,
  distributionSlots,
  onCompleteKhatmahReview
}) => {
  const userProfile = state.profile!;
  const memorizedVersesCount = state.blocks.reduce((sum, b) => sum + (b.toAyah - b.fromAyah + 1), 0);
  const quranCompletionPercent = ((memorizedVersesCount / 6236) * 100).toFixed(1);
  const totalCompletedReviewsCount = Object.values(state.completedReviews).reduce((sum: number, arr) => sum + (arr as string[]).length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* DAY 66 ALERT */}
      {hasDay66 && (
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-xl flex items-start space-x-3 space-x-reverse shadow-sm">
          <div className="p-1 bg-amber-500/10 rounded-lg text-amber-600">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900 text-sm">مراجعة تراكمية كبرى (اليوم 66) 🌟</h4>
            <p className="text-xs text-amber-700 mt-1">
              اليوم هو يوم مراجعة كامل لجميع محفوظاتك. تم إيقاف مقرر الحفظ الجديد مؤقتاً لتمكينك من تثبيت ما سبق.
            </p>
            <button
              onClick={onCompleteDay66}
              disabled={state.fullReviewDates.includes(todayStr)}
              className={`mt-3 px-4 py-2 rounded-xl text-xs font-bold transition ${
                state.fullReviewDates.includes(todayStr)
                  ? "bg-emerald-100 text-emerald-800 cursor-not-allowed"
                  : "bg-amber-600 text-white hover:bg-amber-700 shadow-md"
              }`}
            >
              {state.fullReviewDates.includes(todayStr) ? "✓ تم إكمال مراجعة اليوم 66" : "إتمام مراجعة اليوم 66 واستئناف الحفظ ➔"}
            </button>
          </div>
        </div>
      )}

      {userProfile.appTrack === "review_only" ? (
        /* TRACK 2: REVIEW ONLY HOME VIEW */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-bold text-xs rounded-full">مسار المراجعة فقط</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 mt-2">
                  {userProfile.reviewOnlyDailyAmountType === "surah_ayah"
                    ? `مقرر مراجعة اليوم: سورة ${getSurahById(userProfile.reviewOnlySurahId || 2)?.name || "البقرة"}`
                    : `مقرر مراجعة اليوم: الصحيفة ${userProfile.reviewOnlyCurrentPage || 1} من 610`}
                </h3>
              </div>
              <button
                onClick={() => onToggleTab("mushaf")}
                className="px-4 py-2.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-2 border border-emerald-200"
              >
                <BookOpen className="w-4 h-4" />
                فتح المصحف
              </button>
            </div>

            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">ورد اليوم المعتمد</span>
                <h4 className="text-lg font-bold text-emerald-950 mt-1">مراجعة الورد اليومي</h4>
              </div>
              <button
                onClick={onCompleteKhatmahReview}
                className="px-6 py-3 bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md hover:bg-emerald-800 transition"
              >
                إتمام ورد المراجعة اليوم 🌟
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TRACK 1: HIFZ & REVIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
              <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>🔁 عداد التكرار لحفظ اليوم الجديد</span>
              </h3>

              {todayTasks.filter(t => t.type === "memorization").length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 text-gray-500">
                  <Book className="w-10 h-10 text-emerald-600/30" />
                  <p className="text-sm font-medium">لا يوجد مقرر حفظ مضاف اليوم.</p>
                  <button onClick={() => onToggleTab("hifz")} className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl transition">إضافة أول مقرر ➕</button>
                </div>
              ) : (
                todayTasks.filter(t => t.type === "memorization").map((task: any) => {
                  const remCount = repetitions[task.block.id] ?? task.block.repetitionTarget;
                  const isTargetMet = remCount === 0;
                  const pct = ((task.block.repetitionTarget - remCount) / task.block.repetitionTarget) * 100;

                  return (
                    <div key={task.block.id} className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
                      <div className="text-center md:text-right">
                        <h4 className="text-xl font-bold text-gray-800">سورة {getSurahName(task.block.surahId)}</h4>
                        <p className="text-sm text-gray-500">الآيات من {task.block.fromAyah} إلى {task.block.toAyah}</p>
                      </div>

                      <div className="relative flex items-center justify-center">
                        <svg className="w-36 h-36 transform -rotate-90">
                          <circle cx="72" cy="72" r="64" stroke="#e1e8e4" strokeWidth="6" fill="transparent" />
                          <circle cx="72" cy="72" r="64" stroke="#10b981" strokeWidth="6" fill="transparent" strokeDasharray={2 * Math.PI * 64} strokeDashoffset={2 * Math.PI * 64 * (1 - pct / 100)} className="transition-all duration-300" />
                        </svg>
                        <button
                          onClick={() => onDecrementRepetition(task.block.id)}
                          disabled={isTargetMet}
                          className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all ${isTargetMet ? "bg-emerald-100 text-emerald-800" : "bg-emerald-700 text-white shadow-md"}`}
                        >
                          {isTargetMet ? <Check className="w-8 h-8" /> : <span className="text-3xl font-bold">{remCount}</span>}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-serif font-bold text-emerald-900">🕌 مواقيت الصلاة</h3>
                <button onClick={onDetectLocation} disabled={gpsLoading} className="p-1 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-1 transition">
                  <Compass className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                  <span>GPS</span>
                </button>
              </div>
              <div className="space-y-2">
                {prayerTimesList.map((p) => (
                  <div key={p.name} className="flex items-center justify-between text-xs p-2 rounded-xl bg-gray-50">
                    <span className="font-semibold">{p.arabicName}</span>
                    <span className="font-mono">{p.time.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
            <h3 className="text-lg font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>📊 الإحصائيات والتقدم العام</span>
              <Activity className="w-5 h-5 text-emerald-600" />
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500">إجمالي الحفظ</p>
                <p className="text-lg font-bold text-emerald-900">{memorizedVersesCount} آية</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500">نسبة الختمة</p>
                <p className="text-lg font-bold text-emerald-900">{quranCompletionPercent}%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500">المراجعات المكتملة</p>
                <p className="text-lg font-bold text-emerald-900">{totalCompletedReviewsCount}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500">أيام الاستمرار</p>
                <p className="text-lg font-bold text-amber-600">{userProfile.streakDays} يوم</p>
              </div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4 text-right">
            <h3 className="text-xl font-serif font-bold text-emerald-900 border-b border-gray-100 pb-3">📅 جدول مراجعات اليوم</h3>
            {todayTasks.filter(t => t.type === "review").length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-gray-500">
                <CheckCircle className="w-8 h-8 text-emerald-600/35" />
                <p className="text-sm font-semibold">الحمد لله! لا توجد مراجعات مستحقة اليوم.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todayTasks.filter(t => t.type === "review").map((task: any) => (
                  <div key={task.block.id} className={`p-4 rounded-2xl border flex items-center justify-between ${task.isCompleted ? "bg-emerald-50/40 opacity-75" : "bg-white border-gray-200"}`}>
                    <div className="text-right">
                      <h4 className="text-sm font-bold">سورة {getSurahName(task.block.surahId)}</h4>
                      <p className="text-xs text-gray-500">آية {task.block.fromAyah}-{task.block.toAyah} (يوم {task.offset})</p>
                    </div>
                    <button onClick={() => onToggleReviewComplete(task.block.id)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${task.isCompleted ? "bg-emerald-600 text-white" : "bg-white border text-gray-700"}`}>
                      {task.isCompleted ? "تمت" : "إتمام"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Home;
