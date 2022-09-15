import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    sessions: [],
    addSession: (data) =>
      set((state) => {
        const sessions = state.sessions;
        sessions.push(data);
      }),
  }))
);

export const useSessions = useStore;
