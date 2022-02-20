import { getAudioByID, getAudios, getTaskByID, getTasks, postAudio, postTask } from "services/Api";
import { Task } from "Types";
import { addAudios, addTask, setAudios, setCurrent, setTasks } from "./reducer";
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

export const createAudios = (task: Task, files: FileList): AppThunk<Promise<void>> => async dispatch => {
    Promise.all(Array.from(files).map((f) => {
        const data = new FormData();
        data.append(f.name, f); 
        return postAudio(task.id, data)
            .then((id) => getAudioByID(task.id, id));
    })).then((audios) => dispatch(addAudios(audios)));
};

export const fetchCurrent = (task: Task): AppThunk<Promise<void>> => async dispatch => {
    dispatch(setCurrent(task));
    getAudios(task.id).then((audios) => dispatch(setAudios(audios)))
};
