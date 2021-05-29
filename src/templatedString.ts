import { getEnvVars } from "./util";

/**
 * Represent a templated variable in string
 */
export interface ITemplate {
    toReplace: string;  // The template to be replaced in string
    with: string;       // The value to replace with
}

export function getIndentedTemplate(replace: string): string {
    if (replace === "") {
        return "";
    }
    const snippets = replace.split(/({indent:\d+})/);

    let indentedString: string = "";
    let indentWidth: number = 0;

    // tslint:disable-next-line:prefer-for-of
    snippets.forEach((element) => {
        if (element.match(/{indent:\d+}/)) {
            const indents = parseInt(element.match(/{indent:(\d+)}/)[1], 10);
            indentWidth = indents;
            const numSpaces = Math.max(indentWidth - indentedString.length, 0);
            indentedString += " ".repeat(numSpaces);
        } else {
            // just some text
            indentedString += element;
        }
    });

    return indentedString;
}

/**
 * Expand variable template in the string
 * @param original the original string
 * @param template variable template to be expanded
 * @returns new string with expanded template
 */
export function getTemplatedString(original: string, template: ITemplate): string {
    const replacedTemplate = original.replace(template.toReplace, template.with);
    const replacedWithEnv = getEnvVars(replacedTemplate);
    return getIndentedTemplate(replacedWithEnv);
}

/**
 * Generate lines of doxygen comments from template
 * @param lines Arrays to store lines of comments
 * @param replace Variable template to be expanded
 * @param template Original string that contains variable templates
 * @param templateWith Arrays of values to replace in the original template string
 */
export function generateFromTemplate(
    lines: string[],
    replace: string,
    template: string,
    templateWith: string[],
) {
    templateWith.forEach((element: string) => {
        // Ignore null values
        if (element !== null) {
            lines.push(...getTemplatedString(template, { toReplace: replace, with: element }).split("\n"));
        }
    });
}

/**
 * Expand multiple variable templates in the string
 * @param original string containing multiple variables to be expanded
 * @param templates variable templates to be expanded
 * @returns new string with expanded templates
 */
export function getMultiTemplatedString(
    original: string,
    templates: ITemplate[],
): string {
    // For each replace entry, attempt to replace it with the corresponding param in the template
    for (const template of templates) {
        original = original.replace(template.toReplace, template.with);
    }
    return getEnvVars(getIndentedTemplate(original));
}
