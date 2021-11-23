import * as convict from 'convict';

export class TaskBasicConfig {
    pipelineId: string;
    queuedAt: string;
    pipeLog: string;
    pipeFullLog: string;
}

export const taskBasicConfig = {
    pipelineId: {
        default: '',
        env: 'PIPELINE_ID',
        format: String
    },
    queuedAt: {
        default: '',
        env: 'QUEUE_AT',
        format: String
    },
    pipeLog: {
        default: '/tmp/pipe.log',
        env: 'PIPE_LOG',
        format: String
    },
    pipeFullLog: {
        default: '/tmp/pipe.full.log',
        env: 'PIPE_FULL_LOG',
        format: String
    }
};
export const getTaskBasicConfig = convict<TaskBasicConfig>(taskBasicConfig);
