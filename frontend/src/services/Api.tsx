import axios from 'axios';
import { Annotations, Sound, Task } from 'Types';

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

export const postSound = async (taskId: number, audio: FormData): Promise<number> => {
    const response = await instance.post(`/api/tasks/${taskId}/audios/create`, audio);
    const { data } = response;
    return data.id;
}

export const getSounds = async (taskId: number): Promise<Sound[]> => {
    const response = await instance.get(`/api/tasks/${taskId}/audios`);
    const { data } = response;
    return data as Sound[];
}

export const getSoundByID = async (taskId: number, id: number): Promise<Sound> => {
    const response = await instance.get(`/api/tasks/${taskId}/audios/${id}`);
    const { data } = response;
    return data as Sound;
}

export const getData = async (taskId: number, id: number): Promise<Blob> => {
    const response = await instance.get(`/api/tasks/${taskId}/audios/${id}/track`, {
        responseType: 'blob',
      });
    const { data } = response;
    return data as Blob;
}

export const postAnnotatinos = async (taskId: number, id: number, annotations: Annotations): Promise<void> => {
    await instance.post(`/api/tasks/${taskId}/audios/${id}/annotate`, annotations);
}

export const postDone = async (taskId: number, id: number): Promise<void> => {
    await instance.post(`/api/tasks/${taskId}/audios/${id}/done`);
}

export const postSkip = async (taskId: number, id: number): Promise<void> => {
    await instance.post(`/api/tasks/${taskId}/audios/${id}/skip`);
}

