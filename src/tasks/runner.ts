import App from '@dfgpublicidade/node-app-module';
import Task from '../interfaces/task';
import DefaultTaskManager from './taskManager';

/* Module */
enum RunnerError {
    INCOMPLETE_TASK = 'The task has incomplete data to be executed.',
    WRONG_START_STATUS = 'The task has not been properly executed by the system (wrong status).',
    MISCONFIGURED_METHOD = 'The task method is not correctly configured.',
    UNEXISTENT_METHOD = 'The module does not have a method such as configured at the task.',
    MODULE_NOT_FOUND = 'The module called at the task was not found.'
}

class Runner {
    public async run(app: App, taskManager: DefaultTaskManager, task: Task): Promise<any> {
        if (task === undefined || taskManager.getMethod(task) === undefined || taskManager.getStatus(task) === undefined) {
            return Promise.reject(RunnerError.INCOMPLETE_TASK);
        }
        else if (!taskManager.isRunning(task)) {
            return Promise.reject(RunnerError.WRONG_START_STATUS);
        }
        else if (taskManager.getMethod(task).indexOf('.') === -1) {
            return Promise.reject(RunnerError.MISCONFIGURED_METHOD);
        }
        else {
            const action: string[] = taskManager.getMethod(task).split('.');

            const moduleName: string = action[0];
            const method: string = action[1];

            try {
                let module: any = await import(`./modules/${moduleName}`);

                module = module.default;

                if (!module[method] || !(module[method] instanceof Function)) {
                    return Promise.reject(RunnerError.UNEXISTENT_METHOD);
                }
                else {
                    try {
                        return module[method](app, taskManager.getParameters(task));
                    }
                    catch (error) {
                        return Promise.reject(error);
                    }
                }
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
                return Promise.reject(RunnerError.MODULE_NOT_FOUND);
            }
        }
    }
}

export default Runner;
export { RunnerError };
