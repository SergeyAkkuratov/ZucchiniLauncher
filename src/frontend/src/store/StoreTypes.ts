export interface TestParameters {
    priority: string;
    glue: string;
    threads: string;
    plugin: string[];
    featuresPath: string;
    owner: string;
    tags: string;
    timeout: string;
}

export interface Task {
    id: string;
    parameters: TestParameters;
    priority: number;
}

export interface TaskState {
    tasks: Task[];
}