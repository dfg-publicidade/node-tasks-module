import Task from '../interfaces/task';

/* Module */
abstract class DefaultTaskManager {
    public abstract update(task: Task, data: any): Promise<Task>;
    public abstract sendToSolved(task: Task): Promise<void>;
    public abstract delete(task: Task): Promise<void>;
    public abstract cloneTask(task: Task): Promise<Task>;

}

export default DefaultTaskManager;
