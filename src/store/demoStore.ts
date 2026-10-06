import { create } from 'zustand';
import { setForceNetworkError, isForceNetworkError } from '../lib/api';
import { resetMockDb } from '../data/mockDb';

export interface DemoStoreState {
  demoToolbarOpen: boolean;
  tipDismissed: boolean;
  forcedError: boolean;
  reducedMotion: boolean;
  skipLoader: boolean;
  toggleDemoToolbar: () => void;
  dismissTip: () => void;
  toggleForcedError: () => void;
  toggleReducedMotion: () => void;
  setSkipLoader: (skip: boolean) => void;
  resetAllDemoData: () => void;
}

export const useDemoStore = create<DemoStoreState>((set) => ({
  demoToolbarOpen: false,
  tipDismissed: false,
  forcedError: isForceNetworkError(),
  reducedMotion: false,
  skipLoader: typeof window !== 'undefined' && sessionStorage.getItem('kestrel_skip_loader') === 'true',

  toggleDemoToolbar: () => set((s) => ({ demoToolbarOpen: !s.demoToolbarOpen })),
  dismissTip: () => set({ tipDismissed: true }),
  
  toggleForcedError: () => {
    set((s) => {
      const next = !s.forcedError;
      setForceNetworkError(next);
      return { forcedError: next };
    });
  },

  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),

  setSkipLoader: (skip) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kestrel_skip_loader', skip ? 'true' : 'false');
    }
    set({ skipLoader: skip });
  },

  resetAllDemoData: () => {
    resetMockDb();
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('kestrel_skip_loader');
      window.location.reload();
    }
  }
}));
