import {
    MessageRecord,
    PipelineResult,
} from '@azure/swagger-validation-common';
import {getTaskBasicConfig, TaskBasicConfig} from "../cliSchema/taskBasicConfig";
import * as fs from "fs";

export type TaskResultCommon = {
    name: string;
    pipelineId: string;
    subTaskKey?: string;
    env?: string;
    suppressed?: boolean;
    subTitle?: string;
    parentName?: string;
    result?: PipelineResult;
    errorCount?: number;
    warningCount?: number;
    checkRunId: number;
    checkRunUrl: string;
    checkState?: string;
    azurePipelineUrl?: string;
    pipelineJobId?: string;
    pipelineTaskId?: string;
    queuedAt: Date;
    inProgressAt?: Date;
    completedAt?: Date;
    labels?: string[];
    logUrl?: string;
    messages?: MessageRecord[];
};

export type CodegenCodeGenerateTaskResult = TaskResultCommon & {
    codeUrl?: string;
};

export type TestTaskResult = TaskResultCommon & {
    total?: number;
    success?: number;
    fail?: number;
    apiCoverage?: number;
    codeCoverage?: number;
};

export type TaskResult =
    | TaskResultCommon
    | CodegenCodeGenerateTaskResult
    | TestTaskResult;

export function setTaskResult(config: TaskBasicConfig, taskName: string) {
    taskResult = {
        name: taskName,
        pipelineId: config.pipelineId,
        queuedAt: new Date(config.queuedAt),
        checkRunId: 0,
        checkRunUrl: '',
        result: 'success',
        errorCount: 0,
        warningCount: 0
    }
}

export let taskResult: TaskResult;

export function saveTaskResult() {
    const config: TaskBasicConfig = getTaskBasicConfig.getProperties();
    fs.writeFileSync(config.pipeLog, JSON.stringify(taskResult, null, 2), {encoding: 'utf-8'});
}
