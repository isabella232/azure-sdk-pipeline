import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class RunLiveTestTaskCliConfig extends TaskBasicConfig {
    packageFolder: string;
    liveTestInputJson: string;
    liveTestOutputJson: string;
}

export const runLiveTestTaskCliConfig = convict<RunLiveTestTaskCliConfig>({
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
