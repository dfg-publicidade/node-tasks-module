import Task from '../interfaces/task';

/* Module */
abstract class DefaultTaskManager {
    public abstract init(): Promise<void>;
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
}

export default DefaultTaskManager;
