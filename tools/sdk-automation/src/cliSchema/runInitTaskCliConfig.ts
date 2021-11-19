import * as convict from 'convict';

export type RunInitTaskConfig = {
    sdkRepo: string;
}

export const runInitTaskCliConfig = convict<RunInitTaskConfig>({
   sdkRepo: {
       default: '',
       env: 'SDK_REPO',
       format: String
   }
});
