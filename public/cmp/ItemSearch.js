const fs = require('fs');
const lineReader = require('line-reader');

const ignoreFolders = [
    '.git',
    'node_modules',
    'build',
    'test',
    'examples',
    'example',
    'benchmarks',
    '.next',
    'cypress'
];

const filterFoldersFN = (input) => {
    let directories = input.filter(e => fs.statSync(e.path).isDirectory() && ignoreFolders.indexOf(e.path.split('/').pop()) === -1);
    let files = input.filter(e => fs.statSync(e.path).isFile() && ignoreFolders.indexOf(e.path.split('/').pop()) === -1);
    return {directories, files};
}

const readData = (path) => {
    let response = fs.readdirSync(path);
    
    return response.map(e => {
        return {path: path + "/" + e}
    })
}

const findFiles = async (basePath) => {
    let filterFolders = filterFoldersFN(readData(basePath)).directories;
    let files = [];

    let filesDone = [];
    while(filterFolders.length > 0){
        const currentFolder = filterFolders.shift();
        const r = filterFoldersFN(readData(currentFolder.path));
        // Add folers to folder list
        filterFolders = [...filterFolders, ...r.directories];
        files = [...files, ...r.files];
    }

    for(let i = 0; i < files.length; i++) {
        let currentFile = files[i];
        let res = fs.readFileSync(currentFile.path, 'utf-8').split(/\r?\n/);
        let m = {
            path: currentFile.path.replace(basePath, 'root'),
            dependsOn: [],
            dependencies: []
        }
        res.forEach(e => {
            if(e.includes("import") && e.includes("from")){
                m.dependsOn.push(e.split(' from ').pop()
                .replace('"', '').replace('"', '') // Weird fix??
                .replace('\'', '').replace('\'', '').replace(";", ''));
            }
        })
        filesDone.push(m);
    }

    for(let i = 0; i < filesDone.length; i++) {
        let currentFile = filesDone[i];
        let currentFolder = currentFile.path.split("/")
        currentFolder.pop();
        currentFile.dependsOn.forEach(e => {
            if(e[0] === "."){
                let tt = e.split("/");
                let c = [...currentFolder];
                tt.forEach(es => {
                    if(es == "."){}
                    else if(es == ".."){
                        c.pop();
                    }else {
                        c.push(es);
                    }
                });
                
                let o = filesDone.indexOf(filesDone.filter(es => es.path.includes(c.join("/"))).shift());
                filesDone[o].dependencies.push(filesDone.indexOf(currentFile));
                filesDone[i].dependsOn[filesDone[i].dependsOn.indexOf(e)] = o;
            }
        });
    }
    return filesDone;
}

module.exports = findFiles