import * as child_process from "child_process";


export function getFileListInPackageFolder(packageFolder: string) {
    const files = child_process.execSync('git ls-files -o',{ encoding: "utf8", cwd: packageFolder }).trim().split('\n');
    return files;
}
