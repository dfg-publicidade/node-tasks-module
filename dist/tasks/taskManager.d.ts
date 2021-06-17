import Task from '../interfaces/task';
declare abstract class DefaultTaskManager {
    abstract update(task: Task, data: any): Promise<Task>;
    abstract sendToSolved(task: Task): Promise<void>;
    abstract delete(task: Task): Promise<void>;
    abstract cloneTask(task: Task): Promise<Task>;
}
export default DefaultTaskManager;
