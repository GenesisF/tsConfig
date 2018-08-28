import * as fs from 'fs';
import * as path from 'path';
import * as mergewith from 'lodash.mergewith';

function arrayConcat(objVal, srcVal){

  if (objVal instanceof Array) {
   
    return Array.from(new Set(objVal.concat(srcVal)));
  
  };

};

const sep = path.sep;
const tsConfigFileName = 'tsconfig.json';
const iniCWD = process.env.INIT_CWD;
const curDir = __dirname;

const packageFilePath = path.normalize(`${iniCWD}${sep}package.json`);
const tsConfigFilePath = path.normalize(`${iniCWD}${sep}${tsConfigFileName}`);
const tsConfigTemplateFilePath = path.normalize(`${curDir}${sep}template.${tsConfigFileName}`);

const npmScripts = {
  main:"build/index.js",
  scripts: {
    "ts-build": "tsc",
    "build-ts": "tsc"
  }
};


(async ()=>{

  const packageJSON = await new Promise<any>((resolve, reject)=>{

    fs.readFile(packageFilePath,(err, packageJSON)=>{

      if(err){

        return reject(err);

      };

      resolve(JSON.parse(packageJSON.toString()));

    });

  });

  const tsConfig = await new Promise<any>((resolve, reject)=>{

    fs.readFile(tsConfigFilePath,(err, tsConfig)=>{

      if(err){

        return resolve({});

      };

      resolve(JSON.parse(tsConfig.toString()));

    });

  });


  if(Object.keys(tsConfig).length > 0){

    //backup tsconfig.json
    await new Promise((resolve, reject)=>{

      fs.copyFile(
        tsConfigFilePath,
        path.normalize(`${iniCWD}${sep}.tsconfig.json.BAK`)
        ,(err)=> err === null ? resolve() : reject(err));

    });

    const tsConfigTemplate = await new Promise<any>((resolve, reject)=>{

      fs.readFile(tsConfigTemplateFilePath,(err, tsConfigTemplate)=>{

        if(err){

          return reject(err);

        };

        resolve(JSON.parse(tsConfigTemplate.toString()));

      });

    });

    //Update tsconfig.json
    await new Promise((resolve, reject)=>{

      fs.writeFile(
        tsConfigFilePath,
        JSON.stringify(mergewith(tsConfig, tsConfigTemplate, arrayConcat), null, 2),
        (err)=> err === null ? resolve() : reject(err)
      );

    });


  //Add tsconfig
  } else {

    await new Promise((resolve, reject)=>{

      fs.copyFile(
        tsConfigTemplateFilePath,
        tsConfigFilePath
        ,(err)=> err === null ? resolve() : reject(err));

    });

  };

  //backup package.json
  await new Promise((resolve, reject)=>{

    fs.copyFile(
      packageFilePath,
      path.normalize(`${iniCWD}${sep}.package.json.BAK`)
      ,(err)=> err === null ? resolve() : reject(err));

  });
  
  //Update package.json
  await new Promise((resolve, reject)=>{

    fs.writeFile(
      packageFilePath,
      JSON.stringify(mergewith(packageJSON, npmScripts, arrayConcat), null, 2),
      (err)=> err === null ? resolve() : reject(err)
    );

  });

})();