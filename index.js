const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const walk = require('./walk');
const { writeFile } = require('./utils');

function vueAutoBuild() {
    this.projectNames = [];
    this.staticPath = '';
    this.routePath = '';
    this.dashboardPath = '';
    this.pagePath = '';
    this.templateStr = '';
    this.mainPagePath = '';
    this.imageCountOfProject = {};

    this.getStaticPath()
        .then(() => this.getProjectNames())
        .then(() => this.getImageCountOfProject())
        .then(() => this.removeRouteFile())
        .then(() => this.removeDashboardFile())
        .then(() => this.emptyPageDir())
        .then(() => this.writeRoute())
        .then(() => this.readTemplate())
        .then(() => this.writePages())
        .then(() => this.writeDashboard())
        .then(() => console.log(this))
        .catch(err => console.log('err =>', err));
}

vueAutoBuild.prototype.getStaticPath = function() {
    return new Promise((resolve, reject) => {
        this.staticPath = path.join(process.cwd(), 'static', 'project');
        fs.exists(this.staticPath, (exists) => {
            !exists
                ? reject(`${this.staticPath}目录不存在!`)
                : resolve();
        })
    })
}

vueAutoBuild.prototype.removeRouteFile = function() {
    return new Promise((resolve, reject) => {
        this.routePath = path.join(process.cwd(), 'src', 'router', 'index.js');
        fse.remove(this.routePath, err => {
            err ? reject(err) : resolve();
        })
    })
}

vueAutoBuild.prototype.removeDashboardFile = function() {
    return new Promise((resolve, reject) => {
        this.dashboardPath = path.join(process.cwd(), 'src', 'dashboard.vue');
        fse.remove(this.dashboardPath, err => {
            err ? reject(err) : resolve();
        })
    })
}

vueAutoBuild.prototype.emptyPageDir = function() {
    return new Promise((resolve, reject) => {
        this.pagePath = path.join(process.cwd(), 'src', 'page');
        fse.remove(this.routePath, err => {
            if (err) {
                reject(err)
            } else {
                fse.ensureDir(this.pagePath, err => {
                    err ? reject(err) : resolve()
                })
            }
        })
    })
}

vueAutoBuild.prototype.getPagePath = function() {
    return new Promise((resolve, reject) => {
        this.routePath = path.join(process.cwd(), 'src', 'page');
        fs.exists(this.routePath, (exists) => {
            !exists
                ? reject(`${this.routePath}文件不存在!`)
                : resolve();
        })
    })
}
vueAutoBuild.prototype.getProjectNames = function() {
    return walk({
        path: this.staticPath,
        filter: stat => stat.isDirectory()
    }).then(stats => {
        this.projectNames = stats.map(stat => stat.name);
    });
}

vueAutoBuild.prototype.getImageCountOfProject = function() {
    return Promise.all(this.projectNames.map(name => {
        const projectPath = path.join(this.staticPath, name);
        return walk({
            path: projectPath,
            filter: stat => /.\.png$/.test(stat.name)
        }).then(images => this.imageCountOfProject[name] = images.length)
    }))
}

vueAutoBuild.prototype.writeRoute = function() {
    return new Promise((resolve, reject) => {

        const depImportStr = [
            `import Vue from 'vue';`,
            `import Router from 'vue-router';`,
            `import dashboard from '../dashboard.vue'`
        ].join('\n');
        const pageImportStr = this.projectNames.map(name => {
            return `import ${name} from '../page/${name}.vue';`
        }).join('\n');
        const homeRouteStr = `{
            name: 'dashboard',
            path: '/',
            component: dashboard
        }`;
        const routeInfo = this.projectNames.map(name => {
            return `{
                name: '${name}',
                path: '/${name}',
                component: ${name}
            }`;
        });
        const routeStr = `export default new Router({
            routes: [${homeRouteStr}, ${routeInfo.join(', ')}]
        });`;
        const routeUseStr = `Vue.use(Router);`
        fse.outputFile(this.routePath, [depImportStr, pageImportStr, routeStr, routeUseStr].join('\n'), err => {
            err ? reject(err) : resolve()
        })
    })
}


vueAutoBuild.prototype.writeDashboard = function() {
    let templatePath = path.join(process.cwd(), 'dashboard.tpl.vue');
    templatePath = fs.existsSync(templatePath) ? templatePath : path.join(__dirname, 'dashboard.tpl');

    return new Promise((resolve, reject) => {
        fs.readFile(templatePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const dashboardStr = data.replace(/(#\{projectNames\})/g, matchStr => {
                    const matchs = {
                        '#{projectNames}': `[${this.projectNames.map(name => `"${name}"`).join(',')}]`,
                    }
                    return matchs[matchStr]
                })
                return writeFile(this.dashboardPath, dashboardStr);
            }
        })
    })

}

vueAutoBuild.prototype.readTemplate = function() {
    let templatePath = path.join(process.cwd(), 'page.tpl.vue');
    templatePath = fs.existsSync(templatePath) ? templatePath : path.join(__dirname, 'page.tpl')

    return new Promise((resolve, reject) => {
       fs.readFile(templatePath, 'utf8', (err, data) => {
           if (err) {
               reject(err);
           } else {
               this.templateStr = data;
               resolve();
           }
       })
    })
}

vueAutoBuild.prototype.writePages = function() {
    return Promise.all(this.projectNames.map(name => {
        const pageStr = this.templateStr.replace(/(#\{name\}|#\{count\})/g, matchStr => {
            const matchs = {
                '#{name}': name,
                '#{count}': this.imageCountOfProject[name]
            }
            return matchs[matchStr]
        })
        return writeFile(path.join(this.pagePath, `${name}.vue`), pageStr);
    }))
}

new vueAutoBuild()
