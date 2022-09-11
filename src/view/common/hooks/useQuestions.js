import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    questions: [],
    addQuestions: (data) =>
      set((state) => {
        const questions = state.questions;
        questions.push({ name: data });
      }),
  }))
);

export const useQuestions = useStore;
