
const atus = {
    '001': {number: "0", color: 'fee74d', id: '001', linked: [
            {id:'003', value:['2S','7S']},
            {id:'400', value:'3S'},
            {id:'020', value:['4S','8S']},
            {id:'004', value:'5S'},
            {id:'002', value:'6S'},
            {id:'080', value:'9S'},
            {id:'200', value:'10S'},

            // zodiac
            {id:'030', value:['2S', '3S', '4S']},
            {id:'090', value:['5S', '6S', '7S']},
            {id:'007', value:['8S', '9S', '10S']},

            {id:'040', value:['PC', 'QS']},
        ]},
    '002': {number: "1", color: 'FEDD00', id: '002'},
    '003': {number: "2", color: '0085ca', id: '003'},
    '004': {number: "3", color: '00A550', id: '004'},
    '005': {number: "4", color: 'ed2800', id: '005', linked: [{id:'080', value:'2W'}, {id:'200', value:'3W'}, {id:'004', value:'4W'}]},
    '006': {number: "5", color: 'FF4E00', id: '006', linked: [{id:'002', value:'5D'}, {id:'003', value:'6D'}, {id:'400', value:'7D'}]},
    '007': {number: "6", color: 'FF6D00', id: '007', linked: [{id:'020', value:'8S'}, {id:'080', value:'9S'}, {id:'200', value:'10S'}]},
    '008': {number: "7", color: 'ffb734', id: '008', linked: [{id:'004', value:'2C'}, {id:'002', value:'3C'}, {id:'003', value:'4C'}]},
    '009': {number: "11", color: 'E5D708', id: '009', linked: [{id:'400', value:'5W'}, {id:'020', value:'6W'}, {id:'080', value:'7W'}]},
    '010': {number: "9", color: '59B934', id: '010', linked: [{id:'200', value:'8D'}, {id:'004', value:'9D'}, {id:'002', value:'10D'}]},
    '020': {number: "10", color: '8C15C4', id: '020'},
    '030': {number: "8", color: '00A550', id: '030', linked: [{id:'003', value:'2S'}, {id:'400', value:'3S'}, {id:'020', value:'4S'}]},
    '040': {number: "12", color: '0246bc', id: '040', linked: [
            {id:'004', value:['2C','7C']},
            {id:'002', value:'3C'},
            {id:'003', value:'4C'},
            {id:'080', value:['5C', '10C']},
            {id:'200', value:'6C'},
            {id:'400', value:'8C'},
            {id:'020', value:'9C'},

            // zodiac
            {id:'008', value:['2C', '3C', '4C']},
            {id:'050', value:['5C', '6C', '7C']},
            {id:'100', value:['8C', '9C', '10C']}
        ]},
    '050': {number: "13", color: '00958d', id: '050', linked: [{id:'080', value:'5C'}, {id:'200', value:'6C'}, {id:'004', value:'7C'}]},
    '060': {number: "14", color: '0085ca', id: '060', linked: [{id:'002', value:'8W'}, {id:'003', value:'9W'}, {id:'400', value:'10W'}]},
    '070': {number: "15", color: '001489', id: '070', linked: [{id:'020', value:'2D'}, {id:'080', value:'3D'}, {id:'200', value:'4D'}]},
    '080': {number: "16", color: 'ed2800', id: '080'},
    '090': {number: "17", color: '5c00cc', id: '090', linked: [{id:'004', value:'5S'}, {id:'002', value:'6S'}, {id:'003', value:'7S'}]},
    '100': {number: "18", color: 'AE0E36', id: '100', linked: [{id:'400', value:'8C'}, {id:'020', value:'9C'}, {id:'080', value:'10C'}]},
    '200': {number: "19", color: 'FF6D00', id: '200'},
    '300': {number: "20", color: 'ff3300', id: '300', linked: [
            // planets
            {id:'080', value:['2W', '7W']},
            {id:'200', value:'3W'},
            {id:'004', value:'4W'},
            {id:'400', value:['5W','10W']},
            {id:'020', value:'6W'},
            {id:'002', value:'8W'},
            {id:'003', value:'9W'},

            // zodiac
            {id:'005', value:['2W', '3W', '4W']},
            {id:'009', value:['5W', '6W', '7W']},
            {id:'060', value:['8W', '9W', '10W']},

            // elemental
            {id:'001', value:['KS', 'PW']},
            {id:'040', value:['KC', 'QW']}
        ]},
    '400': {number: "21", color: '001489', id: '400'}
}

const rowsGroups = [
    atus['001'], atus['040'], atus['300'],
    atus['003'], atus['002'], atus['004'], atus['200'], atus['080'], atus['020'], atus['400'],
    atus['005'], atus['006'], atus['007'], atus['008'], atus['009'], atus['010'], atus['030'], atus['050'], atus['060'], atus['070'], atus['090'], atus['100']
];

const rowsKabalah = [
    atus['001'],
    atus['002'],
    atus['003'],
    atus['004'],
    atus['005'],
    atus['006'],
    atus['007'],
    atus['008'],
    atus['009'],
    atus['010'],
    atus['020'],
    atus['030'],
    atus['040'],
    atus['050'],
    atus['060'],
    atus['070'],
    atus['080'],
    atus['090'],
    atus['100'],
    atus['200'],
    atus['300'],
    atus['400']
];

const rowsRainbow = [
    atus['300'], atus['001'], atus['040'],
    atus['080'], atus['200'], atus['002'], atus['004'], atus['003'], atus['400'], atus['020'],
    atus['005'], atus['006'], atus['007'], atus['008'], atus['009'], atus['010'], atus['030'], atus['050'], atus['060'], atus['070'], atus['090'], atus['100']
];

module.exports = {
    rowsKabalah,
    rowsRainbow,
    rowsGroups,
    atus
};
