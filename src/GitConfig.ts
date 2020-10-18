import simpleGit, {ConfigValues, SimpleGit} from "simple-git";

export default class GitConfig {
    private gitConfig: ConfigValues;

    public constructor() {
        const git: SimpleGit = simpleGit();
        git.listConfig().then((result) => {
            this.gitConfig = result.all;
        });
    }

    /** git config --get user.name */
    get UserName() {
        if (this.gitConfig) {
            return this.gitConfig["user.name"];
        } else {
            return "";
        }
    }

    /** git config --get user.email */
    get UserEmail() {
        if (this.gitConfig) {
            return this.gitConfig["user.email"];
        } else {
            return "";
        }
    }
}
