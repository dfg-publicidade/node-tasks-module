import Task from '../interfaces/task';

/* Module */
abstract class DefaultTaskManager {
    public abstract init(): Promise<void>;
    public abstract load(moduleName: string): Promise<any>;
    public abstract cancelRunningTasks(): Promise<void>;
    public abstract generateDefaultTasks(): Promise<void>;
    public abstract getNext(): Promise<Task>;
    public abstract update(task: Task, data: {
        status: string;
        error: any;
        endDate: Date;
        result: any;
    }): Promise<Task>;
    public abstract sendToSolved(task: Task): Promise<Task>;
    public abstract delete(task: Task): Promise<void>;
    public abstract cloneTask(task: Task): Promise<Task>;
    public abstract afterTask(result?: any): Promise<void>;
    public abstract afterCron(result?: any): Promise<void>;
    public abstract getMethod(task?: any): string;
    public abstract getStatus(task?: any): string;
    public abstract isRunning(task?: any): boolean;
    public abstract getParameters(task?: any): any;
    public abstract getInterval(task?: any): number;
    public abstract isPersistent(task?: any): boolean;
}

export default DefaultTaskManager;
