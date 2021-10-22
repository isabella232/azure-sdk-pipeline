import { getAzureDevOpsLogger, timestamps } from "@azure/logger-js";
import { getRepository } from "@ts-common/azure-js-dev-tools";

const CODEGEN_TO_SDK_CONFIG_FILE: string = "codegen_to_sdk_config.json";
const logger = timestamps(getAzureDevOpsLogger());

const copyConfigureFileFromSDKRepo = (repo: string): string => {
    const repository = getRepository(repo);
    logger.logInfo(`Get codegen_to_sdk_config file from repo ${repo}`);
    
    let config = "";
    return config;
}

const copyFilesFromSDKRepo = (repo:string, filepath:string[]) => {

}
export class CodegenTask {
    name: string;
    script: string;
    path: string;
    paramter: {};
    output: {};
    resultParseCriterion: {
        stderr: {},
        apiCoverage?: {
            pattern: string;
        }
    };
}
export class CodegenToSDKConfig {
    checkoutSDKRepo: boolean;
    tasks: CodegenTask[];
}
const setupPipeline = (sdk:string) => {
    const repo = "";
    const configstr = copyConfigureFileFromSDKRepo(repo);
    const config: CodegenToSDKConfig = JSON.parse(configstr);

    let files: string[] = [];
    for (let task of config.tasks) {
        files.push(task.path);
    }

    copyFilesFromSDKRepo(repo, files);
}

const sdk:string = process.argv[2];
setupPipeline(sdk);