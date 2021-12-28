import { exec } from "child_process";

const fs = require('fs');

const GetTaskCmd = (confFile, taskname, sdk, paramers:string[]): {code:number, cmd: string} => {
    let cmd: string = "";
    if (fs.existsSync(`scripts/bash/${sdk}/${taskname}.sh`)) {
        cmd = `bash scripts/bash/${sdk}/${taskname}.sh`;
    }
    let code = 0;
    if (fs.existsSync(confFile)) {
        const content = fs.readFileSync(confFile, 'utf-8');
        var sdkconfig = JSON.parse(content);
        for (var task of sdkconfig.tasks) {
            if (task['name'] === taskname) {
                cmd = `${task['script']} ${task['path']}`
                break;
            }
        }
    }

    if (cmd.length === 0) {
        code = 1;
        return {code, cmd};
    }
    if (paramers.length > 0) {
        cmd = cmd.concat(" " + paramers.join(" "));
    }

    return {code, cmd};
}

const ExecuteTask = async (confFile: string, taskname: string, sdk: string, paramers:string[]):Promise<{err: any, stdout:any, stderr:any}> => {
    // 
    const {code, cmd} = GetTaskCmd(confFile, taskname, sdk, paramers);
    if (code !== 0) {
        process.exit(code);
    }

    const {err, stdout, stderr} = await new Promise((res) => exec(
        cmd,
        { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 },
        (err: unknown, stdout: unknown, stderr: unknown) =>
            res({ err: err, stdout: stdout, stderr: stderr })));
  
    console.log(`Run shell script: ${cmd}`)
    return {err, stdout, stderr};

}

const main = async () => {
    const confFile = process.argv[2];
    const taskname = process.argv[3];
    const sdk = process.argv[4];
    const paramters = process.argv.slice(5);
    const {code, cmd} = GetTaskCmd(confFile, taskname, sdk, paramters);
    console.log(cmd);
    process.exit(code);
    // const {err, stdout, stderr} = ExecuteTask(confFile, taskname, sdk, paramters);
}

main();