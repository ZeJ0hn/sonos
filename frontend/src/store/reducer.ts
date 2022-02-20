import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Task, Audio } from 'Types';

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
    audios: Audio[] | undefined,
    // exhibitionsStatus: Status,
    auth: string | undefined
};

const initialState: State = {
    tasks: [],
    current: undefined,
    // imagesStatus: Status.DEFAULT,
    audios: undefined,
    // exhibitionsStatus: Status.DEFAULT,
    auth: undefined
};

export const slice = createSlice({
    name: 'slice',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks = [action.payload, ...state.tasks];
        },
        setAudios: (state, action: PayloadAction<Audio[]>) => {
            state.audios = action.payload;
        },
        addAudios: (state, action: PayloadAction<Audio[]>) => {
            state.audios = [...action.payload, ...(state.audios || [])];
        },
        setCurrent: (state, action: PayloadAction<Task>) => {
            state.current = action.payload;
            state.audios = undefined;
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
    setTasks,
    addTask,
    setAudios,
    addAudios,
    setCurrent,

    setAuth 
} = slice.actions

export default slice.reducer