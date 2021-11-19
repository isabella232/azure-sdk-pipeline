import {RunGenerateAndBuildTaskConfig} from "../cliSchema/runGenerateAndBuildTaskCliConfig";
import {getGenerateAndBuildOutput} from "../types/GenerateAndBuildOutput";
import {requireJsonc} from "../utils/requireJsonc";
import * as fs from "fs";
import {AzureBlobClient} from "./AzureBlobClient";
import * as path from "path";

export async function processGenerateAndBuildOutput(config: RunGenerateAndBuildTaskConfig) {
    if (!fs.existsSync(config.generateAndBuildOutputJson)) return;
    const generateAndBuildOutputJson = getGenerateAndBuildOutput(requireJsonc(config.generateAndBuildOutputJson));
    for (const p of generateAndBuildOutputJson.packages) {
        const result = p.result;
        if (result === 'failed') {
            console.log('##vso[task.setVariable variable=StepResult]failure');
            continue;
        }
        const packageName = p.packageName;
        const paths = p.path;
        const packageFolder = p.packageFolder;
        const changelog = p.changelog;
        const artifacts = p.artifacts;

        // upload generated codes
        const azureBlobClient = new AzureBlobClient(config.azureStorageBlobSasUrl, config.azureBlobContainerName);
        for (const filePath of paths) {
            const relativeFilePath = path.relative(path.relative(config.sdkRepo, packageFolder), path.relative(config.sdkRepo, filePath));
            await azureBlobClient.uploadLocal(filePath, `${config.language}/${config.resourceProvider}/${config.sdkGenerationName}/${packageName}/${packageFolder}/${relativeFilePath}`);
        }
        for (const artifact of artifacts) {
            const artifactName = path.basename(artifact);
            await azureBlobClient.uploadLocal(artifact, `${config.language}/${config.resourceProvider}/${config.sdkGenerationName}/${packageName}/${artifactName}`);
        }
    }
}
