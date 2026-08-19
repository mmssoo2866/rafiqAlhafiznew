import { useState, useCallback } from "react";
import { AppState, UserProfile, loadAppState, saveAppState, logActivity, getLocalDateKey, MemorizationBlock, CompletedReviews } from "../storage";
import { getSurahById, getSurahName } from "../quranData";

export const useAppActions = () => {
  const [state, setState] = useState<AppState | null>(null);

  const updateState = useCallback((updated: AppState) => {
    setState(updated);
    saveAppState(updated);
  }, []);

  const handleDecrementRepetition = useCallback((blockId: string) => {
    if (!state) return;
    const currentVal = state.repetitions[blockId] !== undefined ? state.repetitions[blockId] : 100;
    if (currentVal <= 0) return;

    const newVal = currentVal - 1;
    let updatedState = {
      ...state,
      repetitions: {
        ...state.repetitions,
        [blockId]: newVal
      }
    };

    if (newVal === 0) {
      const block = state.blocks.find(b => b.id === blockId);
      const sName = block ? getSurahName(block.surahId) : "";
      updatedState = logActivity(updatedState, "إكمال تكرار الحفظ", `تبارك الله! أكملت التكرار لمقرر سورة ${sName} بنجاح.`);
    }

    updateState(updatedState);
  }, [state, updateState]);

  const handleToggleReviewComplete = useCallback((blockId: string) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const todayList = state.completedReviews[todayStr] ? [...state.completedReviews[todayStr]] : [];
    const isCompleted = todayList.includes(blockId);

    let updatedList: string[];
    let title: string;
    let desc: string;

    const block = state.blocks.find(b => b.id === blockId);
    const surahName = block ? getSurahName(block.surahId) : "";

    if (isCompleted) {
      updatedList = todayList.filter(id => id !== blockId);
      title = "إلغاء مراجعة";
      desc = `تم التراجع عن إكمال مراجعة سورة ${surahName}`;
    } else {
      updatedList = [...todayList, blockId];
      title = "إنجاز مراجعة";
      desc = `تم إتمام المراجعة اليومية لسورة ${surahName}`;
    }

    const updatedState = {
      ...state,
      completedReviews: {
        ...state.completedReviews,
        [todayStr]: updatedList
      }
    };

    updateState(logActivity(updatedState, title, desc));
  }, [state, updateState]);

  const handleUpdateReviewProgress = useCallback((index: number) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const updatedState = {
      ...state,
      reviewProgress: {
        ...state.reviewProgress,
        [todayStr]: index
      }
    };
    updateState(updatedState);
  }, [state, updateState]);

  const handleCompleteDay66 = useCallback(() => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const updatedState = {
      ...state,
      fullReviewDates: [...(state.fullReviewDates || []), todayStr]
    };
    updateState(logActivity(updatedState, "إكمال يوم المراجعة الكبرى", "تم إكمال مراجعة اليوم 66 بنجاح واستئناف خطة الحفظ."));
  }, [state, updateState]);

  const handleAddHifz = useCallback((surahId: number, fromAyah: number, toAyah: number, repetitions: number) => {
    if (!state) return;
    const todayStr = getLocalDateKey();
    const newBlock: MemorizationBlock = {
      id: `block-${Date.now()}`,
      surahId,
      fromAyah,
      toAyah,
      repetitionTarget: repetitions,
      startDate: todayStr,
      status: "active"
    };

    const updatedState: AppState = {
      ...state,
      blocks: [newBlock, ...state.blocks],
      repetitions: {
        ...state.repetitions,
        [newBlock.id]: repetitions
      }
    };
    updateState(logActivity(updatedState, "إضافة مقرر جديد", `تم تسجيل سورة ${getSurahName(surahId)}.`));
  }, [state, updateState]);

  const handleDeleteBlock = useCallback((blockId: string) => {
    if (!state) return;
    const filteredBlocks = state.blocks.filter(b => b.id !== blockId);
    const updatedState = { ...state, blocks: filteredBlocks };
    updateState(logActivity(updatedState, "حذف مقرر", "تم حذف المقرر بنجاح."));
  }, [state, updateState]);

  const handleToggleBlockStatus = useCallback((blockId: string) => {
    if (!state) return;
    const updatedBlocks = state.blocks.map(b => b.id === blockId ? { ...b, status: b.status === "active" ? "completed" : "active" as any } : b);
    updateState({ ...state, blocks: updatedBlocks });
  }, [state, updateState]);

  const handleDetectLocation = useCallback(() => {
    if (!state || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const updated = { ...state, profile: { ...state.profile!, lat: pos.coords.latitude, lng: pos.coords.longitude } };
      updateState(logActivity(updated, "تحديث الموقع", "تم تحديث إحداثيات الموقع."));
    });
  }, [state, updateState]);

  return {
    state,
    setState,
    updateState,
    handleDecrementRepetition,
    handleToggleReviewComplete,
    handleUpdateReviewProgress,
    handleCompleteDay66,
    handleAddHifz,
    handleDeleteBlock,
    handleToggleBlockStatus,
    handleDetectLocation
  };
};
