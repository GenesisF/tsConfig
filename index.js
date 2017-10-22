var path = require('path');
var fs = require('fs');

function getPackageJSONFilePath(dir){

	if(dir === path.parse(dir).root){
		return Promise.reject(new Error('package.json not be found.  Could NOT finish ini "ts-config".'));
	};

	var searchDir = path.join(dir,'..');

	return (new Promise((resolve,reject)=>{
		
		fs.readdir(searchDir, function(err, files){
			if(err){
				return reject(err);
			};
			resolve(files);
		});
	
	})).then(function(files){
		var packageJSONIndex = files.indexOf('package.json');
		if(packageJSONIndex > -1){
			return path.normalize(searchDir + path.sep + files[packageJSONIndex]);
		} else {
			return getPackageJSONFilePath(searchDir);
		};
	});
};

function copyFileTo(src, dest){
	return new Promise(function(resolve, reject){
		var writeStream = fs.createWriteStream(dest);
		fs.createReadStream(src)
			.pipe(writeStream)
			.on('error',reject)
			.on('close',function(){ resolve(); });
	});
};

getPackageJSONFilePath(__dirname)
	//Copy tsconfig.json to project root dir
	.then((packgeJSONFilePath)=>{
		
		var tsConfigSrcFilePath = path.normalize(
			__dirname + 
			path.sep + 
			'tsconfig.json'
		);

		tsConfigDestFilePath = path.normalize(
			path.dirname(packgeJSONFilePath) + 
			path.sep + 
			path.basename(tsConfigSrcFilePath)
		);
		
		return copyFileTo(tsConfigSrcFilePath, tsConfigDestFilePath)
			.then(function(){return packgeJSONFilePath;});
	})
	//Create Backup PackageJSON
	.then(function(packgeJSONFilePath){
		var packageJSON = require(packgeJSONFilePath);
		return copyFileTo(packgeJSONFilePath, packgeJSONFilePath+'.BAK')
			.then(function(){return [packgeJSONFilePath, packageJSON];});
	})
	//Update PackageJSON with npm scripts for ts
	.then(function(packageJSONPathAndObj){
		
		var packgeJSONFilePath = packageJSONPathAndObj[0];
		var packageJSON =packageJSONPathAndObj[1];
		
		if(!('scripts' in packageJSON)){
			packageJSON.scripts = {};
		};
		
		var scripts = packageJSON.scripts;
		
		scripts['ts-build'] = 'tsc';
		scripts['ts-dev'] = 'tsc -w';

		return (new Promise(function(resolve, reject){
			fs.writeFile(packgeJSONFilePath,JSON.stringify(packageJSON,null,2),function(err){
				if(err){
					return reject(err);
				};
				resolve(packgeJSONFilePath);
			});
		}));

	})
	//Remove package.json.BAK
	.then(function(packgeJSONFilePath){
		return (new Promise(function(resolve, reject){
			fs.unlink(packgeJSONFilePath+'.BAK',function(err){
				if(err){
					return reject(err);
				};
				resolve(packgeJSONFilePath);
			});
			resolve();
		}));
	})
	.catch(console.error);


