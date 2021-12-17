import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class PublishLogCliConfig extends TaskBasicConfig{
    sdkGenerationServiceHost: string
    taskFullLog: string
}

export const publishLogCliConfig = convict<PublishLogCliConfig>({
    sdkGenerationServiceHost: {
        default: 'localhost:3000',
        env: 'SDK_GENERATION_SERVICE_HOST',
        format: String
    },
    taskFullLog: {
        default: '/tmp/sdk-generation/pipe.full.log',
        env: 'TASK_FULL_LOG',
        format: String
    },
    ...taskBasicConfig
});
