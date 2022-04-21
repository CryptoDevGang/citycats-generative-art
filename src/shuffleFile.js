var fs = require('fs');
const path = require('path');

const srcBuildDir = '/Users/cryptogang/Documents/citycats/picked_nft_shuffle_before';
const dstBuildDir = '/Users/cryptogang/Documents/citycats/picked_nft_shuffle_after';

function readFiles(dir) {
    // read directory
    let count = 1;
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
                    // processFile(filepath, name, ext, stat, count);
                    if (ext === '.json') {
                        const srcFilePath = srcBuildDir + '/' + name + '.png';
                        const dstFilePath = dstBuildDir + '/' + count + '.png';

                        const srcJsonPath = srcBuildDir + '/' + name + '.json';
                        const dstJsonPath = dstBuildDir + '/' + count + '.json';

                        console.log(`${srcFilePath} : ${dstFilePath}`);
                        console.log(`${srcJsonPath} : ${dstJsonPath}`);

                        fs.rename(srcFilePath, dstFilePath, () => {});
                        fs.rename(srcJsonPath, dstJsonPath, () => {});

                        count++

                        console.log(count);

                        /////// after

                        // let json = require(filepath);
                        // const jsonResult = {
                        //     'name': `CityCats #${name}`,
                        //     'image': `ipfs://QmNpX22Xyd8YUcrYrpTdqwFayWH81KH3C6QcsYkFE1nLNc/${name}.png`,
                        //     'attributes': json['attributes']
                        // }
                        //
                        // console.log(jsonResult);
                        // fs.writeFile(filepath, JSON.stringify(jsonResult, null, 2), (err, data) => {
                        //     if (err) throw err
                        // });
                    }
                }
            });
        });
    });
}

(() => {
    readFiles(srcBuildDir);
})();

module.exports = {readFiles};