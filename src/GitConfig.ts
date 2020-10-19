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
    get UserName(): string {
        try {
            return this.gitConfig["user.name"].toString();
        } catch (error) {
            return "";
        }
    }

    /** git config --get user.email */
    get UserEmail(): string {
        try {
            return this.gitConfig["user.email"].toString();
        } catch (error) {
            return "";
        }
    }
}
