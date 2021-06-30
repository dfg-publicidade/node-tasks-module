import App from '@dfgpublicidade/node-app-module';
import Result from '@dfgpublicidade/node-result-module';
import { CronJob } from 'cron';
import appDebugger from 'debug';
import Task from '../interfaces/task';
import Runner from '../tasks/runner';
import DefaultTaskManager from '../tasks/taskManager';

/* Module */
const debug: appDebugger.IDebugger = appDebugger('module:task-server');

class TaskServer {
    private app: App;
    private taskManager: DefaultTaskManager;
    private cron: CronJob;
    private runner: Runner;

    public constructor(app: App, taskManager: DefaultTaskManager) {
        debug('Building task server');

        this.app = app;
        this.taskManager = taskManager;

        this.runner = new Runner();

        this.cron = new CronJob(
            app.config.tasks.period,
            async (): Promise<void> => this.nextTask(),
            async (): Promise<void> => this.cronFinish(),
            false,
            process.env.TZ
        );
    }

    public async start(): Promise<void> {
        debug('Starting task server');

        try {
            debug('Creating default tasks');

            await this.taskManager.init();

            await this.taskManager.cancelRunningTasks();

            if (this.app.config.tasks.createDefaultTasks) {
                await this.taskManager.generateDefaultTasks();
            }

            debug('Starting cron service');
            this.cron.start();
            return Promise.resolve();
        }
        catch (error) {
            debug('An error has occurred starting task server');
            return Promise.reject(error);
        }
    }

    public async terminate(): Promise<void> {
        debug('Terminating cron service');
        this.cron.stop();
    }

    public getCron(): CronJob {
        return this.cron;
    }

    private async nextTask(): Promise<void> {
        try {
            let task: Task = await this.taskManager.getNext();

            if (!task) {
                return this.taskManager.afterTask(undefined);
            }
            else {
                let status: string;
                let result: Result;
                let taskError: any;

                try {
                    debug('Task found, running...');

                    result = await this.runner.run(this.app, this.taskManager, task);
                    status = 'SUCCESS';

                    debug('Task performed successfully');
                }
                catch (error) {
                    debug('An error has occurred when running task');

                    status = 'ERROR';
                    taskError = error;
                }

                try {
                    task = await this.taskManager.update(task, {
                        status,
                        endDate: new Date(),
                        result,
                        error: taskError
                    });

                    await this.taskManager.sendToSolved(task);

                    await this.taskManager.delete(task);
                }
                catch (error) {
                    debug('An error was occurred when updating the status of the finished task');
                    return this.taskManager.afterTask(error);
                }

                if (this.taskManager.getInterval(task) && (status === 'SUCCESS' || this.taskManager.isPersistent(task))) {
                    debug('The task must be replicated. Cloning...');

                    try {
                        const clonedTask: Task = await this.taskManager.cloneTask(task);
                        return this.taskManager.afterTask(clonedTask);
                    }
                    catch (error) {
                        debug('An error has occurred when replicating the task');
                        return this.taskManager.afterTask(error);
                    }
                }
                else {
                    return this.taskManager.afterTask(task);
                }
            }
        }
        catch (error) {
            debug('An error has occurred when searching for new tasks');
            this.taskManager.afterTask(error);
        }
    }

    private async cronFinish(): Promise<void> {
        debug('Task server is finished');
        return this.taskManager.afterCron();
    }
}

export default TaskServer;
