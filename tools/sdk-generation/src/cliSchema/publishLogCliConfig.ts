import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class PublishLogCliConfig extends TaskBasicConfig{
    sdkGenerationServiceHost: string
}

export const publishLogCliConfig = convict<PublishLogCliConfig>({
    sdkGenerationServiceHost: {
        default: 'localhost:3000',
        env: 'SDK_GENERATION_SERVICE_HOST',
        format: String
    },
    ...taskBasicConfig
});
