import { getSoundByID, getSounds, getData, getTaskByID, getTasks, postSound, postTask } from "services/Api";
import { Sound, Task } from "Types";
import { addSound, addTask, setSounds, setCurrent, setTrack, setTasks } from "./reducer";
import { AppThunk } from "./store";

export const fetchTasks = (): AppThunk<Promise<void>> => async dispatch => {
    getTasks().then((tasks) => dispatch(setTasks(tasks)))
};

export const createTask = (name: string): AppThunk<Promise<Task>> => async dispatch => {
    return postTask(name)
    .then((id) => getTaskByID(id))
    .then((task) => {
        dispatch(addTask(task));
        return task;
    });
};

export const createSounds = (task: Task, files: FileList): AppThunk<Promise<void[]>> => async dispatch => {
    return Promise.all(Array.from(files).map((f) => {
        const data = new FormData();
        data.append(f.name, f); 
        return postSound(task.id, data)
            .then((id) => getSoundByID(task.id, id))
            .then((Sounds) => {
                dispatch(addSound(Sounds));
            });
    }));
};

export const fetchCurrent = (task: Task): AppThunk<Promise<void>> => async dispatch => {
    dispatch(setCurrent(task));
    return getSounds(task.id).then((Sounds) => {
        dispatch(setSounds(Sounds));
    })
};

export const fetchTrack  = (task: Task, sound: Sound): AppThunk<Promise<void>> => async dispatch => {
    return getData(task.id, sound.id).then((data) => {
        dispatch(setTrack({ sound, data }));
    })
};
