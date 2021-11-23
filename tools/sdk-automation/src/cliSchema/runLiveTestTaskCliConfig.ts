import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class RunLiveTestTaskCliConfig extends TaskBasicConfig {
    sdkRepo: string;
    packageFolder: string;
    liveTestInputJson: string;
    liveTestOutputJson: string;
}

export const runLiveTestTaskCliConfig = convict<RunLiveTestTaskCliConfig>({
    sdkRepo: {
        default: '',
        env: 'SDK_REPO',
        format: String
    },
    packageFolder: {
        default: '',
        env: 'PACKAGE_FOLDER',
        format: String
    },
    liveTestInputJson: {
        default: '/tmp/liveTestInput.json',
        env: 'Live_TEST_INPUT_JSON',
        format: String
    },
    liveTestOutputJson: {
        default: '/tmp/liveTestOutput.json',
        env: 'Live_TEST_OUTPUT_JSON',
        format: String
    },
    ...taskBasicConfig
});
