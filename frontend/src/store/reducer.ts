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
    task: Task | undefined,
    // imagesStatus: Status,
    audios: Audio[] | undefined,
    // exhibitionsStatus: Status,
    auth: string | undefined
};

const initialState: State = {
    tasks: [],
    task: undefined,
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
            state.tasks = action.payload
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks = [action.payload, ...state.tasks]
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
    // fetchImagesStart,
    // fetchImagesSuccess,
    // fetchImagesFailure,
    // fetchExhibitionsStart,
    // fetchExhibitionsSuccess,
    // fetchExhibitionsFailure,
    setAuth 
} = slice.actions

export default slice.reducer