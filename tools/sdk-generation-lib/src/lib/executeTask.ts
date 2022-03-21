import {GenerateAndBuildInput} from "../types/taskInputAndOuputSchemaTypes/GenerateAndBuildInput";
import {MockTestInput} from "../types/taskInputAndOuputSchemaTypes/MockTestInput";
import {LiveTestInput} from "../types/taskInputAndOuputSchemaTypes/LiveTestInput";
import {GenerateAndBuildOutput} from "../types/taskInputAndOuputSchemaTypes/GenerateAndBuildOutput";
import {MockTestOutput} from "../types/taskInputAndOuputSchemaTypes/MockTestOutput";
import {LiveTestOutput} from "../types/taskInputAndOuputSchemaTypes/LiveTestOutput";
import {setTaskResult, taskResult, TaskResult} from "../types/taskResult";
import {getTaskBasicConfig, TaskBasicConfig} from "../types/taskBasicConfig";
import * as fs from "fs";
import {runScript} from "./runScript";
import {RunOptions} from "../types/taskInputAndOuputSchemaTypes/CodegenToSdkConfig";
import {requireJsonc} from "../utils/requireJsonc";
import { InitOutput } from "../types/taskInputAndOuputSchemaTypes/InitOutput";


export async function executeTask(taskName: string,
                                  runScriptOptions: RunOptions,
                                  cwd: string,
                                  inputJson?: GenerateAndBuildInput | MockTestInput | LiveTestInput
): Promise<{ taskResult: TaskResult, output: InitOutput | GenerateAndBuildOutput | MockTestOutput | LiveTestOutput | undefined }> {
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
        cwd: cwd,
        args: args
    });
    if (result === 'failed') {
        taskResult.result = 'failure';
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
