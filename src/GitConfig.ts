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
        try {
            return this.gitConfig["user.name"];
        } catch (error) {
            return "";
        }
    }

    /** git config --get user.email */
    get UserEmail() {
        try {
            return this.gitConfig["user.email"];
        } catch (error) {
            return "";
        }
    }
}
