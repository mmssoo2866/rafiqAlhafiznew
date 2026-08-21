import React from "react";
import { motion } from "motion/react";
import { Info } from "lucide-react";
import { UserProfile } from "../storage";

interface OnboardingProps {
  onSubmit: (data: Partial<UserProfile>) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    onSubmit({
      name: (data.get("name") as string) || "عبد الله",
      gender: (data.get("gender") as "male" | "female") || "male",
      prayerRole: (data.get("prayerRole") as "imam" | "maamoom") || "imam",
      useSunnah: data.get("useSunnah") === "on",
      nightPrayerRakats: Number(data.get("nightPrayerRakats")) || 8,
      memorizationDirection: (data.get("direction") as "forward" | "backward") || "forward",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-emerald-100"
      >
        <div className="bg-emerald-800 text-white p-6 text-center space-y-2">
          <h2 className="text-2xl font-bold font-serif">مرحباً بك في رفيق الحافظ 📖</h2>
          <p className="text-emerald-100 text-sm">مساعدك الذكي والمبتكر ومحركك التفاعلي لتثبيت كتاب الله الممتد بالتكرار المتباعد والربط مع الركعات والصلوات</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto" dir="rtl">
          <div className="space-y-1 text-right">
            <label className="text-sm font-semibold text-gray-700">الاسم الكريم</label>
            <input
              type="text"
              name="name"
              placeholder="اكتب اسمك هنا"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50 text-right"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-right">
              <label className="text-sm font-semibold text-gray-700">الجنس</label>
              <select name="gender" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div className="space-y-1 text-right">
              <label className="text-sm font-semibold text-gray-700">دور الصلاة</label>
              <select name="prayerRole" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50">
                <option value="imam">إمام (أقرأ جهراً وسراً)</option>
                <option value="maamoom">مأموم (أستمع جهراً وأقرأ سراً)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-right">
              <label className="text-sm font-semibold text-gray-700">ركعات قيام الليل</label>
              <select name="nightPrayerRakats" defaultValue="8" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50">
                <option value="2">ركعتان</option>
                <option value="4">4 ركعات</option>
                <option value="8">8 ركعات (مستحسن)</option>
                <option value="11">11 ركعة</option>
              </select>
            </div>
            <div className="space-y-1 text-right">
              <label className="text-sm font-semibold text-gray-700">اتجاه خطة الحفظ</label>
              <select name="direction" className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-gray-50">
                <option value="forward">من الفاتحة إلى الناس</option>
                <option value="backward">من الناس إلى الفاتحة (الحفظ العكسي)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse pt-2">
            <input type="checkbox" name="useSunnah" id="useSunnah" defaultChecked className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
            <label htmlFor="useSunnah" className="text-sm text-gray-600 font-medium select-none">
              تفصيل مراجعات الصلاة ليشمل السنن والرواتب المؤكدة
            </label>
          </div>

          <div className="bg-emerald-50 p-3 rounded-2xl text-xs text-emerald-800 flex items-start space-x-2 space-x-reverse text-right">
            <Info className="w-4 h-4 shrink-0 text-emerald-600" />
            <p>تخطيط رفيق الحافظ يعتمد بالكامل على تثبيت الحفظ عبر توزيعه آلياً في ركعات اليوم، مما يجعل المراجعة عملية عبادية مستمرة مدمجة بنشاطك اليومي.</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            حفظ الإعدادات وبدء الرحلة المباركة 🚀
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
