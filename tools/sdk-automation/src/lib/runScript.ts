import {RunLogFilterOptions, RunLogOptions, RunOptions} from "../types/CodegenToSdkConfig";
import * as path from "path";
import {spawn} from "child_process";
import {logger} from "../utils/logger";
import {Readable} from "stream";
import {scriptRunningState} from "./scriptRunningState";
import * as fs from "fs";

export const isLineMatch = (line: string, filter: RunLogFilterOptions | undefined) => {
    if (filter === undefined) {
        return false;
    }
    if (typeof filter === 'boolean') {
        return filter;
    }
    if (typeof filter === 'string') {
        filter = new RegExp(filter);
    }
    return filter.exec(line) !== null;
};

const listenOnStream = (
    prefix: string,
    stream: Readable,
    opts: RunLogOptions | undefined,
    logType: 'cmdout' | 'cmderr'
) => {
    const addLine = (line: string) => {
        if (line.length === 0) {
            return;
        }
        let show = false;
        if (opts !== undefined) {
            if (isLineMatch(line, opts.show) || isLineMatch(line, opts.scriptError) || isLineMatch(line, opts.scriptWarning)) {
                show = true;
            }
        }
        logger.log(logType, `${prefix} ${line}`, {show: show});
    };

    stream.on('data', (data) => {
        addLine(data.toString());
    });
};

export async function runScript(runOptions: RunOptions, options: {
    cwd: string;
    args?: string[];
}): Promise<string> {
    let executeResult: scriptRunningState;
    const scriptPath = runOptions.path;
    const env = {PWD: path.resolve(options.cwd)};
    for (const e of runOptions.envs) {
        env[e] = process.env[e];
    }
    let cmdRet: { code: number | null; signal: NodeJS.Signals | null } = {
        code: null,
        signal: null
    };
    fs.chmodSync(scriptPath, '777');
    try {
        const child = spawn(scriptPath, options.args, {
            cwd: options.cwd,
            shell: false,
            stdio: ['ignore', 'pipe', 'pipe'],
            env
        });
        const prefix = `[${runOptions.logPrefix ?? path.basename(scriptPath)}]`;
        listenOnStream(prefix, child.stdout, runOptions.stdout, 'cmdout');
        listenOnStream(prefix, child.stderr, runOptions.stderr, 'cmderr');

        cmdRet = await new Promise((resolve) => {
            child.on('exit', (code, signal) => {
                resolve({ code, signal });
            });
        });
        executeResult = 'succeeded';
    } catch (e) {
        cmdRet.code = -1;
        logger.error(e.stack);
        executeResult = 'failed';
    }
    let show = false;
    if ((cmdRet.code !== 0 || cmdRet.signal !== null) && runOptions.exitWithNonZeroCode !== undefined) {
        if (runOptions.exitWithNonZeroCode.show) {
            show = true;
        }
        if (runOptions.exitWithNonZeroCode.result === 'error') {
            executeResult = 'failed';
        } else if (runOptions.exitWithNonZeroCode.result === 'warning') {
            executeResult = 'warning';
        }
        const message = `Script return with result [${executeResult}] code [${cmdRet.code}] signal [${cmdRet.signal}] cwd [${options.cwd}]: ${scriptPath}`;
        if (runOptions.exitWithNonZeroCode.result === 'error') {
            logger.error(message, {show});
        } else if (runOptions.exitWithNonZeroCode.result === 'warning') {
            logger.warn(message, {show});
        }
    }
    return executeResult;
}
