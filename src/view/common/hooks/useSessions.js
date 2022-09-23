import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    sessions: [],
    setSessions: (data) =>
      set((state) => {
        state.sessions = data;
      }),
    addSession: (data) =>
      set((state) => {
        const sessions = state.sessions;
        sessions.push(data);
      }),
    detailSession: {},
    setDetailSession: (data) => {
      set((state) => {
        state.detailSession = data;
      });
    },
  }))
);

export const useSessions = useStore;
