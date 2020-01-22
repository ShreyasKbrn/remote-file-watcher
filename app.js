const Client = require('ssh2-sftp-client');
let sftp = new Client();
let timeOpts = ['modifyTime', 'accessTime'];
let time = timeOpts[0];

let sftpConnect = () => {
    return sftp.connect({
        host: '10.21.8.31',
        username: 'shreyas',
        password: 'nahisangnar'
    })
}

let getStats = (file) => {
    return sftp.stat(file);
}

let watchIfChanged =async (prevModified, folder) => {
     while(true) {
        let stats = await getStats(folder);
        let modified = stats[time];
         if (prevModified<modified) {
            return
         } else {
             
            prevModified=modified;
         }
     }
}

let listFiles = (folder) => {
    return sftp.list(folder);
};

let getDifference = (prevList, currList) => {
     let deletedFiles = [];
     let newFiles = [];
    prevList.forEach(file => {
        if (!currList.some(currFile =>  file.name === currFile.name)) {
            deletedFiles.push(file);
        }
    });
    currList.forEach(file => {
        if (!prevList.some(prevFile =>  file.name === prevFile.name)) {
            newFiles.push(file);
        }
    });
    return {
        del:deletedFiles,
        new:newFiles
    };
}

let main = async () => {
    let folder = '/home/shreyas/Pictures';
    await sftpConnect();
    while (true) {
        console.log('[WATCHER ITERATION '+new Date()+'] START');
        let list = await listFiles(folder);
        let stats = await getStats(folder);
        let modified = stats[time];
        await watchIfChanged(modified, folder)
        let newList = await listFiles(folder);
        let diff = getDifference(list, newList);
        console.log('[ITERATION INFO]: ', diff);
        console.log('[WATCHER ITERATION'+new Date()+'] END \n\n');
    }
    //sftp.end();
}

main();