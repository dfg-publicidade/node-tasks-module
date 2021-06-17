import Task from '../interfaces/task';
declare abstract class DefaultTaskManager {
    abstract init(): Promise<void>;
    abstract cancelRunningTasks(): Promise<void>;
    abstract generateDefaultTasks(): Promise<void>;
    abstract getNext(): Promise<Task>;
    abstract update(task: Task, data: any): Promise<Task>;
    abstract sendToSolved(task: Task): Promise<void>;
    abstract delete(task: Task): Promise<void>;
    abstract cloneTask(task: Task): Promise<Task>;
}
export default DefaultTaskManager;
