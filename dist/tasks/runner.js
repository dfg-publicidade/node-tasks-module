"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunnerError = void 0;
/* Module */
var RunnerError;
(function (RunnerError) {
    RunnerError["INCOMPLETE_TASK"] = "The task has incomplete data to be executed.";
    RunnerError["WRONG_START_STATUS"] = "The task has not been properly executed by the system (wrong status).";
    RunnerError["MISCONFIGURED_METHOD"] = "The task method is not correctly configured.";
    RunnerError["UNEXISTENT_METHOD"] = "The module does not have a method such as configured at the task.";
    RunnerError["MODULE_NOT_FOUND"] = "The module called at the task was not found.";
})(RunnerError || (RunnerError = {}));
exports.RunnerError = RunnerError;
class Runner {
    async run(app, taskManager, task) {
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
            const action = taskManager.getMethod(task).split('.');
            const moduleName = action[0];
            const method = action[1];
            try {
                let module = await Promise.resolve().then(() => __importStar(require(`./modules/${moduleName}`)));
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
exports.default = Runner;
