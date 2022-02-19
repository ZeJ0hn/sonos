import axios from 'axios';
import { Task } from 'Types';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export const getTasks = (): Promise<Task[]> => {
    return instance.get("/api/tasks", ).then((response) => {
        const { data } = response;
        return data as Task[];
    });
}

export const getTaskByID = (id: number): Promise<Task> => {
    return instance.get(`/api/tasks/${id}`, ).then((response) => {
        const { data } = response;
        return data as Task;
    });
}

export const postTask = (name: string): Promise<number> => {
    return instance.post("/api/tasks/create", {
        name: name
    }).then((response) => {
        const { data } = response;
        return data.id;
    });
}