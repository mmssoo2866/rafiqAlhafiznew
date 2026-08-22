import { AppState, MemorizationBlock, UserProfile } from "../storage";
import { ScheduledTask } from "../scheduler";
import { DistributedSlot } from "../prayerEngine";

export type TabType = "home" | "hifz" | "review" | "calendar" | "mushaf" | "settings" | "about";

export interface PageProps {
  state: AppState;
  todayStr: string;
  onUpdateState: (updated: AppState) => void;
  onNavigateToMushaf: (surahId: number, ayahNum: number) => void;
  onToggleTab: (tab: TabType) => void;
}
