#!/usr/bin/env node
import {PublishLogCliConfig, publishLogCliConfig} from "./cliSchema/publishLogCliConfig";
import {AzureBlobClient} from "./lib/AzureBlobClient";
import * as fs from "fs";
import {logger} from "./utils/logger";

export async function main() {
    const config: PublishLogCliConfig = publishLogCliConfig.getProperties();
    const azureBlobClient = new AzureBlobClient(config.azureStorageBlobSasUrl, config.azureBlobContainerName);
    if (fs.existsSync(config.pipeFullLog)) {
        await azureBlobClient.uploadLocal(config.pipeFullLog, `${config.buildId}/${config.sdkGenerationName}-${config.taskName}.full.log`);
    }
    if (fs.existsSync(config.pipeLog)) {
        await azureBlobClient.uploadLocal(config.pipeLog, `${config.buildId}/${config.sdkGenerationName}-${config.taskName}.log`);
    }
    if (fs.existsSync(config.mockServerLog)) {
        await azureBlobClient.uploadLocal(config.pipeFullLog, `${config.buildId}/${config.sdkGenerationName}-${config.taskName}.mockserver.log`);
    }
}

main().catch(e => {
    logger.error(`${e.message}
    ${e.stack}`);
    process.exit(1);
});
