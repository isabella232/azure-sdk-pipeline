import {RunGenerateAndBuildTaskCliConfig} from "../cliSchema/runGenerateAndBuildTaskCliConfig";
import {getGenerateAndBuildOutput} from "../types/GenerateAndBuildOutput";
import {requireJsonc} from "../utils/requireJsonc";
import * as fs from "fs";
import {AzureBlobClient} from "./AzureBlobClient";
import * as path from "path";

function getFiles(dir: string, files?: string[]) {
    files = files || [];
    for (const f of fs.readdirSync(dir)) {
        const name = path.join(dir, f);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files;
}

export async function processGenerateAndBuildOutput(config: RunGenerateAndBuildTaskCliConfig): Promise<{ hasFailedResult: boolean }> {
    const res = {hasFailedResult: false};
    if (!fs.existsSync(config.generateAndBuildOutputJson)) return res;
    const generateAndBuildOutputJson = getGenerateAndBuildOutput(requireJsonc(config.generateAndBuildOutputJson));
    const allPackageFolders: string[] = [];
    for (const p of generateAndBuildOutputJson.packages) {
        const result = p.result;
        if (result === 'failed') {
            res.hasFailedResult = true;
            continue;
        }
        const packageName = p.packageName;
        const paths = p.path;
        const packageFolder = p.packageFolder;
        const changelog = p.changelog;
        const artifacts = p.artifacts;

        allPackageFolders.push(packageFolder);
        // upload generated codes in packageFolder
        const azureBlobClient = new AzureBlobClient(config.azureStorageBlobSasUrl, config.azureBlobContainerName);
        for (const filePath of getFiles(packageFolder)) {
            const relativeFilePath = path.relative(packageFolder, filePath);
            await azureBlobClient.uploadLocal(filePath, `${config.language}/${config.sdkGenerationName}/${packageName}/${relativeFilePath}`);
        }

        for (const artifact of artifacts) {
            const artifactName = path.basename(artifact);
            await azureBlobClient.uploadLocal(artifact, `${config.language}/${config.sdkGenerationName}/${artifactName}`);
        }

        // TODO: Create PR in release
    }

    console.log(`##vso[task.setVariable variable=PackageFolders]${allPackageFolders.join(';')}`);
    return res;
}
