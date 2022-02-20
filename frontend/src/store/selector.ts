import { RootState } from 'store/store';
import { Audio, Task } from 'Types';

export const selectTasks = (state: RootState): Task[] => (
  state.tasks
);

export const selectCurrent = (state: RootState): Task | undefined => (
  state.current
);

export const isSignIn = (state: RootState): boolean => (
  state.auth != null
);

export const selectAudios  = (state: RootState): Audio[] | undefined => (
  state.audios
);
