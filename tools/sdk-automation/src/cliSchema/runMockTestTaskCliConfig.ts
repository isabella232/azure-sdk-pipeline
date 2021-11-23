import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class RunMockTestTaskCliConfig extends TaskBasicConfig {
    sdkRepo: string;
    packageFolder: string;
    mockTestInputJson: string;
    mockTestOutputJson: string;
    mockServerHost: string;
}

export const runMockTestTaskCliConfig = convict<RunMockTestTaskCliConfig>({
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
    mockTestInputJson: {
        default: '/tmp/mockTestInput.json',
        env: 'MOCK_TEST_INPUT_JSON',
        format: String
    },
    mockTestOutputJson: {
        default: '/tmp/mockTestOutput.json',
        env: 'MOCK_TEST_OUTPUT_JSON',
        format: String
    },
    mockServerHost: {
        default: 'https://localhost:443',
        env: 'MOCK_SERVER_HOST',
        format: String
    },
    ...taskBasicConfig
});
