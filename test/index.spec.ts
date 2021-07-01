import App, { AppInfo } from '@dfgpublicidade/node-app-module';
import Util from '@dfgpublicidade/node-util-module';
import { expect } from 'chai';
import { before, describe, it } from 'mocha';
import { DefaultTaskManager, RunnerError, Task, TaskServer } from '../src';

/* Tests */
let taskResult: any;

class TestTask implements Task {
    public id: number;
    public method: string;
    public status: string;
    public interval?: number;
    public persistIfFail?: boolean;
    public parameters?: any;
    public error?: any;
    public endDate?: Date;
    public result?: any;
}

let tasks: TestTask[] = [];
const solvedTasks: TestTask[] = [];

const taskModule: any = {
    default: {
        do: async (): Promise<string> => Promise.resolve('Done!'),
        fail: async (): Promise<string> => Promise.reject('Failed!'),
        other: (): void => {
            throw new Error('Error');
        }
    }
};

class TaskManager extends DefaultTaskManager {
    public constructor() {
        super();
    }

    public async init(): Promise<void> {
        return Promise.resolve();
    }

    public async load(moduleName: string): Promise<any> {
        return taskModule;
    }

    public async cancelRunningTasks(): Promise<void> {
        for (const task of tasks) {
            task.status = 'CANCELED';
        }

        return Promise.resolve();
    }

    public async generateDefaultTasks(): Promise<void> {
        tasks.push({
            id: 1,
            method: 'module.fail',
            status: 'NEW'
        });

        tasks.push({
            id: 2,
            method: 'module.do',
            status: 'NEW'
        });

        tasks.push({
            id: 3,
            method: 'module.fail',
            status: 'NEW',
            interval: 10,
            persistIfFail: true
        });

        tasks.push({
            id: 4,
            method: 'module.do',
            status: 'NEW',
            interval: 10
        });

        tasks.push({
            id: 5
        } as any);

        tasks.push({
            id: 6,
            method: 'module.do'
        } as any);

        tasks.push({
            id: 7,
            method: 'module'
        } as any);

        tasks.push({
            id: 8,
            method: 'module.do'
        } as any);

        tasks.push({
            id: 9,
            method: 'module.invalid'
        } as any);

        tasks.push({
            id: 10,
            method: 'module.other'
        } as any);

        return Promise.resolve();
    }

    public async getNext(): Promise<TestTask> {
        if (tasks.length === 0) {
            return Promise.resolve(undefined);
        }

        const task: TestTask = tasks[0];
        task.status = 'RUNNING';

        return Promise.resolve(task);
    }

    public async update(task: TestTask, data: {
        status: string;
        error: any;
        endDate: Date;
        result: any;
    }): Promise<TestTask> {
        task.status = data.status;
        task.error = data.error;
        task.endDate = data.endDate;
        task.result = data.result;

        return task;
    }

    public async sendToSolved(task: TestTask): Promise<TestTask> {
        solvedTasks.push(task);

        return Promise.resolve(task);
    }

    public async delete(task: TestTask): Promise<void> {
        tasks = tasks.filter((taskAt: TestTask): boolean => taskAt.id !== task.id);

        return Promise.resolve();
    }

    public async cloneTask(task: TestTask): Promise<TestTask> {
        return Promise.resolve({
            ...task,
            status: 'NEW',
            error: undefined,
            endDate: undefined,
            result: undefined
        });
    }

    public async afterTask(result?: any): Promise<void> {
        taskResult = result;
        return Promise.resolve(result);
    }

    public async afterCron(result?: any): Promise<void> {
        return Promise.resolve(result);
    }

    public getMethod(task: TestTask): string {
        return task.method;
    }

    public getStatus(task: TestTask): string {
        return task.status;
    }

    public isRunning(task: TestTask): boolean {
        return task.status === 'RUNNING';
    }

    public getParameters(task: TestTask): any {
        return task.parameters;
    }

    public getInterval(task: TestTask): number {
        return task.interval;
    }

    public isPersistent(task: TestTask): boolean {
        return task.persistIfFail;
    }
}

