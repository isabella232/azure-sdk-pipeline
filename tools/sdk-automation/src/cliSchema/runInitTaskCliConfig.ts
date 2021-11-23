import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class RunInitTaskCliConfig extends TaskBasicConfig {
    sdkRepo: string;
    initOutput: string;
}

export const runInitTaskCliConfig = convict<RunInitTaskCliConfig>({
    sdkRepo: {
        default: '',
        env: 'SDK_REPO',
        format: String
    },
    initOutput: {
        default: '/tmp/initOutput.json',
        env: 'INIT_OUTPUT_JSON',
        format: String
    },
    ...taskBasicConfig
});
