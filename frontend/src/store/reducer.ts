import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalContent } from 'components/Modal';
import { Task, Sound } from 'Types';

export type State = {
    tasks: Task[],
    current: Task | undefined,
    sounds: Sound[] | undefined,
    modal: ModalContent | undefined,
    track: {
        [key: string]: Blob
    }
};

const initialState: State = {
    tasks: [],
    current: undefined,
    sounds: undefined,
    modal: undefined,
    track: {}
};

export const slice = createSlice({
    name: 'slice',
    initialState,
    reducers: {
        setModal: (state, action: PayloadAction<ModalContent>) => {
            state.modal = action.payload;
        },
        clearModal: (state) => {
            state.modal = undefined;
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks = [action.payload, ...state.tasks];
        },
        setSounds: (state, action: PayloadAction<Sound[]>) => {
            state.sounds = action.payload;
        },
        addSound: (state, action: PayloadAction<Sound>) => {
            state.sounds = [action.payload, ...(state.sounds || [])];
        },
        setSound: (state, action: PayloadAction<Sound>) => {
            const sounds = state.sounds?.filter(e => e.id !== action.payload.id) || [];
            sounds.push(action.payload);
            state.sounds = sounds;
        },
        setCurrent: (state, action: PayloadAction<Task>) => {
            state.current = action.payload;
            state.sounds = undefined;
            state.track = {}
        },
        setTrack: (state, action: PayloadAction<{ sound: Sound, data: Blob }>) => {
            state.track = {...state.track, [action.payload.sound.id]: action.payload.data};
        },
        clearCurrent: (state) => {
            state.current = undefined;
            state.sounds = undefined;
            state.track = {}
        },
    },
})

export const {
    setModal,
    clearModal,
    setTasks,
    addTask,
    setSounds,
    addSound,
    setSound,
    setCurrent,
    setTrack,
    clearCurrent
} = slice.actions

export default slice.reducer