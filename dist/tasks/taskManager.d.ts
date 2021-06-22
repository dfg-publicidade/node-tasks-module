import Task from '../interfaces/task';
declare abstract class DefaultTaskManager {
    abstract init(): Promise<void>;
    abstract cancelRunningTasks(): Promise<void>;
    abstract generateDefaultTasks(): Promise<void>;
    abstract getNext(): Promise<Task>;
    abstract update(task: Task, data: {
        status: string;
        error: any;
        endDate: Date;
        result: any;
    }): Promise<Task>;
    abstract sendToSolved(task: Task): Promise<Task>;
    abstract delete(task: Task): Promise<void>;
    abstract cloneTask(task: Task): Promise<Task>;
    abstract afterTask(result?: any): Promise<void>;
    abstract afterCron(result?: any): Promise<void>;
}
export default DefaultTaskManager;
