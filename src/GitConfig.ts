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
        return this.gitConfig["user.name"];
    }

    /** git config --get user.email */
    get UserEmail() {
        return this.gitConfig["user.email"];
    }
}
