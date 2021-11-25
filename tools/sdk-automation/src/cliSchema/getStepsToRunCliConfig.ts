import * as convict from 'convict';
import {taskBasicConfig, TaskBasicConfig} from "./taskBasicConfig";

export class GetStepsToRunCliConfig extends TaskBasicConfig {
    skippedSteps: string
}

export const getStepsToRunCliConfig = convict<GetStepsToRunCliConfig>({
   skippedSteps: {
       default: '',
       env: 'SKIPPED_STEPS',
       format: String
   },
    ...taskBasicConfig
});
