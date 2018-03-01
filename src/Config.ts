import { workspace } from "vscode";

export class Config {
    public static ImportFromSettings(): Config {
        const values: Config =  new Config();

        const cfg = workspace.getConfiguration("doxdocgen.generic");

        values.triggerSequence = cfg.get<string>("triggerSequence", values.triggerSequence);
        values.firstLine = cfg.get<string>("firstLine", values.firstLine);
        values.commentPrefix = cfg.get<string>("commentPrefix", values.commentPrefix);
        values.lastLine = cfg.get<string>("lastLine", values.lastLine);
        values.newLineAfterBrief = cfg.get<boolean>("newLineAfterBrief", values.newLineAfterBrief);
        values.newLineAfterParams = cfg.get<boolean>("newLineAfterParams", values.newLineAfterParams);
        values.newLineAfterTParams = cfg.get<boolean>("newLineAfterTParams", values.newLineAfterTParams);
        values.includeTypeAtReturn = cfg.get<boolean>("includeTypeAtReturn", values.includeTypeAtReturn);
        values.boolReturnsTrueFalse = cfg.get<boolean>("boolReturnsTrueFalse", values.boolReturnsTrueFalse);
        values.briefTemplate = cfg.get<string>("briefTemplate", values.briefTemplate);
        values.paramTemplate = cfg.get<string>("paramTemplate", values.paramTemplate);
        values.tparamTemplate = cfg.get<string>("tparamTemplate", values.tparamTemplate);
        values.returnTemplate = cfg.get<string>("returnTemplate", values.returnTemplate);
        values.linesToGet = cfg.get<number>("linesToGet", values.linesToGet);
        values.authorTag = cfg.get<string>("authorTag", values.authorTag);
        values.fileTemplate = cfg.get<string>("fileTemplate", values.fileTemplate);
        values.dateTemplate = cfg.get<string>("dateTemplate", values.dateTemplate);
        values.dateFormat = cfg.get<string>("dateFormat", values.dateFormat);
        values.fileOrder = cfg.get<string[]>("fileOrder", values.fileOrder);
        values.ctorText = cfg.get<string>("ctorText", values.ctorText);
        values.dtorText = cfg.get<string>("dtorText", values.dtorText);
        values.generateSmartText = cfg.get<boolean>("generateSmartText", values.generateSmartText);

        return values;
    }

    public readonly paramTemplateReplace: string = "{param}";
    public readonly typeTemplateReplace: string = "{type}";
    public readonly nameTemplateReplace: string = "{name}";
    public readonly dateTemplateReplace: string = "{date}";

    public triggerSequence: string = "/**";
    public firstLine: string = "/**";
    public commentPrefix: string = " * ";
    public lastLine: string = " */";
    public newLineAfterBrief: boolean = true;
    public newLineAfterParams: boolean = false;
    public newLineAfterTParams: boolean = false;
    public includeTypeAtReturn: boolean = true;
    public boolReturnsTrueFalse: boolean = true;
    public briefTemplate: string = "@brief ";
    public paramTemplate: string = "@param {param} ";
    public tparamTemplate: string = "@tparam {param} ";
    public returnTemplate: string = "@return {type} ";
    public linesToGet: number = 20;
    public authorTag: string = "@author your name";
    public fileTemplate: string = "@file {name}";
    public dateTemplate: string = "@date {date}";
    public dateFormat: string = "YYYY-MM-DD";
    public fileOrder: string[] = ["brief", "file", "author", "date"];
    public ctorText: string = "Construct a new {name} object";
    public dtorText: string = "Destroy the {name} object";
    public generateSmartText: boolean = true;
}
