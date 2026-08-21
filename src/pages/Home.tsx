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
  onUpdateProfile: (changes: any) => void;
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
  onCompleteKhatmahReview,
  onUpdateProfile
}) => {
  const userProfile = state.profile!;
  const memorizedVersesCount = state.blocks.reduce((sum, b) => sum + (b.toAyah - b.fromAyah + 1), 0);
  const quranCompletionPercent = ((memorizedVersesCount / 6236) * 100).toFixed(1);
  const totalCompletedReviewsCount = Object.values(state.completedReviews).reduce((sum: number, arr) => sum + (arr as string[]).length, 0);

  // Time-based Focus logic: Find current/next prayer
  const now = new Date();
  const getActivePrayer = () => {
    // 1. Check standard prayers from adhan
    const upcoming = prayerTimesList.find(p => p.time > now);
    if (!upcoming) return "العشاء"; // Default to Isha/Qiyam at night

    // 2. Early morning check
    const fajr = prayerTimesList.find(p => p.name === "Fajr");
    if (fajr && now < fajr.time) return "الفجر";

    // 3. Mapping
    const mapping: Record<string, string> = {
      "Fajr": "الفجر",
      "Dhuhr": "الظهر",
      "Asr": "العصر",
      "Maghrib": "المغرب",
      "Isha": "العشاء"
    };
    return mapping[upcoming.name] || "الظهر";
  };

  const activePrayerName = getActivePrayer();
  const activeSlots = distributionSlots.filter(s => s.parentPrayer === activePrayerName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* 1. DYNAMIC FOCUS CARD: Shows review for CURRENT/NEXT prayer */}
      {distributionSlots.length > 0 && (
        <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full -ml-16 -mt-16"></div>
          <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/30">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-emerald-100">ورد الصلاة القادمة</h3>
                  <p className="text-xl font-bold font-serif">{activePrayerName}</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[10px] bg-emerald-800 px-2 py-1 rounded-lg border border-emerald-700 font-bold text-emerald-300 uppercase">الآن</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {activeSlots.length === 0 ? (
                <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/50 text-center">
                  <p className="text-xs text-emerald-300 italic">لا يوجد ورد مراجعة مخصص لصلاة {activePrayerName} حالياً.</p>
                </div>
              ) : (
                activeSlots.map((slot) => (
                  <div key={slot.id} className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/20 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-300">
                        {slot.rakahNumber}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-emerald-300 font-bold">{slot.prayerName}</p>
                        <h4 className="text-xs font-bold text-white">{slot.assignedContent}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                         const match = slot.assignedContent.match(/سورة ([\u0600-\u06FF]+)(?:\s+\((\d+))?/);
                         const pageMatch = slot.assignedContent.match(/ص (\d+)/);
                         if (pageMatch) {
                            onToggleTab("mushaf");
                         } else if (match) {
                            const found = SURAHS.find(s => s.name === match[1]);
                            if (found) onNavigateToMushaf(found.id, match[2] ? Number(match[2]) : 1);
                         }
                      }}
                      className="p-2 hover:bg-amber-500 hover:text-emerald-950 rounded-xl transition-colors text-amber-400"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onToggleTab("review")}
              className="w-full py-3 bg-emerald-800/50 hover:bg-emerald-800 border border-emerald-700 rounded-2xl text-xs font-bold text-emerald-200 transition-colors"
            >
              عرض الجدول الكامل للمراجعة ➔
            </button>
          </div>
        </div>
      )}

      {/* ... Day 66 logic ... */}
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
          <div className="bg-emerald-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30">
                  <Activity className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">لوحة التحكم (مسار المراجعة)</h3>
                  <p className="text-xs text-emerald-200">إدارة ورد الختمة اليومي</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase">نقطة البداية الحالية</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={userProfile.reviewOnlyCurrentPage}
                      onChange={(e) => onUpdateProfile({ reviewOnlyCurrentPage: Number(e.target.value) })}
                      className="bg-emerald-800/50 border border-emerald-700 rounded-xl px-4 py-2 w-full font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <button onClick={() => onToggleTab("mushaf")} className="bg-amber-500 text-emerald-950 p-2 rounded-xl hover:bg-amber-400 transition"><BookOpen className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-emerald-300 uppercase">مقدار الورد اليومي (صفحات)</label>
                  <select
                    value={userProfile.reviewOnlyDailyAmountValue}
                    onChange={(e) => onUpdateProfile({ reviewOnlyDailyAmountValue: Number(e.target.value) })}
                    className="bg-emerald-800/50 border border-emerald-700 rounded-xl px-4 py-2 w-full font-bold outline-none"
                  >
                    {[1, 2, 5, 10, 20, 30, 40, 60].map(v => <option key={v} value={v} className="bg-emerald-900">{v} صفحات</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>الإنجاز اليومي</span>
            </h3>
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                 <p className="text-sm text-emerald-800 font-medium">مقرر مراجعة اليوم</p>
                 <h4 className="text-xl font-bold text-emerald-950 mt-1">
                   {userProfile.reviewOnlyDirection === "forward" ? "من" : "للخلف من"} الصفحة {userProfile.reviewOnlyCurrentPage}
                 </h4>
              </div>
              <button
                onClick={onCompleteKhatmahReview}
                disabled={state.profile?.reviewOnlyCompletedDates?.includes(todayStr)}
                className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                  state.profile?.reviewOnlyCompletedDates?.includes(todayStr)
                  ? "bg-emerald-100 text-emerald-700 cursor-not-allowed"
                  : "bg-emerald-700 text-white hover:bg-emerald-800 hover:scale-[1.02]"
                }`}
              >
                {state.profile?.reviewOnlyCompletedDates?.includes(todayStr) ? "تم إتمام الورد اليوم ✨" : "إتمام ورد المراجعة اليوم ✅"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-serif font-bold text-emerald-900">🕌 مواقيت الصلاة</h3>
              <button onClick={onDetectLocation} disabled={gpsLoading} className="p-1 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs flex items-center gap-1 transition">
                <Compass className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                <span>تحديث GPS</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {prayerTimesList.map((p) => (
                <div key={p.name} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-500 font-bold">{p.arabicName}</span>
                  <span className="text-sm font-mono font-bold text-emerald-900">{p.time.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
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
