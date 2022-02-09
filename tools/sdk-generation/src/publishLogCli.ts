#!/usr/bin/env node
import {PublishLogCliConfig, publishLogCliConfig} from "./cliSchema/publishLogCliConfig";
import {AzureBlobClient} from "./utils/AzureBlobClient";
import * as fs from "fs";
import {logger} from "./utils/logger";
import {SdkGenerationServerClient} from "./utils/SdkGenerationServerClient";
import {requireJsonc} from "./utils/requireJsonc";

export async function main() {
    const config: PublishLogCliConfig = publishLogCliConfig.getProperties();
    const azureBlobClient = new AzureBlobClient(config.azureStorageBlobSasUrl, config.azureBlobContainerName);
    const sdkGenerationServerClient = new SdkGenerationServerClient(config.sdkGenerationServiceHost, config.certPath);
    if (fs.existsSync(config.taskFullLog)) {
        await azureBlobClient.uploadLocal(config.taskFullLog, `${config.buildId}/${config.sdkGenerationName}-${config.taskName}.full.log`);
    }
    if (fs.existsSync(config.pipeLog)) {
        await azureBlobClient.uploadLocal(config.pipeLog, `${config.buildId}/${config.sdkGenerationName}-${config.taskName}.log`);
        await sdkGenerationServerClient.publishTaskResult(config.sdkGenerationName, config.buildId, requireJsonc(config.pipeLog));
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
