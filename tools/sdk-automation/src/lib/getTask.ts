import {CodegenToSdkConfig, getCodegenToSdkConfig, Task} from "../types/CodegenToSdkConfig";
import {requireJsonc} from "../utils/requireJsonc";

export function getTask(codegenToSdkConfigPath: string, taskName: string): Task | undefined {
    const codegenToSdkConfig: CodegenToSdkConfig = getCodegenToSdkConfig(requireJsonc(codegenToSdkConfigPath));
    for (const task of codegenToSdkConfig.tasks) {
        if (task.name === taskName) {
            return task;
        }
    }
    return undefined;
}
