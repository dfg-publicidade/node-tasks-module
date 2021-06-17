interface Task {
    getMethod(): string;
    getStatus(): string;
    isRunning(): boolean;
    getParameters(): any;
    getInterval(): number;
    isPersistent(): boolean;
}
export default Task;
