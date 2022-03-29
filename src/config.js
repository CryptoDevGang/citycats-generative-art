const layersOrder = [
    { name: 'bg', number: 26 },
    { name: 'skin', number: 59 },
    { name: 'body', number: 44 },
    { name: 'hair', number: 50 },
    { name: 'face', number: 46 },
    // { name: 'bg_test', number: 1 },
    // { name: 'body_test', number: 2 },
];
  
const format = {
    width: 600,
    height: 600
};

const rarity = [
    { key: "_1", val: "1" },
    { key: "_2", val: "2" },
    { key: "_3", val: "3" }
];

const defaultEdition = 50000;

module.exports = { layersOrder, format, rarity, defaultEdition };