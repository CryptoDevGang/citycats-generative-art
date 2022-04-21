var fs = require('fs');
const path = require('path');

const buildDir = '/Users/cryptogang/Documents/citycats/picked_nft_shuffle';

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
        if (ext === '.json') {
            // const filePath0 = filepath.split('_metadata.json')[0];
            // const renamedFilePath0 = filePath0 + '.json';
            // console.log(renamedFilePath0);
            // fs.rename(filepath, renamedFilePath0, () => {});
            let json = require(filepath);

            json['attributes'].forEach(attr => {
                const value = attr['value'];
                const newValue = value.split('.png')[0];
                attr['value'] = newValue;
            });


            const jsonResult = {
                'name': json['name'],
                'attributes': json['attributes']
            }

            // console.log(JSON.stringify(jsonResult, null, 2));

            fs.writeFile(filepath, JSON.stringify(jsonResult, null, 2), (err, data) => {
                if (err) throw err
                console.log(jsonResult);
            });
        }
    })
})();

module.exports = {readFiles};