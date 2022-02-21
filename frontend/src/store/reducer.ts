import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ModalContent } from 'components/Modal';
import { Task, Sound } from 'Types';

// export enum Status {
//     DEFAULT = 'default',
//     LOADING = 'loading',
//     SUCCESS = 'success',
//     FAILURE = 'failure'
//   }

export type State = {
    tasks: Task[],
    current: Task | undefined,
    // imagesStatus: Status,
    sounds: Sound[] | undefined,
    // exhibitionsStatus: Status,
    auth: string | undefined,
    modal: ModalContent | undefined,
    track: {
        [key: string]: Blob
    }
};

const initialState: State = {
    tasks: [],
    current: undefined,
    // imagesStatus: Status.DEFAULT,
    sounds: undefined,
    // exhibitionsStatus: Status.DEFAULT,
    auth: undefined,
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
        // addExhibition: (state, action: PayloadAction<Exhibition>) => {
        //     state.exhibitions = [action.payload, ...state.exhibitions]
        // },
        // fetchImagesStart: (state) => {
        //     state.imagesStatus = Status.LOADING;
        // },
        // fetchImagesSuccess: (state, action: PayloadAction<Image[]>) => {
        //     state.images = action.payload;
        //     state.imagesStatus = Status.SUCCESS;
        // },
        // fetchImagesFailure: (state, action: PayloadAction<string>) => {
        //     state.imagesStatus = Status.FAILURE;
        // },
        // fetchExhibitionsStart: (state) => {
        //     state.exhibitionsStatus = Status.LOADING;
        // },
        // fetchExhibitionsSuccess: (state, action: PayloadAction<Exhibition[]>) => {
        //     state.exhibitions = action.payload;
        //     state.exhibitionsStatus = Status.SUCCESS;
        // },
        // fetchExhibitionsFailure: (state, action: PayloadAction<string>) => {
        //     state.exhibitionsStatus = Status.FAILURE;
        // },
        setAuth: (state, action: PayloadAction<string | undefined>) => {
            state.auth = action.payload;
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
    setAuth 
} = slice.actions

export default slice.reducer