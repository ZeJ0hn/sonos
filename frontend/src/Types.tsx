export enum Status {
    None = "None",
    Done = "Done",
    Skip = "Skip",
}

export interface Task {
    id: number,
    name: string,
    processed: boolean,
}

export interface Sound {
    id: number,
    name: string,
    status: Status,
    annotations?: Annotations
}

export interface Annotations {
    wakeword_start: number,
    wakeword_end: number,
    utterance_start: number,
    utterance_end: number,
    text: string,
}

export type Range = {
    start: number;
    end: number;
}