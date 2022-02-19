import { getTaskByID, getTasks, postTask } from "services/Api";
import { addTask, setTasks } from "./reducer";
import { AppThunk } from "./store";

export const fetchTasks = (): AppThunk<Promise<void>> => async dispatch => {
    getTasks().then((tasks) => dispatch(setTasks(tasks)))
};

export const createTask = (name: string, files: FileList | undefined): AppThunk<Promise<void>> => async dispatch => {

    return postTask(name)
    .then((id) => getTaskByID(id))
    .then((task) => {
        dispatch(addTask(task));
        return task.id;
        // TODO Upload
    }).then((id) => {

    });
  };