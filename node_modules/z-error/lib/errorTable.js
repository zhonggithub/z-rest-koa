/**
 * ProjectName: z-error
 * FileName: errorTable.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/9/5
 * Description:
 */
const fs = require('fs');
let assert = require('assert');

let errorCodeTable = null;
try{
    const data = '';
    if (process.env.Z_ERROR_TABLE) {
        data = fs.readFileSync('./../../../errorTable.json');
    } else {
        data = fs.readFileSync(__dirname + '/errorTable.json');
    }
    errorCodeTable = JSON.parse(data);
}
catch (err){
    console.warn('may be read file errorTable.json fail or json parse error!');
}

let missingReg = new RegExp('^Missing ');
let missingParam2Code = {};
for(let property in errorCodeTable.en){
    if(missingReg.test(errorCodeTable.en[property])){
        let strV = errorCodeTable.en[property].split( /[ .]/);
        assert(strV.length>=2);
        assert(strV[0]==='Missing');

        let text = strV[1];
        for( let i=2; i<strV.length; i++){
            text += strV[i].substring(0,1).toUpperCase() + strV[i].substring(1);
        }
        missingParam2Code[text] = Number(property);
    }
}

let formatReg = new RegExp('^Incorrect ');
let formatParam2Code = {};
for(let property in errorCodeTable.en){
    if(formatReg.test(errorCodeTable.en[property])){
        let strV = errorCodeTable.en[property].split( /[ .]/);
        assert(strV.length>=2);
        assert(strV[0]==='Incorrect');

        let text = strV[1];
        for( let i=2; i<strV.length; i++){
            if(strV[i]==='format'){ break; }
            text += strV[i].substring(0,1).toUpperCase() + strV[i].substring(1);
        }
        formatParam2Code[text] = Number(property);
    }
}

let resourcesDoesNotExistReg = new RegExp('does not exist.$');
let resourcesDoesNotExist2Code = {};
for(let property in errorCodeTable){
    if(resourcesDoesNotExistReg.test(errorCodeTable.en[property])){
        let strTemp = errorCodeTable.en[property].split( /does not exist./);
        let strV = strTemp[0].split(' ');
        assert(strV.length>=2);

        let text = strV[0].toLowerCase();
        for( let i=1; i<strV.length; i++){
            text += strV[i].substring(0,1).toUpperCase() + strV[i].substring(1);
        }
        resourcesDoesNotExist2Code[text] = Number(property);
    }
}

exports.errorTabel = errorCodeTable;

exports.errorCode2Text = function( code ){
    return errorCodeTable.en.hasOwnProperty(code) ? errorCodeTable.en[code] : errorCodeTable.en[9999];
};
exports.missingParam2Code = function( param ){
    return missingParam2Code.hasOwnProperty(param)?missingParam2Code[param] : 9998;
};
exports.formatParam2Code = function( param ){
    return formatParam2Code.hasOwnProperty(param)?formatParam2Code[param] : 3999;
};
exports.resourcesDoesNotExist2Code = function( resources ){
    return resourcesDoesNotExist2Code.hasOwnProperty(resources)?resourcesDoesNotExist2Code[resources] : 1599;
};
exports.getMessage = (code, local) => {
    if(!code){
        return '';
    }
    switch(local){
        case 'zh-cn': {
           return errorCodeTable[local][code]; 
        }break;
        default:{
            return errorCodeTable.en[code];
        }break;
    }
};
