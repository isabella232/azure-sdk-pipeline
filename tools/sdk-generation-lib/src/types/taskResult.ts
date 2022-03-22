import {getTaskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";
import * as fs from "fs";

export type PipelineResult = "success" | "failure" | "timed_out";

export type Extra = {
  [key: string]: any;
};

export type MessageLevel = "Info" | "Warning" | "Error";

export type JsonPath = {
  tag: string; // meta info about the path, e.g. "swagger" or "example"
  path: string;
};

export type MesssageContext = {
  toolVersion: string;
};
export type BaseMessageRecord = {
  level: MessageLevel;
  message: string;
  time: Date;
  context?: MesssageContext;
  extra?: Extra;
};
  
export type ResultMessageRecord = BaseMessageRecord & {
  type: "Result";
  id?: string;
  code?: string;
  docUrl?: string;
  paths: JsonPath[];
};
  
export type RawMessageRecord = BaseMessageRecord & {
  type: "Raw";
};

export type MarkdownMessageRecord = BaseMessageRecord & {
  type: "Markdown";
  mode: "replace" | "append";
};
  
export type MessageRecord = ResultMessageRecord | RawMessageRecord | MarkdownMessageRecord;

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
export interface TestCase {
  name: string;
  passed: boolean;
  message: string;
}
export type TestTaskResult = TaskResultCommon & {
    total?: number;
    success?: number;
    fail?: number;
    apiCoverage?: number;
    codeCoverage?: number;
    testcases? :TestCase[];
};

export type TaskResult =
    | TaskResultCommon
    | CodegenCodeGenerateTaskResult
    | TestTaskResult;

export function setTaskResult(config: TaskBasicConfig, taskName: string) {
    taskResult = {
        name: taskName,
        pipelineId: config.buildId,
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
