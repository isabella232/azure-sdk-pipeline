import {TaskResult} from "../lib/taskResult";
import * as https from "https";
import {logger} from "./logger";

export class SdkGenerationServerClient {
    host: string;
    constructor(host: string) {
        this.host = host;
    }

    public async publishTaskResult(sdkGenerationName: string, buildId: string, taskResult: TaskResult) {
        const request = https.request({
                host: this.host,
                path: `${sdkGenerationName}/taskResult`,
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            },
            res => {
                logger.info(res);
            }
        )
        request.write(JSON.stringify(taskResult));
        request.on('error', (err) => {
            throw err;
        });
    }
}
