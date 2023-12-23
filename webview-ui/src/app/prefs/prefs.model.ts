import { StopwatchFilter, defaultFilter } from "../stopwatches/stopwatch.model";

export interface Prefs {
  filter: StopwatchFilter;
  keybinds: Keybinds;
  showStats: boolean;
  showPauses: boolean;
  showBulkActions: boolean;
}

export interface Keybinds {
  deleteAll: string;
  pauseAll: string;
  resumeAll: string;
  stopAll: string;
  toggleDrawer: string;
  submit: string;
}

const defaultKeybinds: Keybinds = {
  deleteAll: "alt.backspace",
  pauseAll: "alt.p",
  resumeAll: "alt.r",
  stopAll: "alt.enter.s",
  toggleDrawer: "alt.d",
  submit: "alt.enter",
};

export const defaultPrefs: Prefs = {
  filter: defaultFilter,
  keybinds: defaultKeybinds,
  showPauses: true,
  showStats: true,
  showBulkActions: true,
};

export interface KeybindPressEvent {
  event: KeyboardEvent;
  keybind: string;
}
