import { exec } from "child_process";

const fs = require('fs');

const GetTaskCmd = (confFile, taskname, sdk, paramers:string[]) => {
    let cmd: string = `bash scripts/bash/${sdk}/${taskname}.sh`;
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

    if (paramers.length > 0) {
        cmd = cmd.concat(" " + paramers.join(" "));
    }

    return cmd;
}

const ExecuteTask = async (confFile: string, taskname: string, sdk: string, paramers:string[]):Promise<{err: any, stdout:any, stderr:any}> => {
    // 
    const shell = GetTaskCmd(confFile, taskname, sdk, paramers);

    const {err, stdout, stderr} = await new Promise((res) => exec(
        shell,
        { encoding: "utf8", maxBuffer: 1024 * 1024 * 64 },
        (err: unknown, stdout: unknown, stderr: unknown) =>
            res({ err: err, stdout: stdout, stderr: stderr })));
  
    console.log(`Run shell script: ${shell}`)
    return {err, stdout, stderr};

}

const main = () => {
    // console.log(process.argv);
    const confFile = process.argv[2];
    const taskname = process.argv[3];
    const sdk = process.argv[4];
    const paramters = process.argv.slice(5);
    // console.log("confFile:" + confFile + ", taskname:" + taskname + ", sdk:" + sdk);
    const ret = GetTaskCmd(confFile, taskname, sdk, paramters);
    console.log(ret);
    // process.stdout.write(ret);
    // ExecuteTask(confFile, taskname, sdk, {});
}

main();