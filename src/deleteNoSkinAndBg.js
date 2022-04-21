var fs = require('fs');
const path = require('path');

const buildDir = '/Users/cryptogang/develop/git/generative-art-node/build/build';

function readFiles(dir0, processFile) {
  // read directory
  for (let i = 5; i <= 13; i++) {
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
    let isExistSkin = false;
    let isExistBackground = false;

    if (ext === '.json') {
      let json = require(filepath);
      json.attributes.forEach(attr => {
        if (String(attr.trait_type).toLowerCase() === 'skin') {
          isExistSkin = true;
        } else if (String(attr.trait_type).toLowerCase() === 'bg') {
          isExistBackground = true;
        }
      })
      const jsonPath = filepath;
      const imageFilePath = filepath.split('_')[0] + '.png';

      if (isExistBackground === false || isExistSkin === false) {
        fs.unlink(jsonPath, (err) => {
          if (err) {
            console.error(err)
            return;
          }
        })
        //file removed
        console.log(`remove json file: ${jsonPath}`);

        fs.unlink(imageFilePath, (err) => {
          if (err) {
            console.error(err)
            return;
          }
        })
        //file removed
        console.log(`remove image file: ${imageFilePath}`);
      }
    }
  })
})();

module.exports = {readFiles};