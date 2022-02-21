import { ModalContent } from 'components/Modal';
import { RootState } from 'store/store';
import { Sound, Task } from 'Types';

export const selectModal = (state: RootState): ModalContent | undefined => (
  state.modal
);

export const selectTasks = (state: RootState): Task[] => (
  state.tasks
);

export const selectCurrent = (state: RootState): Task | undefined => (
  state.current
);

export const isSignIn = (state: RootState): boolean => (
  state.auth != null
);

export const selectSounds  = (state: RootState): Sound[] | undefined => (
  state.sounds
);

export const selectTrack = (sound: Sound) => (state: RootState): Blob | undefined => (
  state.track[sound.id]
);
