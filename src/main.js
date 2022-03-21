const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { layersOrder, format, rarity } = require("./config.js");

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];
const Exists = new Map();

// Custom
let metadataByRarity = [];

const addRarity = _str => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  // return itemRarity;
  const randomInt = getRandomInt(1, 5);
  // console.log("randomInt: " + randomInt);
  return randomInt;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

const cleanName = _str => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layersSetup = layersOrder => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number
  }));

  return layers;
};

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`${buildDir}/${_edition}.png`, _canvas.toBuffer("image/png"));
};

const addMetadata = _edition => {
  let dateTime = Date.now();
  let tempMetadata = {
    // hash: hash.join(""),
    // decodedHash: decodedHash,
    // date: dateTime,
    name: `CityCats #${_edition}`,
    edition: _edition,
    attributes: attributes,
  };

  // Start
  let sum = 0;
  attributes.forEach(attribute => {
    sum += Number(attribute.rarity);
  })

  // initialize
  attributes = [];
  hash = [];
  decodedHash = [];

  if (sum > 13) {
    console.log('sum: ' + sum);
    metadataByRarity.push(tempMetadata);

    createEachFile(_edition, tempMetadata);
    return;
  }
  // End

  // metadata.push(tempMetadata);
  // attributes = [];
  // hash = [];
  // decodedHash = [];
  //
  // createEachFile(_edition, tempMetadata);
};

const createEachFile = (_edition, metadata0) => {
  fs.stat(`${buildDir}/${_edition}${metDataFile}`, (err) => {
    if(err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${_edition}${metDataFile}`, JSON.stringify(metadata0, null, 2));
    } else {
      console.log('Oh no, error: ', err.code);
    }
  });
}

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    // id: _element.id,
    // rarity: _element.rarity,
    value: _element.name,
    trait_type: _layer.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

const drawLayer = async (_layer, _edition) => {
  const rand = Math.random();
  let element =
    _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
  if (element) {
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);

    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition);
  }
};

const createFiles = async edition => {
  const layers = layersSetup(layersOrder);

  let numDupes = 0;
 for (let i = 1; i <= edition; i++) {
   await layers.forEach(async (layer) => {
     await drawLayer(layer, i);
   });

   let key = hash.toString();
   if (Exists.has(key)) {
     console.log(
       `Duplicate creation for edition ${i}. Same as edition ${Exists.get(
         key
       )}`
     );
     numDupes++;
     if (numDupes > edition) break; //prevents infinite loop if no more unique items can be created
     i--;
   } else {
     Exists.set(key, i);
     addMetadata(i);
     console.log("Creating edition " + i);
   }
 }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if(err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
        console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData };
