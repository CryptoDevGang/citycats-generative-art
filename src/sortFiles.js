var fs = require('fs');

const buildDir = '/Users/cryptogang/develop/git/generative-art-node/build';

function sortFiles() {
    let i = 1;
    while (true) {
        const path = `${buildDir}/${i}.png`
        if (fs.existsSync(path)) {
            for (let e=5;e<=13;e++) {
                const metadataFile = `${buildDir}/${i}_metadata.json_${e}`;
                const dstMetadataFile = `${buildDir}/${i}_metadata.json`;
                if (fs.existsSync(metadataFile)) {
                    console.log(metadataFile);
                    fs.mkdirSync(`${buildDir}/${e}`, { recursive: true } );
                    fs.rename(metadataFile, `${buildDir}/${e}/${i}_metadata.json`, () => {});
                    fs.rename(path, `${buildDir}/${e}/${i}.png`, () => {});
                }
            }

            console.log(path);
        } else {
            return;
        }

        i++;
    }
}

(() => {
    sortFiles();
})();

module.exports = {sortFiles};