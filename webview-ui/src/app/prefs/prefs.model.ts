import { StopwatchFilter, defaultFilter } from "../stopwatches/stopwatch.model";

export interface Prefs {
  filter: StopwatchFilter;
  keybinds: Keybinds;
  showStats: boolean;
  showPauses: boolean;
  showBulkActions: boolean;
  confirmDelete: boolean;
}

export interface Keybinds {
  deleteAll: string;
  pauseAll: string;
  resumeAll: string;
  stopAll: string;
  toggleDrawer: string;
  confirmDelete: boolean;
  submit: string;
}

const defaultKeybinds: Keybinds = {
  deleteAll: "alt.backspace",
  pauseAll: "alt.p",
  resumeAll: "alt.r",
  stopAll: "alt.enter.s",
  toggleDrawer: "alt.d",
  confirmDelete: true,
  submit: "alt.enter",
};

export const defaultPrefs: Prefs = {
  filter: defaultFilter,
  keybinds: defaultKeybinds,
  showPauses: true,
  showStats: true,
  showBulkActions: true,
  confirmDelete: true,
};

/**
 * ! right now we only take the following prefs into account:
 * - show stats
 * - show bulk actions
 * - show pauses
 * */
