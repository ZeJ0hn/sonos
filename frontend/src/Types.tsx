export enum Status {
    None = "None",
    Done = "Done",
    Skip = "Skip",
}

export interface Task {
    id: string,
    name: string,
    processed: boolean,
}

export interface Audio {
    id: string,
    name: string,
    status: Status,
}