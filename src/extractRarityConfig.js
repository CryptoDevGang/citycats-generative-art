var fs = require('fs');
const path = require('path');

function readFiles(dir, tag) {
    let map = new Map();
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
                    if (name !== '.DS_Store') {
                        const a = name.split('.png_');
                        console.log(`'${tag}_${a[0]}': ${a[1]},`);
                    }
                }
            });
        });
    });
}

(() => {
    readFiles('/Users/cryptogang/develop/git/generative-art-node/layers/bg', 'bg');
    readFiles('/Users/cryptogang/develop/git/generative-art-node/layers/body', 'body');
    readFiles('/Users/cryptogang/develop/git/generative-art-node/layers/face', 'face');
    readFiles('/Users/cryptogang/develop/git/generative-art-node/layers/hair', 'hair');
    readFiles('/Users/cryptogang/develop/git/generative-art-node/layers/skin', 'skin');
})();