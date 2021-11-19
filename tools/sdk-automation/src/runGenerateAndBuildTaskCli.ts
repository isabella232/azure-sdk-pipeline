import {logger} from "./utils/logger";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {GenerateAndBuildOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import {runGenerateAndBuildTaskCliConfig, RunGenerateAndBuildTaskConfig} from "./cliSchema/runGenerateAndBuildTaskCliConfig";
import {GenerateAndBuildInput} from "./types/GenerateAndBuildInput";
import * as fs from "fs";
import {processGenerateAndBuildOutput} from "./lib/processGenerateAndBuildOutput";

async function main() {
    const config: RunGenerateAndBuildTaskConfig = runGenerateAndBuildTaskCliConfig.getProperties();
    const generateAndBuildTask = getTask(path.join(config.sdkRepo, 'codegen_to_sdk_config.json'), 'generateAndBuild');
    if (!generateAndBuildTask) {
        throw `Generate and build task is ${generateAndBuildTask}`;
    }
    const generateAndBuildOptions = generateAndBuildTask.options as GenerateAndBuildOptions;
    const runOptions = generateAndBuildOptions.generateAndBuildScript;
    const inputJson: GenerateAndBuildInput = {
        specFolder: config.specFolder,
        headSha: config.headSha,
        headRef: config.headRef,
        repoHttpsUrl: config.repoHttpsUrl,
        relatedReadmeMdFile: config.relatedReadmeMdFile,
        serviceType: config.serviceType
    };
    fs.writeFileSync(config.generateAndBuildInputJson, JSON.stringify(inputJson, undefined, 2), {encoding: 'utf-8'});
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: [config.generateAndBuildInputJson, config.generateAndBuildOutputJson]
    });
    if (executeResult === 'failed') {
        throw `Execute generateAndBuild script failed.`
    }
    console.log('##vso[task.setVariable variable=StepResult]success');
    await processGenerateAndBuildOutput(config);
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    console.log('##vso[task.setVariable variable=StepResult]failure');
    process.exit(1);
})
