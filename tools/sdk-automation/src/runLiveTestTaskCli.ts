import {logger} from "./utils/logger";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {LiveTestOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import * as fs from "fs";
import {runLiveTestTaskCliConfig, RunLiveTestTaskCliConfig} from "./cliSchema/runLiveTestTaskCliConfig";
import {LiveTestInput} from "./types/LiveTestInput";
import {processLiveTestOutput} from "./lib/processLiveTestOutput";
import {saveTaskResult, setTaskResult} from "./lib/taskResult";

const config: RunLiveTestTaskCliConfig = runLiveTestTaskCliConfig.getProperties();

async function main() {
    // TODO: currently, keep it similar to mockTest
    setTaskResult(config, 'LiveTest');
    const liveTestTask = getTask(path.join(config.sdkRepo, 'codegen_to_sdk_config.json'), 'liveTest');
    if (!liveTestTask) {
        throw `Init task is ${liveTestTask}`;
    }
    const liveTestOptions = liveTestTask as LiveTestOptions;
    const runOptions = liveTestOptions.liveTestScript;
    const inputJson: LiveTestInput = {
        packageFolder: config.packageFolder
    };
    fs.writeFileSync(config.liveTestInputJson, JSON.stringify(inputJson, undefined, 2), {encoding: 'utf-8'});
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: [config.liveTestInputJson, config.liveTestOutputJson]
    });
    if (executeResult === 'failed') {
        throw `Execute init script failed.`
    }
    const result =await processLiveTestOutput(config);
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
