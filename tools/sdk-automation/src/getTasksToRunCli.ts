#!/usr/bin/env node

import {logger} from "./utils/logger";
import {GetStepsToRunCliConfig, getStepsToRunCliConfig} from "./cliSchema/getStepsToRunCliConfig";
import * as fs from "fs";
import * as path from "path";
import {CodegenToSdkConfig, getCodegenToSdkConfig} from "./types/CodegenToSdkConfig";
import {requireJsonc} from "./utils/requireJsonc";

async function main() {
    const config: GetStepsToRunCliConfig = getStepsToRunCliConfig.getProperties();
    if (!fs.existsSync(config.sdkRepo)) {
        throw `Cannot find sdk repo in ${config.sdkRepo}`;
    }
    const codegenToSdkConfig: CodegenToSdkConfig = getCodegenToSdkConfig(requireJsonc(path.join(config.sdkRepo, 'codegen_to_sdk_config.json')));
    const jobsToRun: string[] = [];
    for (const task of Object.keys(codegenToSdkConfig)) {
        if (config.skippedSteps.includes(task)) {
            continue;
        }
        jobsToRun.push(task);
    }
    logger.info(`============${jobsToRun.join(';')}`);
    console.log(`##vso[task.setVariable variable=TasksToRun]${jobsToRun.join(';')}`);
    console.log('##vso[task.setVariable variable=StepResult]success');
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    console.log('##vso[task.setVariable variable=StepResult]failure');
    process.exit(1);
})
