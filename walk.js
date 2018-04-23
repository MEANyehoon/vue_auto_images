const fs = require('fs');
const path = require('path');

function walk({
    path: dirPath,
    filter
}) {
    return (function(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirPath, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                result = result.map(name => {
                    return {
                        name,
                        path: path.join(dir, name)
                    }
                })
                resolve(result);
            })
        })
    })(dirPath).then(files => {
        return Promise.all(files.map(getStat))
    }).then(stats => {
        return filter ? stats.filter(filter) : stats;
    })
}

function getStat(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file.path, (err, stat) => {
            err ? reject(err) : resolve(Object.assign(stat, file));
        })
    })
}

module.exports = walk;