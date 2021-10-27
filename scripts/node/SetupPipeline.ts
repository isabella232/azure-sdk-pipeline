import { getAzureDevOpsLogger, timestamps } from "@azure/logger-js";
import { Octokit } from "@octokit/rest";
import { getRepository } from "@ts-common/azure-js-dev-tools";

const CODEGEN_TO_SDK_CONFIG_FILE: string = "codegen_to_sdk_config.json";
const logger = timestamps(getAzureDevOpsLogger());
const MemoryFileSystem = require('memory-fs');

const copyConfigureFileFromSDKRepo2 = (repo: string): string => {
    const repository = getRepository(repo);
    logger.logInfo(`Get codegen_to_sdk_config file from repo ${repo}`);
    
    let config = "";
    return config;
}

const copyConfigureFileFromSDKRepo = async (client: Octokit,
    org: string,
    repo: string,
    branch: string = 'main'): Promise<string> => {
    //const fs = new MemoryFileSystem();
    const fs = require("fs");
    logger.logInfo(`Get codegen_to_sdk_config file from repo ${repo}`);
    const content = await getBlobContent(
        client,
        org,
        repo,
        branch,
        CODEGEN_TO_SDK_CONFIG_FILE
    );
    if (content.length > 0) {
        fs.writeFileSync(CODEGEN_TO_SDK_CONFIG_FILE, content);
        return content;
    }
    
    return "";
}

const getCurrentCommit = async(
    client: Octokit,
    org: string,
    repo: string,
    branch: string = 'main'
) => {
    const refData = (
        await client.git.getRef({
            owner: org,
            repo,
            ref: 'heads/' + branch,
        })
    ).data;
    const commitSha = refData.object.sha;
    const commitData = (
        await client.git.getCommit({
            owner: org,
            repo,
            commit_sha: commitSha,
        })
    ).data;
    return { commitSha, treeSha: commitData.tree.sha };
}

const getTree = async(
    client: Octokit,
    owner: string,
    repo: string,
    tree_sha: string) => {
    const treeData = (
        await client.git.getTree({
            owner,
            repo,
            tree_sha,
        })
    ).data;

    return treeData;
}

const getBlobContent = async(
    client: Octokit,
    org: string,
    repo: string,
    branch: string,
    filepath: string
) => {
    const currentCommit = await getCurrentCommit(client, org, repo, branch);

    const treeData = await getTree(client, org, repo, currentCommit.treeSha);

    let content: string = '';
    const dirs: string[] = filepath.split('/');
    const filename = dirs.pop();
    let curtree = treeData;
    for (let dir of dirs) {
        let found: boolean = false;
        for (let t of curtree.tree) {
            if (t.path === dir) {
                curtree = await getTree(client, org, repo, t.sha);
                found = true;
                break;
            }
        }
        if (!found) return '';
    }
    for (let t of curtree.tree) {
        if (t.path === filename) {
            const blobdata = (
                await client.git.getBlob({
                    owner: org,
                    repo,
                    file_sha: t.sha,
                })
            ).data;

            let buff = Buffer.from(blobdata.content, 'base64');
            content = buff.toString('utf-8');
            break;
        }
    }

    return content;
}

const copyFilesFromSDKRepo = async (
    client: Octokit,
    org: string,
    repo: string,
    branch: string, fileList:string[]) => {
    // const fs = new MemoryFileSystem();
    const fs = require("fs");
    const path = require('path');
    // const prData = await this.getPullRequest(org, repo, prNumber);
    // const headBranch = prData.head.ref;

    let retrievedFileLst: string[] = [];
    for (let file of fileList) {
        const content = await getBlobContent(
            client,
            org,
            repo,
            branch,
            file
        );
        if (content.length > 0) {
            retrievedFileLst.push(file);
            console.log("file:" + file);
            const dir = path.dirname(file);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(file, content);
        }
    }

    return retrievedFileLst.join(';');
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
const setupPipeline = async (org:string, repo:string, branch: string) => {
    console.log("envs:" + Object.keys(process.env));

    console.log("token:" + process.env.GITHUT_TOKEN);
    const client: Octokit = new Octokit({
        auth: process.env.GITHUT_TOKEN,
    });
    const configstr = await copyConfigureFileFromSDKRepo(client, org, repo, branch);
    if (configstr.length > 0) {
        const config: CodegenToSDKConfig = JSON.parse(configstr);
        let files: string[] = [];
        for (let task of config.tasks) {
            files.push(task.path);
        }

        copyFilesFromSDKRepo(client, org, repo, branch , files);
    }
}


const main = async () => {
    const org:string = process.argv[2];
    const repo:string = process.argv[3];
    const branch:string = process.argv[4];
    await setupPipeline(org, repo, branch);
}

main();
