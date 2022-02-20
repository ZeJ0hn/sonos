import axios from 'axios';
import { Audio, Task } from 'Types';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

export const getTasks = async (): Promise<Task[]> => {
    const response = await instance.get("/api/tasks");
    const { data } = response;
    return data as Task[];
}

export const getTaskByID = async (id: number): Promise<Task> => {
    const response = await instance.get(`/api/tasks/${id}`);
    const { data } = response;
    return data as Task;
}

export const postTask = async (name: string): Promise<number> => {
    const response = await instance.post("/api/tasks/create", {
        name: name
    });
    const { data } = response;
    return data.id;
}

export const postAudio = async (taskId: number, audio: FormData): Promise<number> => {
    const response = await instance.post(`/api/tasks/${taskId}/audios/create`, audio);
    const { data } = response;
    return data.id;
}

export const getAudios = async (taskId: number): Promise<Audio[]> => {
    const response = await instance.get(`/api/tasks/${taskId}/audios`);
    const { data } = response;
    return data as Audio[];
}

export const getAudioByID = async (taskId: number, id: number): Promise<Audio> => {
    const response = await instance.get(`/api/tasks/${taskId}/audios/${id}`);
    const { data } = response;
    return data as Audio;
}
