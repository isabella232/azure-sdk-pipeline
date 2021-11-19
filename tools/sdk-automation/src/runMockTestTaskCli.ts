import {logger} from "./utils/logger";
import {runInitTaskCliConfig, RunInitTaskConfig} from "./cliSchema/runInitTaskCliConfig";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {InitOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import {getInitOutput} from "./types/GetInitOutput";
import {requireJsonc} from "./utils/requireJsonc";
import * as fs from "fs";

async function main() {
    const config: RunInitTaskConfig = runInitTaskCliConfig.getProperties();
    const initTask = getTask(path.join(config.sdkRepo, 'codegen_to_sdk_config.json'), 'init');
    if (!initTask) {
        throw `Init task is ${initTask}`;
    }
    const initOptions = initTask.options as InitOptions;
    const runOptions = initOptions.initScript;
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: ['/tmp/initOutput.json']
    });
    if (executeResult === 'failed') {
        throw `Execute init script failed.`
    }
    if (fs.existsSync('/tmp/initOutput.json')) {
        const initOutputJson = getInitOutput(requireJsonc('/tmp/initOutput.json'));
        for (const v of Object.keys(initOutputJson.envs)) {
            console.log(`##vso[task.setVariable variable=${v};isOutput=true]${initOutputJson.envs[v]}`);
        }
    }
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    console.log('##vso[task.setVariable variable=StepResult]failure');
    process.exit(1);
})
