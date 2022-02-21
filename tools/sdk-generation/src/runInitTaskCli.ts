#!/usr/bin/env node

import {logger} from "./utils/logger";
import {runInitTaskCliConfig, RunInitTaskCliConfig} from "./cliSchema/runInitTaskCliConfig";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {InitOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import {requireJsonc} from "./utils/requireJsonc";
import * as fs from "fs";
import {initOutput} from "./types/InitOutput";
import {saveTaskResult, setTaskResult} from "./lib/taskResult";

const config: RunInitTaskCliConfig = runInitTaskCliConfig.getProperties();
export let initTaskRunSuccessfully = true;

async function main() {
    setTaskResult(config, 'Init');

    const initTask = getTask(path.join(config.sdkRepo, config.configPath), 'init');
    if (!initTask) {
        throw `Init task is ${initTask}`;
    }
    const initOptions = initTask as InitOptions;
    const runOptions = initOptions.initScript;
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: [config.initOutput]
    });
    if (executeResult === 'failed') {
        throw `Execute init script failed.`
    }
    if (fs.existsSync(config.initOutput)) {
        const initOutputJson = initOutput(requireJsonc(config.initOutput));
        if (initOutputJson?.envs) {
            for (const v of Object.keys(initOutputJson.envs)) {
                console.log(`##vso[task.setVariable variable=${v};isOutput=true]${initOutputJson.envs[v]}`);
            }
        }
    }
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);

    initTaskRunSuccessfully = false;
}).finally(() => {
    saveTaskResult();
    if (!initTaskRunSuccessfully) {
        console.log('##vso[task.setVariable variable=StepResult]failure');
        process.exit(1);
    } else {
        console.log('##vso[task.setVariable variable=StepResult]success');
    }
})
