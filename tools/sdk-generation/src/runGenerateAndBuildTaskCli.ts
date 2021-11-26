#!/usr/bin/env node

import {logger} from "./utils/logger";
import {getTask} from "./lib/getTask";
import * as path from "path";
import {GenerateAndBuildOptions} from "./types/CodegenToSdkConfig";
import {runScript} from "./lib/runScript";
import {runGenerateAndBuildTaskCliConfig, RunGenerateAndBuildTaskCliConfig} from "./cliSchema/runGenerateAndBuildTaskCliConfig";
import {GenerateAndBuildInput} from "./types/GenerateAndBuildInput";
import * as fs from "fs";
import {processGenerateAndBuildOutput} from "./lib/processGenerateAndBuildOutput";
import {saveTaskResult, setTaskResult} from "./lib/taskResult";

const config: RunGenerateAndBuildTaskCliConfig = runGenerateAndBuildTaskCliConfig.getProperties();

async function main() {
    setTaskResult(config, 'GenerateAndBuild');
    const generateAndBuildTask = getTask(path.join(config.sdkRepo, 'codegen_to_sdk_config.json'), 'generateAndBuild');
    if (!generateAndBuildTask) {
        throw `Generate and build task is ${generateAndBuildTask}`;
    }
    const generateAndBuildOptions = generateAndBuildTask as GenerateAndBuildOptions;
    const runOptions = generateAndBuildOptions.generateAndBuildScript;
    const relatedReadmeMdFile = path.join(config.specFolder, config.relatedReadmeMdFile);
    const specFolder = config.specFolder.includes('specification')? config.specFolder : path.join(config.specFolder, 'specification');
    const inputContent: GenerateAndBuildInput = {
        specFolder: specFolder,
        headSha: config.headSha,
        headRef: config.headRef,
        repoHttpsUrl: config.repoHttpsUrl,
        relatedReadmeMdFile: relatedReadmeMdFile,
        serviceType: config.serviceType
    };
    const inputJson = JSON.stringify(inputContent, undefined, 2)
    logger.info(inputJson);
    fs.writeFileSync(config.generateAndBuildInputJson, inputJson, {encoding: 'utf-8'});
    const executeResult = await runScript(runOptions, {
        cwd: path.resolve(config.sdkRepo),
        args: [config.generateAndBuildInputJson, config.generateAndBuildOutputJson]
    });
    if (executeResult === 'failed') {
        throw `Execute generateAndBuild script failed.`
    }
    const result = await processGenerateAndBuildOutput(config);
    if (result.hasFailedResult) {
        console.log('##vso[task.setVariable variable=StepResult]failure');
    } else {
        console.log('##vso[task.setVariable variable=StepResult]success');
    }
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    console.log('##vso[task.setVariable variable=StepResult]failure');
}).finally(() => {
    saveTaskResult();
})
