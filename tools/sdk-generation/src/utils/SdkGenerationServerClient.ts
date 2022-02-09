import {TaskResult} from "../lib/taskResult";
import * as https from "https";
import * as fs from "fs";

const axios = require('axios')

export class SdkGenerationServerClient {
    host: string;
    cert: string;

    constructor(host: string, certPath: string) {
        this.host = host;
        this.cert = fs.readFileSync(certPath, 'utf-8');
    }

    public async publishTaskResult(sdkGenerationName: string, buildId: string, taskResult: TaskResult) {
        await axios.post(`https://${this.host}/codegenerations/${sdkGenerationName}/taskResult`, {
            pipelineBuildId: buildId,
            taskResult: taskResult
        }, {
            httpsAgent: new https.Agent({
                cert: this.cert,
            })
        })
    }
}
