import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class GetStepsToRunCliConfig extends TaskBasicConfig {
    sdkRepo: string;
    skippedSteps: string
}

export const getStepsToRunCliConfig = convict<GetStepsToRunCliConfig>({
   sdkRepo: {
       default: '',
       env: 'SDK_REPO',
       format: String
   },
   skippedSteps: {
       default: '',
       env: 'SKIPPED_STEPS',
       format: String
   },
    ...taskBasicConfig
});
