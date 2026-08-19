import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { PageProps } from "../types";
import { SURAHS, getSurahById } from "../quranData";

interface MushafProps extends PageProps {
  mushafPage: number;
  setMushafPage: (p: number) => void;
  mushafViewMode: "image" | "offline";
  setMushafViewMode: (m: "image" | "offline") => void;
}

const Mushaf: React.FC<MushafProps> = ({ state, mushafPage, setMushafPage, mushafViewMode, setMushafViewMode, onUpdateState }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 text-right" dir="rtl"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-500/10 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-serif font-bold text-emerald-900">📘 المصحف الشريف</h3>
          <div className="flex gap-2">
            <button onClick={() => setMushafViewMode("image")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${mushafViewMode === "image" ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-600"}`}>مصور</button>
            <button onClick={() => setMushafViewMode("offline")} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${mushafViewMode === "offline" ? "bg-emerald-800 text-white" : "bg-gray-100 text-gray-600"}`}>فهرس</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400">انتقال للسورة</label>
            <select
              value={SURAHS.find(s => mushafPage >= s.startPage)?.id || 1}
              onChange={(e) => setMushafPage(getSurahById(Number(e.target.value))?.startPage || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-xs font-bold"
            >
              {SURAHS.map(s => <option key={s.id} value={s.id}>{s.id}. {s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400">رقم الصفحة (1-610)</label>
            <input type="number" value={mushafPage} onChange={(e) => setMushafPage(Math.max(1, Math.min(610, Number(e.target.value))))} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-center font-mono font-bold" />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                const isCached = state.mushafCache.includes(mushafPage);
                const updated = { ...state, mushafCache: isCached ? state.mushafCache.filter(p => p !== mushafPage) : [...state.mushafCache, mushafPage] };
                onUpdateState(updated);
              }}
              className={`w-full py-2 px-3 border rounded-xl text-xs font-bold transition ${state.mushafCache.includes(mushafPage) ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-white border-gray-300 text-gray-500"}`}
            >
              {state.mushafCache.includes(mushafPage) ? "محفوظة ✓" : "حفظ الصفحة"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#f0ede6] min-h-[600px] border-4 border-[#3a352c]/20 shadow-lg rounded-3xl p-4 flex justify-between items-center gap-4 relative">
        <button onClick={() => mushafPage > 1 && setMushafPage(mushafPage - 1)} className="p-3 bg-[#e2dec9] hover:bg-[#d5d0b6] rounded-full shadow-inner"><ChevronRight className="w-6 h-6" /></button>
        <div className="flex-1 w-full bg-white rounded-2xl shadow-sm p-4 min-h-[500px] flex flex-col justify-center items-center overflow-hidden">
          {mushafViewMode === "image" ? (
            <img src={`https://android.quran.com/data/single_page/images_1920/page${String(mushafPage).padStart(3, "0")}.png`} alt={`Page ${mushafPage}`} className="max-h-[75vh] w-auto object-contain select-none" />
          ) : (
            <div className="p-4 text-center space-y-4">
              <span className="text-4xl opacity-10">📖</span>
              <p className="text-gray-400 font-bold">يرجى استخدام الوضع "المصور" للقراءة، أو اختيار سورة من القائمة.</p>
            </div>
          )}
        </div>
        <button onClick={() => mushafPage < 610 && setMushafPage(mushafPage + 1)} className="p-3 bg-[#e2dec9] hover:bg-[#d5d0b6] rounded-full shadow-inner"><ChevronLeft className="w-6 h-6" /></button>
      </div>
    </motion.div>
  );
};

export default Mushaf;
