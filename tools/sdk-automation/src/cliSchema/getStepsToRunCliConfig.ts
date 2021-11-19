import * as convict from 'convict';

export type GetStepsToRunCliConfig = {
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
   }
});
