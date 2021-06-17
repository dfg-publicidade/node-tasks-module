import App from '@dfgpublicidade/node-app-module';
import Task from '../interfaces/task';
declare enum RunnerError {
    INCOMPLETE_TASK = "The task has incomplete data to be executed.",
    WRONG_START_STATUS = "The task has not been properly executed by the system (wrong status).",
    MISCONFIGURED_METHOD = "The task method is not correctly configured.",
    UNEXISTENT_METHOD = "The module does not have a method such as configured at the task.",
    MODULE_NOT_FOUND = "The module called at the task was not found."
}
declare class Runner {
    run(app: App, task: Task): Promise<any>;
}
export default Runner;
export { RunnerError };
