#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

(function index() {
    const { inputDir, outputDir } = getProcessArgs();
    process.argv.splice(0);
    ensureEmptyDir(outputDir);
    generate(inputDir, outputDir);
})();

function getProcessArgs() {
    let [inputDir, outputDir] = process.argv.slice(2);

    if (!inputDir)
        throw Error("missing required inputDir arg");
    if (!outputDir)
        throw Error("missing required outputDir arg");

    inputDir = path.resolve(process.cwd(), inputDir);
    outputDir = path.resolve(process.cwd(), outputDir);

    if (!fs.existsSync(inputDir) || !fs.statSync(inputDir).isDirectory())
        throw Error(`input dir "${inputDir}" not found`);
    if (fs.existsSync(outputDir) && !fs.statSync(inputDir).isDirectory())
        throw Error(`output dir "${outputDir}" not found`);

    return { inputDir, outputDir };
}

function ensureEmptyDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        return;
    }

    fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item);
        fs.statSync(itemPath).isDirectory()
            ? fs.rmSync(itemPath, { recursive: true })
            : fs.unlinkSync(itemPath)
    });
}

function generate(inputDir, outputDir) {
    const protoGenTsBinary = path.resolve(process.cwd(), "./node_modules/.bin/protoc-gen-ts" + (process.platform === "win32" ? ".cmd" : ""));

    if (!fs.existsSync(protoGenTsBinary) || !fs.statSync(protoGenTsBinary).isFile())
        throw Error(`protoGenTsBinary "${protoGenTsBinary}" not found`);

    require("protoc-binary").protoc([
        "--plugin", `protoc-gen-ts="${protoGenTsBinary}"`,
        "--js_out", `"import_style=commonjs,binary:${outputDir}"`,
        "--ts_out", `"service=grpc-web:${outputDir}"`,
        "*.proto"
    ], inputDir);

    console.log("generated:", fs.readdirSync(outputDir));
}
