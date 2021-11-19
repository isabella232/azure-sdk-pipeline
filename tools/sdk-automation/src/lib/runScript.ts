import {RunLogFilterOptions, RunLogOptions, RunOptions} from "../types/CodegenToSdkConfig";
import * as path from "path";
import {spawn} from "child_process";
import {logger} from "../utils/logger";
import {Readable} from "stream";
import {scriptRunningState} from "./scriptRunningState";

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
        let lineResult = 'succeeded';
        let _show = false;
        if (opts !== undefined) {
            if (isLineMatch(line, opts.scriptError)) {
                lineResult = 'failed';
            } else if (isLineMatch(line, opts.scriptWarning)) {
                lineResult = 'warning';
            }
            if (isLineMatch(line, opts.show) || lineResult !== 'succeeded') {
                _show = true;
            }
        }
        logger.log(logType, `${prefix} ${line}`, {show: _show, lineResult});
    };

    let cacheLine = '';
    stream.on('data', (data) => {
        const newData = cacheLine + data.toString();
        const lastIdx = newData.lastIndexOf('\n');
        if (lastIdx === -1) {
            return;
        }
        const lines = newData.slice(0, lastIdx).split('\n');
        cacheLine = newData.slice(lastIdx + 1);
        for (const line of lines) {
            addLine(line);
        }
    });
    stream.on('end', () => {
        addLine(cacheLine);
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
    if ((cmdRet.code !== 0 || cmdRet.signal !== null) && runOptions.exitCode !== undefined) {
        if (runOptions.exitCode.show) {
            show = true;
        }
        if (runOptions.exitCode.result === 'error') {
            executeResult = 'failed';
        } else if (runOptions.exitCode.result === 'warning') {
            executeResult = 'warning';
        }
        const message = `Script return with result [${executeResult}] code [${cmdRet.code}] signal [${cmdRet.signal}] cwd [${options.cwd}]: ${scriptPath}`;
        if (runOptions.exitCode.result === 'error') {
            logger.error(message, {show});
        } else if (runOptions.exitCode.result === 'warning') {
            logger.warn(message, {show});
        }
    }
    return executeResult;
}
