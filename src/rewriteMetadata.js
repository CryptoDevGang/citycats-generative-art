var fs = require('fs');

function rewriteMetadataFiles(directoryName) {
    for (let i = 1; i <= 2050; i++) {
        const fileName = `${directoryName}/${i}_metadata.json`;
        const dstFileName = `${directoryName}/dst/${i}.json`;
        fs.readFile(fileName, 'utf-8', (err, data) => {
            if (err) throw err
            const jsonData = JSON.parse(data);

            const jsonResult = {
                'name': jsonData['name'],
                'image': `ipfs://QmQMS7N6S9SvosrQNorup2X2Vasyi6fHeu8ykuvPn75gLU/${i}.png`,
                'attributes': jsonData['attributes']
            }

            fs.writeFile(dstFileName, JSON.stringify(jsonResult, null, 2), (err, data) => {
                if (err) throw err
                console.log(jsonResult);
            });
        });
    }
}

(() => {
    // rewriteMetadataFiles('/Users/cryptogang/develop/git/generative-art-node/resource');
})();

module.exports = {rewriteMetadataFiles};