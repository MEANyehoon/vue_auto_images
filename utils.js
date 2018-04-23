const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');


exports.writeFile = function(filePath, str){
    return new Promise((resolve, reject) => {
        fse.outputFile(filePath, str, err => {
            err ? reject(err) : resolve()
        })
    })
}