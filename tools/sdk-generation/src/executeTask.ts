import {GenerateAndBuildInput} from "./types/GenerateAndBuildInput";
import {MockTestInput} from "./types/MockTestInput";
import {LiveTestInput} from "./types/LiveTestInput";
import {GenerateAndBuildOutput} from "./types/GenerateAndBuildOutput";
import {MockTestOutput} from "./types/MockTestOutput";
import {LiveTestOutput} from "./types/LiveTestOutput";
import {setTaskResult, taskResult, TaskResult} from "./lib/taskResult";
import {getTaskBasicConfig, TaskBasicConfig} from "./cliSchema/taskBasicConfig";
import * as fs from "fs";
import {runScript} from "./lib/runScript";
import {RunOptions} from "./types/CodegenToSdkConfig";
import {requireJsonc} from "./utils/requireJsonc";


export async function executeTask(taskName: string,
                                  runScriptOptions: RunOptions,
                                  inputJson?: GenerateAndBuildInput | MockTestInput | LiveTestInput
): Promise<{ taskResult: TaskResult, output: GenerateAndBuildOutput | MockTestOutput | LiveTestOutput | undefined }> {
    const inputJsonPath  = '/tmp/input.json';
    const outputJsonPath = '/tmp/output.json';
    if (!!inputJson) {
        fs.writeFileSync(inputJsonPath, JSON.stringify(inputJson, null, 2), {encoding: 'utf-8'});
    }
    const config: TaskBasicConfig = getTaskBasicConfig.getProperties();
    setTaskResult(config, taskName);
    const args = [];
    if (!!inputJson) {
        args.push(inputJsonPath);
    }
    args.push(outputJsonPath);
    const result = await runScript(runScriptOptions, {
        cwd: '/',
        args: args
    });
    if (result === 'failed') {
        throw new Error(`Execute Task ${taskName} failed.`);
    }
    if (fs.existsSync(outputJsonPath)) {
        const outputJson = requireJsonc(outputJsonPath);
        return {
            taskResult: taskResult,
            output: outputJson
        }
    } else {
        return {
            taskResult: taskResult,
            output: undefined
        }
    }
}
