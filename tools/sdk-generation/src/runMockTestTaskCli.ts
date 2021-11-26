#!/usr/bin/env node

import {logger} from "./utils/logger";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {MockTestOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import * as fs from "fs";
import {runMockTestTaskCliConfig, RunMockTestTaskCliConfig} from "./cliSchema/runMockTestTaskCliConfig";
import {MockTestInput} from "./types/MockTestInput";
import {processMockTestOutput} from "./lib/processMockTestOutput";
import {saveTaskResult, setTaskResult} from "./lib/taskResult";

const config: RunMockTestTaskCliConfig = runMockTestTaskCliConfig.getProperties();

async function main() {
    setTaskResult(config, 'MockTest');
    const mockTestTask = getTask(path.join(config.sdkRepo, 'codegen_to_sdk_config.json'), 'mockTest');
    if (!mockTestTask) {
        throw `Init task is ${mockTestTask}`;
    }
    const mockTestOptions = mockTestTask as MockTestOptions;
    const runOptions = mockTestOptions.mockTestScript;
    const inputContent: MockTestInput = {
        packageFolder: config.packageFolder,
        mockServerHost: config.mockServerHost
    };
    const inputJson = JSON.stringify(inputContent, undefined, 2)
    logger.info(inputJson);
    fs.writeFileSync(config.mockTestInputJson, inputJson, {encoding: 'utf-8'});
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: [config.mockTestInputJson, config.mockTestOutputJson]
    });
    if (executeResult === 'failed') {
        throw `Execute init script failed.`
    }
    const result = await processMockTestOutput(config);
    if (result) {
        console.log('##vso[task.setVariable variable=StepResult]success');
    } else {
        console.log('##vso[task.setVariable variable=StepResult]failure');
    }

}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    console.log('##vso[task.setVariable variable=StepResult]failure');
}).finally(() => {
    saveTaskResult();
})
