interface Task {
    getMethod(): string;
    getStatus(): string;
    isRunning(): boolean;
    getParameters(): any;
}
export default Task;
