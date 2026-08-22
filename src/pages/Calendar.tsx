import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Book, RotateCcw, AlertCircle } from "lucide-react";
import { PageProps } from "../types";
import { getTasksForDate, hasDay66TriggerToday } from "../scheduler";
import { getSurahName } from "../quranData";

const Calendar: React.FC<PageProps> = ({ state, todayStr, onToggleTab, onNavigateToMushaf }) => {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const selectedDateTasks = useMemo(() => {
    return getTasksForDate(state, selectedDateStr);
  }, [state, selectedDateStr]);

  const isDay66 = useMemo(() => {
    return hasDay66TriggerToday(state, selectedDateStr);
  }, [state, selectedDateStr]);

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  }, [viewDate]);

  const monthName = viewDate.toLocaleString("ar-SA", { month: "long" });
  const yearName = viewDate.getFullYear();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const getHijriDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const renderDay = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    const isSelected = selectedDateStr === dateStr;
    const isToday = todayStr === dateStr;
    const tasks = getTasksForDate(state, dateStr);
    const hasHifz = tasks.some(t => t.type === "memorization");
    const hasReview = tasks.some(t => t.type === "review");
    const hasIntensive = tasks.some(t => t.type === "review" && t.offset <= 10);
    const hasFullReview = hasDay66TriggerToday(state, dateStr);

    return (
      <button
        key={day}
        onClick={() => setSelectedDateStr(dateStr)}
        className={`relative h-14 w-full flex flex-col items-center justify-center rounded-2xl transition-all border ${
          isSelected
            ? "bg-emerald-700 text-white border-emerald-800 shadow-md scale-105 z-10"
            : isToday
              ? "bg-amber-50 text-emerald-950 border-amber-200"
              : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
        }`}
      >
        <span className="text-sm font-bold">{day}</span>
        <div className="flex gap-0.5 mt-1">
          {hasHifz && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} title="حفظ" />}
          {hasReview && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-blue-400"}`} title="مراجعة" />}
          {hasIntensive && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/50" : "bg-orange-400"}`} title="مكثفة" />}
          {hasFullReview && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/30" : "bg-purple-500"}`} title="كبرى" />}
        </div>
      </button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right"
      dir="rtl"
    >
      {/* CALENDAR HEADER & GRID */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-emerald-950">{monthName} {yearName}</h3>
              <p className="text-[10px] text-emerald-600 font-bold">{getHijriDate(viewDate)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronRight className="w-5 h-5" /></button>
            <button onClick={() => setViewDate(new Date())} className="px-3 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl">اليوم</button>
            <button onClick={handleNextMonth} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-600"><ChevronLeft className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["ح", "ن", "ث", "ر", "خ", "ج", "س"].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-gray-400 pb-2">{d}</div>
          ))}
          {Array.from({ length: daysInMonth.firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14" />
          ))}
          {Array.from({ length: daysInMonth.totalDays }).map((_, i) => renderDay(i + 1))}
        </div>
      </div>

      {/* SELECTED DAY PLAN */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-6">
        <div className="border-b pb-4">
          <h4 className="text-xl font-serif font-bold text-emerald-950">📅 خطة يوم {selectedDateStr.split('-')[2]} {monthName}</h4>
          <p className="text-xs text-gray-400 mt-1">{getHijriDate(new Date(selectedDateStr))}</p>
        </div>

        {isDay66 && (
          <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-900">يوم مراجعة كبرى (اليوم 66) - يتوقف الحفظ الجديد</span>
          </div>
        )}

        <div className="space-y-6">
          {/* MEMORIZATION SECTION */}
          <section className="space-y-3">
            <h5 className="text-xs font-bold text-emerald-800 bg-emerald-50 inline-block px-3 py-1 rounded-full flex items-center gap-2">
              <Book className="w-3.5 h-3.5" />
              <span>الحفظ الجديد</span>
            </h5>
            {selectedDateTasks.filter(t => t.type === "memorization").length === 0 ? (
              <p className="text-xs text-gray-400 pr-4">لا يوجد مقرر حفظ جديد مجدول.</p>
            ) : (
              selectedDateTasks.filter(t => t.type === "memorization").map(t => (
                <div key={t.block.id} className="pr-4 border-r-2 border-emerald-100 py-1">
                  <p className="text-sm font-bold text-gray-800">سورة {getSurahName(t.block.surahId)}</p>
                  <p className="text-[10px] text-gray-500">الآيات: {t.block.fromAyah} - {t.block.toAyah} | التكرار: {t.block.repetitionTarget}</p>
                </div>
              ))
            )}
          </section>

          {/* REVIEW SECTION */}
          <section className="space-y-3">
            <h5 className="text-xs font-bold text-blue-800 bg-blue-50 inline-block px-3 py-1 rounded-full flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>المراجعة</span>
            </h5>
            {selectedDateTasks.filter(t => t.type === "review").length === 0 ? (
              <p className="text-xs text-gray-400 pr-4">لا توجد مراجعات مجدولة.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-4">
                {selectedDateTasks.filter(t => t.type === "review").map(t => (
                  <div key={t.block.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-bold text-gray-800">سورة {getSurahName(t.block.surahId)}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${t.offset <= 10 ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}`}>
                        يوم {t.offset}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">آية {t.block.fromAyah} - {t.block.toAyah}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Calendar;
