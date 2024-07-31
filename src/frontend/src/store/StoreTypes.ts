export interface TestParameters {
    priority?: string;
    glue?: string;
    threads?: string;
    plugin?: string[];
    featuresPath: string;
    owner?: string;
    tags: string;
    timeout: string;
}

export interface Task {
    id?: string;
    startTime?: string;
    parameters: TestParameters;
    priority?: number;
}

export interface TaskState {
    running: Task[];
    queued: Task[];
    finished: Task[];
}

export interface ZLError {
    name: string;
    message: string;
}

export interface ErrorState {
    newError: boolean;
    errors: ZLError[];
}

export interface UserState {
    username: string;
    role: string;
}

export interface FeaturesState {
    filenames: string[];
}

export type TaskType = "running" | "queued" | "finished";
