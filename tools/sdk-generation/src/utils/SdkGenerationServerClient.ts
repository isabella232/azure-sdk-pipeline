import {TaskResult} from "../lib/taskResult";

const axios = require('axios')

export class SdkGenerationServerClient {
    host: string;

    constructor(host: string) {
        this.host = host;
    }

    public async publishTaskResult(sdkGenerationName: string, buildId: string, taskResult: TaskResult) {
        await axios.post(`https://${this.host}/codegenerations/${sdkGenerationName}/taskResult`, {
            pipelineBuildId: buildId,
            taskResult: taskResult
        })

    }
}
