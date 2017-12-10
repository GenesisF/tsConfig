const SAFE_REPLACE = require('safe-replace').create({ tmp: 'tmp', bak: 'bak' });
const READ_PKG_UP = require('read-pkg-up');
const PATH = require('path');
const FS = require('fs-extra');
const MERGE = require('lodash.merge');

const SEP = PATH.sep;
const TS_CONIFG_FILE_NAME = 'tsconfig.json'

//Get package.json and tsconfig.json
Promise.all([READ_PKG_UP(), FS.readJson(PATH.normalize(`${__dirname}${SEP}${TS_CONIFG_FILE_NAME}`))])
	.then((results) => {
		
		let result = results[0];

		result.tsconfig = result[1];
		result.tsconfigPath = PATH.normalize(`${PATH.parse(result.path).dir}${SEP}${TS_CONIFG_FILE_NAME}`);

		//Add typescript build command to package npm scripts
		MERGE(result.pkg, {
			scripts: {
				"ts-build": "tsc",
			}
		});

		//Merge current tsconfig with new tsconfig and ensure tsconfig path
		//Does NOT overwrite current tsconfig
		return FS.pathExists(result.tsconfigPath)
			.then((exsists)=> exsists ? FS.readJson(result.tsconfigPath) : null)
			.then((curTsconfig)=> curTsconfig === null ? FS.ensureFile(result.tsconfigPath) : MERGE(result.tsconfig, curTsconfig))
			.then(()=>result);

	})
	//Write changes to package and tsconfig
	.then((result)=>{
		return Promise.all([
			SAFE_REPLACE.writeFileAsync(result.tsconfigPath, new Buffer(JSON.stringify(result.tsconfig, null, 2))),
			SAFE_REPLACE.writeFileAsync(result.path, new Buffer(JSON.stringify(result.pkg, null, 2)))
		]);
	})
	.then(()=> console.log(`"tsconfig" init complete.`))
	.catch(console.error);