describe('TaskServer.ts', (): void => {
    let taskServer: TaskServer;
    let taskServer2: TaskServer;
    let taskServer3: TaskServer;
    let taskServer4: TaskServer;

    let taskManager5: TaskManager;
    let taskServer5: TaskServer;

    let taskManager6: TaskManager;
    let taskServer6: TaskServer;

    let taskManager7: TaskManager;
    let taskServer7: TaskServer;

    let taskManager8: TaskManager;
    let taskServer8: TaskServer;

    let taskManager9: TaskManager;
    let taskServer9: TaskServer;

    let taskManager10: TaskManager;
    let taskServer10: TaskServer;

    before(async (): Promise<void> => {
        const appInfo: AppInfo = {
            name: 'test',
            version: 'v1'
        };

        // TaskServer 1
        const app: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: false,
                    period: '* * * * * *'
                }
            }
        });

        const taskManager: TaskManager = new TaskManager();
        taskManager.init = (): any => {
            throw new Error('Error');
        };

        taskServer = new TaskServer(app, taskManager);

        // TaskServer 2
        const app2: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: false,
                    period: '* * * * * *'
                }
            }
        });

        const taskManager2: TaskManager = new TaskManager();
        taskServer2 = new TaskServer(app2, taskManager2);

        // TaskServer 3
        const app3: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: false,
                    period: '* * * * * *'
                }
            }
        });

        const taskManager3: TaskManager = new TaskManager();
        taskManager3.getNext = async (): Promise<TestTask> => {
            throw new Error('Error');
        };

        taskServer3 = new TaskServer(app3, taskManager3);

        // TaskServer 4
        const app4: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: false,
                    period: '* * * * * *'
                }
            }
        });

        const taskManager4: TaskManager = new TaskManager();

        taskServer4 = new TaskServer(app4, taskManager4);

        // TaskServer 5
        const app5: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager5 = new TaskManager();
        taskManager5.sendToSolved = async (): Promise<TestTask> => {
            throw new Error('Error');
        };

        taskServer5 = new TaskServer(app5, taskManager5);

        // TaskServer 6
        const app6: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager6 = new TaskManager();
        taskManager6.cloneTask = async (): Promise<TestTask> => {
            throw new Error('Error');
        };

        taskServer6 = new TaskServer(app6, taskManager6);

        // TaskServer 7
        const app7: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager7 = new TaskManager();
        taskServer7 = new TaskServer(app7, taskManager7);

        // TaskServer 8
        const app8: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager8 = new TaskManager();
        taskManager8.getNext = async (): Promise<TestTask> => Promise.resolve(tasks[0]);
        taskServer8 = new TaskServer(app8, taskManager8);

        // TaskServer 9
        const app9: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager9 = new TaskManager();
        taskManager9.load = async (): Promise<Task> => {
            throw new Error('Error');
        };
        taskServer9 = new TaskServer(app9, taskManager9);

        // TaskServer 10
        const app10: App = new App({
            appInfo,
            config: {
                tasks: {
                    createDefaultTasks: true,
                    period: '* * * * * *'
                }
            }
        });

        taskManager10 = new TaskManager();
        taskServer10 = new TaskServer(app10, taskManager10);
    });

    it('1. start/terminate', async (): Promise<void> => {
        let taskError: any;
        try {
            await taskServer.start();
        }
        catch (err: any) {
            taskError = err;
        }

        expect(taskError).to.exist;
        expect(taskError).to.have.property('message').eq('Error');
    });

    it('2. start/terminate', async (): Promise<void> => {
        await taskServer2.start();

        expect(taskServer2.getCron()).exist;
        expect(taskServer2.getCron().running).true;

        await taskServer2.terminate();
    });

    it('3. start/terminate', async (): Promise<void> => {
        await taskServer3.start();

        expect(taskServer3.getCron()).exist;
        expect(taskServer3.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer3.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('message').eq('Error');
    });

    it('4. start/terminate', async (): Promise<void> => {
        await taskServer4.start();

        expect(taskServer4.getCron()).exist;
        expect(taskServer4.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer4.terminate();

        expect(taskResult).to.be.undefined;
    });

    it('5. start/terminate', async (): Promise<void> => {
        await taskServer5.start();

        expect(taskServer5.getCron()).exist;
        expect(taskServer5.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer5.terminate();

        expect((await taskManager5.getNext()).error).to.be.eq('Failed!');

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('message').eq('Error');
    });

    it('6. start/terminate', async (): Promise<void> => {
        await taskServer6.start();

        expect(taskServer6.getCron()).exist;
        expect(taskServer6.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer6.terminate();

        expect(solvedTasks[solvedTasks.length - 1]).to.exist;
        expect(solvedTasks[solvedTasks.length - 1]).to.have.property('status').eq('ERROR');

        expect(taskResult).to.be.deep.eq(solvedTasks[solvedTasks.length - 1]);
    });

    it('7. start/terminate', async (): Promise<void> => {
        await taskServer6.start();

        expect(taskServer6.getCron()).exist;
        expect(taskServer6.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer6.terminate();

        expect(solvedTasks[solvedTasks.length - 1]).to.exist;
        expect(solvedTasks[solvedTasks.length - 1]).to.have.property('status').eq('SUCCESS');

        expect(taskResult).to.be.deep.eq(solvedTasks[solvedTasks.length - 1]);
    });

    it('8. start/terminate', async (): Promise<void> => {
        await taskServer6.start();

        expect(taskServer6.getCron()).exist;
        expect(taskServer6.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer6.terminate();

        expect(solvedTasks[solvedTasks.length - 1]).to.exist;
        expect(solvedTasks[solvedTasks.length - 1]).to.have.property('status').eq('ERROR');

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('message').eq('Error');
    });

    it('9. start/terminate', async (): Promise<void> => {
        await taskServer7.start();

        expect(taskServer7.getCron()).exist;
        expect(taskServer7.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer7.terminate();

        expect(solvedTasks[solvedTasks.length - 1]).to.exist;
        expect(solvedTasks[solvedTasks.length - 1]).to.have.property('status').eq('SUCCESS');

        expect(taskResult).to.be.deep.eq({
            ...solvedTasks[solvedTasks.length - 1],
            status: 'NEW',
            error: undefined,
            endDate: undefined,
            result: undefined
        });
    });

    it('10. start/terminate', async (): Promise<void> => {
        await taskServer7.start();

        expect(taskServer7.getCron()).exist;
        expect(taskServer7.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer7.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error').eq(RunnerError.INCOMPLETE_TASK);
    });

    it('11. start/terminate', async (): Promise<void> => {
        await taskServer8.start();

        expect(taskServer8.getCron()).exist;
        expect(taskServer8.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer8.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error').eq(RunnerError.WRONG_START_STATUS);
    });

    it('12. start/terminate', async (): Promise<void> => {
        await taskServer9.start();

        expect(taskServer9.getCron()).exist;
        expect(taskServer9.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer9.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error').eq(RunnerError.MISCONFIGURED_METHOD);
    });

    it('13. start/terminate', async (): Promise<void> => {
        await taskServer9.start();

        expect(taskServer9.getCron()).exist;
        expect(taskServer9.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer9.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error').eq(RunnerError.MODULE_NOT_FOUND);
    });

    it('14. start/terminate', async (): Promise<void> => {
        await taskServer10.start();

        expect(taskServer10.getCron()).exist;
        expect(taskServer10.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer10.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error').eq(RunnerError.UNEXISTENT_METHOD);
    });

    it('15. start/terminate', async (): Promise<void> => {
        await taskServer10.start();

        expect(taskServer10.getCron()).exist;
        expect(taskServer10.getCron().running).true;

        // eslint-disable-next-line no-magic-numbers
        await Util.delay(1000);

        await taskServer10.terminate();

        expect(taskResult).to.exist;
        expect(taskResult).to.have.property('error');
        expect(taskResult.error).to.have.property('message').eq('Error');
    });
});
