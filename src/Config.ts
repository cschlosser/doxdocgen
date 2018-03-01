import { workspace } from "vscode";
// tslint:disable:max-classes-per-file
// tslint:disable:max-line-length

class C {
    public static getConfiguration() {
        return workspace.getConfiguration("doxdocgen.c");
    }

    public triggerSequence: string = "/**";
    public firstLine: string = "/**";
    public commentPrefix: string = " * ";
    public lastLine: string = " */";
}

class Cpp {
    public static getConfiguration() {
        return workspace.getConfiguration("doxdocgen.cpp");
    }

    public newLineAfterTParams: boolean = false;
    public tparamTemplate: string = "@tparam {param} ";
    public ctorText: string = "Construct a new {name} object";
    public dtorText: string = "Destroy the {name} object";
}

class File {
    public static getConfiguration() {
        return workspace.getConfiguration("doxdocgen.file");
    }

    public fileTemplate: string = "@file {name}";
    public fileOrder: string[] = ["brief", "file", "author", "date"];
}

class Generic {
    public static getConfiguration() {
        return workspace.getConfiguration("doxdocgen.generic");
    }

    public newLineAfterBrief: boolean = true;
    public newLineAfterParams: boolean = false;
    public includeTypeAtReturn: boolean = true;
    public boolReturnsTrueFalse: boolean = true;
    public briefTemplate: string = "@brief ";
    public paramTemplate: string = "@param {param} ";
    public returnTemplate: string = "@return {type} ";
    public linesToGet: number = 20;
    public authorTag: string = "@author your name";
    public dateTemplate: string = "@date {date}";
    public dateFormat: string = "YYYY-MM-DD";
    public generateSmartText: boolean = true;
}

export class Config {
    public static ImportFromSettings(): Config {
        const values: Config = new Config();

        values.C.triggerSequence = C.getConfiguration().get<string>("triggerSequence", values.C.triggerSequence);
        values.C.firstLine = C.getConfiguration().get<string>("firstLine", values.C.firstLine);
        values.C.commentPrefix = C.getConfiguration().get<string>("commentPrefix", values.C.commentPrefix);
        values.C.lastLine = C.getConfiguration().get<string>("lastLine", values.C.lastLine);

        values.Cpp.newLineAfterTParams = Cpp.getConfiguration().get<boolean>("newLineAfterTParams", values.Cpp.newLineAfterTParams);
        values.Cpp.tparamTemplate = Cpp.getConfiguration().get<string>("tparamTemplate", values.Cpp.tparamTemplate);
        values.Cpp.ctorText = Cpp.getConfiguration().get<string>("ctorText", values.Cpp.ctorText);
        values.Cpp.dtorText = Cpp.getConfiguration().get<string>("dtorText", values.Cpp.dtorText);

        values.File.fileTemplate = File.getConfiguration().get<string>("fileTemplate", values.File.fileTemplate);
        values.File.fileOrder = File.getConfiguration().get<string[]>("fileOrder", values.File.fileOrder);

        values.Generic.newLineAfterBrief = Generic.getConfiguration().get<boolean>("newLineAfterBrief", values.Generic.newLineAfterBrief);
        values.Generic.newLineAfterParams = Generic.getConfiguration().get<boolean>("newLineAfterParams", values.Generic.newLineAfterParams);
        values.Generic.includeTypeAtReturn = Generic.getConfiguration().get<boolean>("includeTypeAtReturn", values.Generic.includeTypeAtReturn);
        values.Generic.boolReturnsTrueFalse = Generic.getConfiguration().get<boolean>("boolReturnsTrueFalse", values.Generic.boolReturnsTrueFalse);
        values.Generic.briefTemplate = Generic.getConfiguration().get<string>("briefTemplate", values.Generic.briefTemplate);
        values.Generic.paramTemplate = Generic.getConfiguration().get<string>("paramTemplate", values.Generic.paramTemplate);
        values.Generic.returnTemplate = Generic.getConfiguration().get<string>("returnTemplate", values.Generic.returnTemplate);
        values.Generic.linesToGet = Generic.getConfiguration().get<number>("linesToGet", values.Generic.linesToGet);
        values.Generic.authorTag = Generic.getConfiguration().get<string>("authorTag", values.Generic.authorTag);
        values.Generic.dateTemplate = Generic.getConfiguration().get<string>("dateTemplate", values.Generic.dateTemplate);
        values.Generic.dateFormat = Generic.getConfiguration().get<string>("dateFormat", values.Generic.dateFormat);
        values.Generic.generateSmartText = Generic.getConfiguration().get<boolean>("generateSmartText", values.Generic.generateSmartText);

        return values;
    }

    public readonly paramTemplateReplace: string = "{param}";
    public readonly typeTemplateReplace: string = "{type}";
    public readonly nameTemplateReplace: string = "{name}";
    public readonly dateTemplateReplace: string = "{date}";

    public C: C;
    public Cpp: Cpp;
    public File: File;
    public Generic: Generic;

    constructor() {
        this.C = new C();
        this.Cpp = new Cpp();
        this.File = new File();
        this.Generic = new Generic();
    }
}
