const fs = require('fs');

const GetTaskCmd = (confFile, taskname, sdk) => {
    let cmd = `bash scripts/${sdk}/${taskname}`;
    if (fs.existsSync(confFile)) {
        const content = fs.readFileSync(confFile, 'utf-8');
        var sdkconfig = JSON.parse(content);
        if (sdkconfig.tasks[taskname] !== undefined) {
            cmd = `${sdkconfig.tasks[taskname]['script']} ${sdkconfig.tasks[taskname]['path']}`
        }
    }

    return cmd;
}