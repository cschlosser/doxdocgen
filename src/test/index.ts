import * as glob from "glob";
import * as Mocha from "mocha";
import * as path from "path";

function setupNyc() {
    const NYC = require("nyc");
    // create an nyc instance, config here is the same as your package.json
    const nyc = new NYC({
        cache: false,
        cwd: path.join(__dirname, "..", ".."),
        exclude: [
            "**/**.test.js",
        ],
        extension: [
            ".ts",
            ".tsx",
        ],
        hookRequire: true,
        hookRunInContext: true,
        hookRunInThisContext: true,
        instrument: true,
        reporter: ["lcovonly", "text"],
        require: [
            "ts-node/register",
            "source-map-support/register",
        ],
        sourceMap: true,
    });
    nyc.reset();
    nyc.wrap();
    return nyc;
}

export function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
  });

  const nyc = setupNyc();
  const testsRoot = path.resolve(__dirname, ".");

  return new Promise((c, e) => {
    glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
      if (err) {
        return e(err);
      }

      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`));
          } else {
            c();
          }
        });
      } catch (err) {
        e(err);
      } finally {
        nyc.writeCoverageFile();
        nyc.report();
      }
    });
  });
}
