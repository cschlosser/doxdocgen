import * as path from "path";
import { runTests } from "vscode-test";

function setupCoverage() {
  const NYC = require("nyc");
  const nyc = new NYC({
    all: true,
    cwd: path.join(__dirname, "..", "..", ".."),
    exclude: ["src/test/**", ".vscode-test/**", "**/node_modules/**"],
    hookRequire: true,
    hookRunInContext: true,
    hookRunInThisContext: true,
    instrument: true,
    reportDir: path.join(__dirname, "..", "..", "coverage"),
    reporter: ["json", "html", "lcov"],
  });

  nyc.reset();
  nyc.wrap();

  return nyc;
}

async function main() {
  const nyc = process.env.COVERAGE ? setupCoverage() : null;
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./coverage");

    // Download VS Code, unzip it and run the integration test
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.error(err);
    // tslint:disable-next-line: no-console
    console.error("Failed to run tests");
    process.exit(1);
  } finally {
    if (nyc) {
      nyc.writeCoverageFile();
      await nyc.report();
    }
  }
}

main();
