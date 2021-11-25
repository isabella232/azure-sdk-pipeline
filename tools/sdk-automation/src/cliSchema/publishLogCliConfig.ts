import * as convict from 'convict';

export class PublishLogCliConfig {
    azureStorageBlobSasUrl: string;
    azureBlobContainerName: string;
    sdkGenerationName: string;
    buildId: string;
    taskName: string;
    pipeLog: string;
    pipeFullLog: string;
    mockServerLog: string;
}

export const publishLogCliConfig = convict<PublishLogCliConfig>({
    azureStorageBlobSasUrl: {
        default: '',
        env: 'AZURE_STORAGE_BLOB_SAS_URL',
        format: String
    },
    azureBlobContainerName: {
        default: 'logs',
        env: 'AZURE_BLOB_CONTAINER_NAME',
        format: String
    },
    sdkGenerationName: {
        default: '',
        env: 'SDK_GENERATION_NAME',
        format: String
    },
    buildId: {
        default: '',
        env: 'BUILD_ID',
        format: String
    },
    taskName: {
        default: '',
        env: 'TASK_NAME',
        format: String
    },
    pipeLog: {
        default: '/tmp/sdk-generation/pipe.log',
        env: 'PIPE_LOG',
        format: String
    },
    pipeFullLog: {
        default: '/tmp/sdk-generation/pipe.full.log',
        env: 'PIPE_FULL_LOG',
        format: String
    },
    mockServerLog: {
        default: '',
        env: 'MOCK_SERVER_LOG',
        format: String
    },
});
