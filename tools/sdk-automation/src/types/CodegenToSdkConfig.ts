import { requireJsonc } from '../utils/requireJsonc';
import { getTypeTransformer } from '../utils/validator';
import * as path from "path";

export const codegenToSdkConfigSchema = requireJsonc(path.join(__dirname, 'CodegenToSdkConfigSchema.json'));

export type RunLogFilterOptions = RegExp | boolean;

export type RunLogOptions = {
    show?: RunLogFilterOptions;
    scriptError?: RunLogFilterOptions;
    scriptWarning?: RunLogFilterOptions;
};

export type RunOptions = {
    path: string;
    envs?: string[];
    logPrefix?: string;
    stdout?: RunLogOptions;
    stderr?: RunLogOptions;
    exitCode?: {
        show: boolean;
        result: 'error' | 'warning' | 'ignore';
    };
};

export type InitOptions = {
    initScript: RunOptions;
}
export type GenerateAndBuildOptions = {
    generateAndBuildScript: RunOptions;
}
export type MockTestOptions = {
    mockTestScript: RunOptions;
}
export type LiveTestOptions = {
    liveTestScript: RunOptions;
}

export type Task = {
    name: string;
    options: InitOptions | GenerateAndBuildOptions | MockTestOptions | LiveTestOptions;
}

export type CodegenToSdkConfig = {
    tasks: Task[];
};

export const getCodegenToSdkConfig = getTypeTransformer<CodegenToSdkConfig>(
    codegenToSdkConfigSchema,
    'CodegenToSdkConfig'
);
