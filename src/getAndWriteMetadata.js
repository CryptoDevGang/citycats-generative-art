var fs = require('fs');
const path = require('path');

const buildDir = '/Users/cryptogang/Documents/citycats/picked_nft';
const metadataDir = '/Users/cryptogang/Documents/citycats/total_nft';

function readFiles(dir0, processFile) {
    // read directory
    for (let i = 5; i <= 12; i++) {
        const dir = `${dir0}/${i}`;
        console.log(dir);
        fs.readdir(`${dir}`, (error, fileNames) => {
            if (error) {
                throw error;
            }

            fileNames.forEach(filename => {
                // get current file name
                const name = path.parse(filename).name;
                // get current file extension
                const ext = path.parse(filename).ext;
                // get current file path
                const filepath = path.resolve(dir, filename);

                // get information about the file
                fs.stat(filepath, function (error, stat) {
                    if (error) {
                        throw error;
                    }

                    // check if the current path is a file or a folder
                    const isFile = stat.isFile();

                    // exclude folders
                    if (isFile) {
                        // callback, do something with the file
                        processFile(filepath, name, ext, stat);
                    }
                });
            });
        });
    }
}

(() => {
    readFiles(buildDir, (filepath, name, ext, stat) => {
        if (ext === '.png') {
            const rarityNumber = filepath.split('/')[6]
            console.log(rarityNumber + ': ' + name);

            const metadataFilePath = metadataDir + '/' + rarityNumber + '/' + name + '_metadata.json';
            const copyMetadataFilePath = buildDir + '/' + rarityNumber + '/' + name + '_metadata.json';
            // let json = require(metadataFilePath);

            fs.copyFile(metadataFilePath, copyMetadataFilePath, (err) => {
                if (err) throw err;
                console.log(metadataFilePath + ' => ' + copyMetadataFilePath);
            });
        }
    })
})();

module.exports = {readFiles};