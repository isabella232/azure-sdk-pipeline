// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License in the project root for license information.
import { Octokit } from "@octokit/rest";
import { MemoryFileSystem } from 'memory-fs';

import { logger } from "./logger";

export class GithubClient {
    // public client: Octokit = undefined;
    constructor(githubToken: string, githubBaseUrl: string) {
        this.client = new Octokit({
            auth: githubToken,
            baseUrl: githubBaseUrl,
        });
    }

    public client: Octokit = new Octokit({
        auth: "",
        baseUrl: "",
    });

    public async getCurrentCommit(org: string, repo: string, branch = 'main') {
        const refData = (
            await this.client.git.getRef({
                owner: org,
                repo,
                ref: 'heads/' + branch,
            })
        ).data;
        const commitSha = refData.object.sha;
        const commitData = (
            await this.client.git.getCommit({
                owner: org,
                repo,
                commit_sha: commitSha,
            })
        ).data;
        return { commitSha, treeSha: commitData.tree.sha };
    }

    public async createBranch(org: string, repo: string, branch: string, commitSha: string) {
        await this.client.git.createRef({
            owner: org,
            repo,
            ref: 'refs/heads/' + branch,
            sha: commitSha,
        });
    }

    public async getBranch(org: string, repo: string, branch: string) {
        try {
            const result = await this.client.git.getRef({
                owner: org,
                repo,
                ref: 'heads/' + branch,
            });
            return result;
        } catch (e) {
            return undefined;
        }
    }

    public async createNewTree(owner: string, repo: string, fs: MemoryFileSystem, paths: string[], parentTreeSha: string) {
        const tree = [];
        for (const p of paths) {
            const content = fs.readFileSync('/' + p).toString();
            const blob = {
                path: p,
                mode: '100644',
                type: 'blob',
                content: content,
            };
            tree.push(blob);
        }

        const { data } = await this.client.git.createTree({
            owner,
            repo,
            tree: tree,
            base_tree: parentTreeSha,
        });

        return data;
    }

    public async createNewCommit(org: string, repo: string, message: string, currentTreeSha: string, currentCommitSha: string) {
        const newCommit = await this.client.git.createCommit({
            owner: org,
            repo,
            message,
            tree: currentTreeSha,
            parents: [currentCommitSha],
        });

        return newCommit.data;
    }

    public async setBranchToCommit(org: string, repo: string, branch: string, commitSha: string) {
        await this.client.git.updateRef({
            owner: org,
            repo,
            ref: 'heads/' + branch,
            sha: commitSha,
        });
    }

    public async createPullRequest(org: string, repo: string, baseBranch: string, headBranch: string, title: string): Promise<string> {
        const result = await this.client.pulls.create({
            owner: org,
            repo,
            title: title,
            head: headBranch,
            base: baseBranch,
        });

        return result.data.html_url;
    }

    public async deleteBranch(org: string, repo: string, branch: string) {
        try {
            await this.client.git.deleteRef({
                owner: org,
                repo,
                ref: 'heads/' + branch,
            });
        } catch (e) {
            logger.warn(`Delete Branch ${branch} Failed in ${org}/${repo}`, e);
        }
    }
}
