import { RootState } from 'store/store';
import { Task } from 'Types';

export const selectTasks = (state: RootState): Task[] => (
  state.tasks
);

export const isSignIn = (state: RootState): boolean => (
  state.auth != null
);
