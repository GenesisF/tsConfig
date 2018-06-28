"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const mergewith = require("lodash.mergewith");
function arrayConcat(objVal, srcVal) {
    if (objVal instanceof Array) {
        return Array.from(new Set(objVal.concat(srcVal)));
    }
    ;
}
;
const sep = path.sep;
const tsConfigFileName = 'tsconfig.json';
const iniCWD = process.env.INIT_CWD;
const curDir = __dirname;
const packageFilePath = path.normalize(`${iniCWD}${sep}package.json`);
const tsConfigFilePath = path.normalize(`${iniCWD}${sep}${tsConfigFileName}`);
const tsConfigTemplateFilePath = path.normalize(`${curDir}${sep}template.${tsConfigFileName}`);
const npmScripts = {
    main: "build/index.js",
    scripts: {
        "ts-build": "tsc"
    }
};
(() => __awaiter(this, void 0, void 0, function* () {
    const packageJSON = yield new Promise((resolve, reject) => {
        fs.readFile(packageFilePath, (err, packageJSON) => {
            if (err) {
                return reject(err);
            }
            ;
            resolve(JSON.parse(packageJSON.toString()));
        });
    });
    const tsConfig = yield new Promise((resolve, reject) => {
        fs.readFile(tsConfigFilePath, (err, tsConfig) => {
            if (err) {
                return resolve({});
            }
            ;
            resolve(JSON.parse(tsConfig.toString()));
        });
    });
    if (Object.keys(tsConfig).length > 0) {
        //backup tsconfig.json
        yield new Promise((resolve, reject) => {
            fs.copyFile(tsConfigFilePath, path.normalize(`${iniCWD}${sep}.tsconfig.json.BAK`), (err) => err === null ? resolve() : reject(err));
        });
        const tsConfigTemplate = yield new Promise((resolve, reject) => {
            fs.readFile(tsConfigTemplateFilePath, (err, tsConfigTemplate) => {
                if (err) {
                    return reject(err);
                }
                ;
                resolve(JSON.parse(tsConfigTemplate.toString()));
            });
        });
        //Update tsconfig.json
        yield new Promise((resolve, reject) => {
            fs.writeFile(tsConfigFilePath, JSON.stringify(mergewith(tsConfig, tsConfigTemplate, arrayConcat), null, 2), (err) => err === null ? resolve() : reject(err));
        });
        //Add tsconfig
    }
    else {
        yield new Promise((resolve, reject) => {
            fs.copyFile(tsConfigTemplateFilePath, tsConfigFilePath, (err) => err === null ? resolve() : reject(err));
        });
    }
    ;
    //backup package.json
    yield new Promise((resolve, reject) => {
        fs.copyFile(packageFilePath, path.normalize(`${iniCWD}${sep}.package.json.BAK`), (err) => err === null ? resolve() : reject(err));
    });
    //Update package.json
    yield new Promise((resolve, reject) => {
        fs.writeFile(packageFilePath, JSON.stringify(mergewith(packageJSON, npmScripts, arrayConcat), null, 2), (err) => err === null ? resolve() : reject(err));
    });
}))();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qiw4Q0FBOEM7QUFFOUMscUJBQXFCLE1BQU0sRUFBRSxNQUFNO0lBRWpDLElBQUksTUFBTSxZQUFZLEtBQUssRUFBRTtRQUUzQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FFbkQ7SUFBQSxDQUFDO0FBRUosQ0FBQztBQUFBLENBQUM7QUFFRixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3JCLE1BQU0sZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO0FBQ3pDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUV6QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsY0FBYyxDQUFDLENBQUM7QUFDdEUsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDOUUsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsWUFBWSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFFL0YsTUFBTSxVQUFVLEdBQUc7SUFDakIsSUFBSSxFQUFDLGdCQUFnQjtJQUNyQixPQUFPLEVBQUU7UUFDUCxVQUFVLEVBQUUsS0FBSztLQUNsQjtDQUNGLENBQUM7QUFHRixDQUFDLEdBQVEsRUFBRTtJQUVULE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQU0sQ0FBQyxP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