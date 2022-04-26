let fs = require('fs');
const path = require('path');
let CryptoJS = require("crypto-js");
let RarityConfig = require('./rarityConfig.js');

const TARGET_DIR = '/Users/cryptogang/test-set';
let rarityHashMap = new Map();

console.log(RarityConfig);

function readFiles(dir) {
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
                        checkRarityHash(filepath);
                    }
                }
            });
        });
    });
}

function checkRarityHash(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) throw err
        const jsonData = JSON.parse(data);

        let map = new Map(); // map for checking MD5 hash
        let sumOfRarity = 0;
        for (let attr of jsonData['attributes']) {
            // set trait to map
            const traitType = attr['trait_type'];
            const traitValue = attr['value'].split('.png')[0];

            map.set(traitType, traitValue);

            // check if rarity is wrong
            const rarity = RarityConfig.getRarity(traitType, traitValue);
            if (isNaN(rarity)) {
                console.error('Something is wrong. filePath: ' + filePath);
                console.error(map);
            }
            sumOfRarity += rarity;
        }
        console.log('filePath: ' + filePath + '=> sumOfRarity: ' + sumOfRarity);

        const strChain = String(map.get('bg') + map.get('body') + map.get('face') + map.get('face') + map.get('hair') + map.get('skin')).trim().toUpperCase();
        const hash = CryptoJS.MD5(strChain).toString();
        // console.log('hash: ' + hash);

        if (rarityHashMap.get(hash) === true) {
            console.error("!Rarity Collision. filePath: " + filePath);
        } else {
            rarityHashMap.set(hash, true);
        }
    });
}

(() => {
    readFiles(TARGET_DIR);
})();