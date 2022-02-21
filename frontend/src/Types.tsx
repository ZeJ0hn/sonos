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
}