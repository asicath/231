const EasingFunctions = require('./easing');

const words = {

    'aleph': {
        key: '001',
        text: '#8ABAD3',
        fore: '#00958D',
        back: '#fee74d',
        backEnd: '#00A550',
        backFlecked: '#D4AF37',

        imgSrc: '001-color.png',
        minDuration: 1000*3.0,
        parts: [
            {text:'A', beats: 1, countx: 4.10, audio: 'high'},
            {text:'ع', beats: 1, countx: 3.86, audio: 'low'},
            {text:'u', beats: 2, countx: 7.05, audio: 'low'},

            {text:'i', beats: 1, countx: 4.08, audio: 'low'},
            {text:'a', beats: 1, countx: 3.99, audio: 'high'},
            {text:'o', beats: 2, countx: 8.17, audio: 'low'},

            {text:'u', beats: 1, countx: 3.97, audio: 'low'},
            {text:'ع', beats: 1, countx: 4.44, audio: 'low'},
            {text:'a', beats: 2, countx: 8.34, audio: 'high'}
        ]
    },
    'beth':{
        key: '002',
        text: '#BB29BB',
        fore: '#bfbfbf',
        back: '#FEDD00',
        backEnd: '#001489',
        backEndRayed: '#5c00cc',

        imgSrc: '002-color.png',
        minDuration: 1000 * 2.5,
        parts: [
            // Beعθaoooabitom
            {text:'Be', beats:4, audio:'high'},
            {text:'ع', beats:6, audio:'low'},
            {text:'θa', beats:4, audio:'high'},
            {text:'o', beats:10, audio:'low'},
            {text:'o', beats:6, audio:'low'},
            {text:'o', beats:4, audio:'low'},
            {text:'a', beats:6, audio:'high'},
            {text:'bi', beats:4, audio:'high'},
            {text:'tom', beats:6, audio:'low'}
        ]
    },
    'gimel':{
        key: '003',
        back: '#0085ca', // KING
        text: '#e8e8e8', // QUEEN
        fore: '#A5C5D9', // EMPEROR
        backEnd: '#e8e8e8', // EMPRESS
        backEndRayed: '#8ABAD3',

        imgSrc: '003-color.png',
        minDuration: 1000 * 2,
        parts: [
            // Gitωnosapφωllois
/*            {text:'Gi', beats:5.23, audio:'low'},
            {text:'tω', beats:7.54, audio:'low'},
            {text:'no', beats:5.23, audio:'low'},
            {text:'sap', beats:9.51, audio:'high'},
            {text:'φωl', beats:7.68, audio:'low'},
            {text:'lo', beats:5.09, audio:'low'},
            {text:'is', beats:7.72, audio:'low'}*/

            // Gitωnosapφωllois
            {text:'Gi', beats:5, audio:'low'},
            {text:'tω', beats:8, audio:'low'},
            {text:'no', beats:5, audio:'low'},
            {text:'sap', beats:12, audio:'high'},
            {text:'φωl', beats:8, audio:'low'},
            {text:'lo', beats:5, audio:'low'},
            {text:'is', beats:8, audio:'low'}
        ]
    },
    /*    'gimel':{
            back: '#0085ca',
            imgSrc: '003-color.png',
            minDuration: 1000 * 2,
            parts: [
                // Gitωnosapφωllois
                {text:'Gi',  beats: 4.87, audio:'low'},
                {text:'tω',  beats: 7.69, audio:'low'},
                {text:'no',  beats: 4.80, audio:'low'},
                {text:'sap', beats:10.44, audio:'high'},
                {text:'φωl', beats: 7.83, audio:'low'},
                {text:'lo',  beats: 4.80, audio:'low'},
                {text:'is',  beats: 8.38, audio:'low'}
            ]
        },*/
    'daleth': {
        key: '004',
        back: '#00A550', // KING
        text: '#bfff40', // QUEEN
        fore: '#8ABAD3', // EMPEROR
        backEnd: '#C51959', // EMPRESS
        backEndRayed: '#B2E79F',

        imgSrc: '004-color.png',
        minDuration: 1000 * 1.5,
        parts: [
/*            {text:'dηn', beats:2, audio:'high'},
            {text:'a', beats:1.3, audio:'low'},
            {text:'star', beats:2, audio:'high'},
            {text:'tar', beats:1, audio:'high'},
            {text:'ωθ', beats:2.5, audio:'low'}*/

            {text:'Dηn', beats:4, audio:'high'},
            {text:'a', beats:3, audio:'low'},
            {text:'ⲝar', beats:4, audio:'high'},
            {text:'ta', beats:2, audio:'high'},
            {text:'rω', beats:2, audio:'low'},
            {text:'θ', beats:3}
        ]
    },
    'heh':{
        key: '005',
        back: '#ed2800', // KING
        text: '#f5ac1c', // QUEEN
        fore: '#EF3340', // EMPEROR
        backEnd: '#ff0011', // EMPRESS

        imgSrc: '005-color3.png',
        minDuration: 1000 * 2,
        parts: [
            // Hoo-oorω-iⲝ
            {text:'Ho', beats:1, audio:'high'},
            {text:'o', beats:1, audio:'high'},
            {text:'o', beats:1, audio:'high'},
            {text:'o', beats:2, audio:'high'},
            {text:'rω', beats:1, audio:'low'},
            {text:'iⲝ', beats:2, audio:'low'}
        ]
    },
    'vav':{
        key: '006',
        back: '#FF4E00', // KING
        text: '#000d59', // QUEEN
        fore: '#C7B63C', // EMPEROR
        backEnd: '#5c3312', // EMPRESS

        imgSrc: '006-color.png',
        minDuration: 1000 * 1.2,
        parts: [
            // Vuaretza
            {text:'Vu', beats:6, audio:'low'},
            {text:'a', beats:2, audio:'high'},
            {text:'re', beats:4, audio:'high'}, // maybe 3?
            {text:'tza', beats:5, audio:'high'}
        ]
    },
    'zain':{
        key: '007',
        back: '#FF6D00', // KING
        text: '#c6a1cf', // QUEEN
        fore: '#e8af36', // EMPEROR
        backEnd: '#b38f95', // EMPRESS

        imgSrc: '007-color.png',
        minDuration: 1000 * 2,
        parts: [
            // Zooωasar
            {text:'Z', beats:1, audio: 'chime'},
            {text:'o', beats:3, audio:'high'},
            {text:'o', beats:3, audio:'high'},
            {text:'ω', beats:4, audio:'low'},
            {text:'a', beats:2, audio:'high'},
            {text:'sar', beats:3, audio:'high'}
        ]
    },
    'cheth':{
        key: '008',
        back: '#ffb734', // KING
        text: '#800f13', // QUEEN
        fore: '#d60d0a', // EMPEROR
        backEnd: '#322F12', // EMPRESS

        imgSrc: '008-color.png',
        minDuration: 1000 * 3.5,
        includeClicks: true,
        parts: [
            // Chiva-abrahadabra-cadaxviii
            {text:'Chi', beats:2, audio:'low'},
            //{text:'', beats:1, audio:'click'},
            {text:'va', beats:2, audio:'low'},
            {text:'a', beats:1, audio:'high'},
            {text:'bra', beats:1, audio:'high'},
            {text:'ha', beats:1, audio:'high'},
            {text:'da', beats:3, audio:'high'},
            {text:'bra', beats:2, audio:'high'},

            {text:'ca', beats:2, audio:'low'},
            {text:'dax', beats:2, audio:'low'},
            {text:'vi', beats:2, audio:'high'},
            {text:'i', beats:2, audio:'high'},
            {text:'i', beats:4, audio:'high'},
        ]
    },
    'teth':{
        key: '009',
        back: '#E5D708', // KING
        text: '#550055', // QUEEN
        fore: '#bfbfbf', // EMPEROR
        backEnd: '#ff9934', // EMPRESS

        imgSrc: '009-color.png',
        minDuration: 1000 * 2.2,
        includeClicks: true,
        clicksPerMeasure: 12,
        parts: [
            {text:'θa', beats:5, audio:'low'},
            {text:'lع', beats:3, audio:'high'},
            {text:'ⲝer', beats:8, audio:'high'},
            {text:'ā', beats:8, audio:'low'},

            {text:'de', beats:5, audio:'high'},
            {text:'ker', beats:3, audio:'low'},
            {text:'val', beats:16, audio:'low'}
        ]
    },

    'yod':{
        key: '010',
        back: '#59B934', // KING
        text: '#9faeaa', // QUEEN
        fore: '#558c70', // EMPEROR
        backEnd: '#981733', // EMPRESS

        imgSrc: '010-color.png',
        minDuration: 1000 * 3,
        parts: [
            // Iehuvahaⲝanعθatan
            {text:'I', beats:2, audio:'high'},
            {text:'e', beats:2, audio:'high'},
            {text:'hu', beats:2, audio:'high'},
            {text:'vah', beats:2, audio:'high'},

            {text:'a', beats:1, audio:'low'},
            {text:'ⲝan', beats:2, audio:'low'},
            {text:'ع', beats:1, audio:'high'},
            {text:'θa', beats:1, audio:'low'},
            {text:'tan', beats:3, audio:'low'}
        ]
    },
    'kaph': {
        key: '020',
        back: '#8C15C4', // KING
        text: '#0085ca', // QUEEN
        fore: '#990099', // EMPEROR
        backEnd: '#00a8ff', // EMPRESS
        backEndRayed: '#fedd00',

        imgSrc: '020-color.png',
        minDuration: 1000*1.5, // 1.7
        parts: [
/*            {text:'Ke', beats: 6.33, audio: 'low'},
            {text:'ru', beats: 9.28, audio: 'low'},
            {text:'gu', beats: 6.45, audio: 'high'},
            {text:'na', beats: 9.65, audio: 'high'},
            {text:'vi', beats: 6.68, audio: 'high'},
            {text:'el', beats: 9.61, audio: 'low'},*/

            {text:'Ke', beats: 6, audio: 'high'},
            {text:'ru', beats: 10, audio: 'low'},
            {text:'gu', beats: 6, audio: 'low'},
            {text:'na', beats: 10, audio: 'high'},
            {text:'vi', beats: 6, audio: 'high'},
            {text:'el', beats: 10, audio: 'low'},
        ]
    },
    'lamed':{
        key: '030',
        text: '#0085ca',
        fore: '#008077',
        back: '#00A550',
        backEnd: '#a4e88b',

        imgSrc: '030-color.png',
        minDuration: 1000 * 2.5,
        clicksPerMeasure: 16,
        parts: [
            // Lusana her andraton
            {text:'Lu', beats:3, audio:'low'},
            {text:'sa', beats:1, audio:'high'},
            {text:'na', beats:2, audio:'high'},
            {text:'her', beats:2, audio: 'chime'},
            {text:'an', beats:3, audio:'low'},
            {text:'dra', beats:1, audio:'high'},
            {text:'ton', beats:4, audio:'high'}
        ]
    },
    'mem': {
        key: '040',
        back: '#0246bc', // KING
        text: '#149C88', // QUEEN
        fore: '#426300', // EMPEROR
        backEnd: '#ffffff', // EMPRESS
        backFlecked: '#BB29BB',

        imgSrc: '040-color.png',
        minDuration: 1000*1,
        customTimes: {
            drum03: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            drum02: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
        parts: [
            {text:'Ma', beats:16.14, audio:'low'},
            {text:'la', beats:16.16, audio: 'low'},
            {text:'i',  beats:15.70, audio: 'high'}
        ]
    },
    'nun':{
        key: '050',
        text: '#664b2d',
        fore: '#211307',
        back: '#00958d',
        backEnd: '#0c1225',

        imgSrc: '050-color.png',
        minDuration: 1000 * 3.7,
        clicksPerMeasure: 30,
        parts: [
            // Nadimraphoroiozعθalai

            {text:'Na', beats:1, audio:'high'},//4
            {text:'dim', beats:3, audio:'low'},

            {text:'ra', beats:3, audio:'high'},//15
            {text:'pho', beats:3, audio:'high'},
            {text:'ro', beats:2, audio:'high'},
            {text:'i', beats:1, audio:'high'},
            {text:'o', beats:3, audio:'high'},
            {text:'zع', beats:3, audio:'high'},

            {text:'tha', beats:3, audio:'low'},//11
            {text:'la', beats:3, audio:'low'},
            {text:'i', beats:5, audio:'high'}
        ]
    },
    'samekh':{
        key: '060',
        back: '#0085ca', // KING
        text: '#FEDD00', // QUEEN
        fore: '#00A550', // EMPEROR
        backEnd: '#003a80', // EMPRESS

        imgSrc: '060-color.png',
        minDuration: 1000 * 3,
        clicksPerMeasure: 14,
        parts: [
            // Salaθlala-amrodnaqعiⲝ
            {text:'Sa', beats:2, audio:'high'},
            {text:'laθ', beats:2, audio:'low'},
            {text:'la', beats:2, audio:'low'},
            {text:'la', beats:6, audio:'low'},
            {text:'am', beats:2, audio:'high'},
            {text:'rod', beats:4, audio:'high'},
            {text:'na', beats:2, audio:'low'},
            {text:'θع', beats:2, audio:'low'},
            {text:'iⲝ', beats:6, audio:'low'}
        ]
    },
    'ayin':{
        key: '070',
        back: '#001489', // KING
        text: '#000000', // QUEEN
        fore: '#000a44', // EMPEROR
        backEnd: '#16161d', // EMPRESS

        imgSrc: '070-color.png',
        minDuration: 1000 * 4,
        clicksPerMeasure: 16,
        parts: [
            // Oaoaaaoooع-iⲝ
            {text:'O', beats:1, audio:'low'},
            {text:'a', beats:1, audio:'high'},
            {text:'o', beats:1, audio:'low'},
            {text:'a', beats:1, audio:'high'},
            {text:'a', beats:1, audio:'high'},
            {text:'a', beats:1, audio:'high'},
            {text:'o', beats:1, audio:'low'},
            {text:'o', beats:1, audio:'low'},
            {text:'o', beats:2, audio:'low'},

            {text:'ع', beats:2, audio:'low'},
            {text:'i', beats:2, audio:'high'},
            {text:'ⲝ', beats:2, audio:'click'},
        ]
    },
    'pe': {
        key: '080',
        back: '#ed2800', // KING
        text: '#b32009', // QUEEN
        fore: '#EF3340', // EMPEROR
        backEnd: '#ff0000', // EMPRESS
        backEndRayed: '#00A550',

        imgSrc: '080-color3.png',
        //minDuration: 1000*2.5,
        minDuration: 1000*3,
        customTimes: {
            drum03: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            drum02: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
        parts: [
            // {text:'Pu', beats:5.65, audio:'low'},
            // {text:'raθ', beats:6.44, audio: 'low'},
            // {text:'me',  beats:3.07, audio: 'high'},
            // {text:'ta',  beats:3.16, audio: 'high'},
            // {text:'i',  beats:5.89, audio: 'high'},
            //
            // {text:'a', beats:5.75, audio:'low'},
            // {text:'pη', beats:5.93, audio: 'low'},
            // {text:'me',  beats:2.95, audio: 'high'},
            // {text:'ta',  beats:3.05, audio: 'high'},
            // {text:'i',  beats:6.12, audio: 'high'},

            {text:'Pu', beats:2, audio:'low'},
            {text:'raθ', beats:2, audio: 'low'},
            {text:'me',  beats:1, audio: 'high'},
            {text:'ta',  beats:1, audio: 'high'},
            {text:'i',  beats:2, audio: 'high'},

            {text:'a', beats:2, audio:'low'},
            {text:'pη', beats:2, audio: 'low'},
            {text:'me',  beats:1, audio: 'high'},
            {text:'ta',  beats:1, audio: 'high'},
            {text:'i',  beats:2, audio: 'high'},
        ]
    },
    'tzaddi':{
        key: '090',
        back: '#5c00cc', // KING
        text: '#8ABAD3', // QUEEN
        fore: '#ad78bd', // EMPEROR
        backEnd: '#ffe8ff', // EMPRESS

        imgSrc: '090-color.png',
        minDuration: 1000 * 2.4,
        clicksPerMeasure: 6,
        parts: [
            // XanθaⲝeranⲈϘ-iⲝ
            {text:'Xan', beats:2, audio:'low'},
            {text:'th', beats:1},
            {text:'a', beats:2, audio:'high'},
            {text:'ⲝer', beats:1, audio:'high'},
            {text:'an', beats:3, audio:'high'},
            //{text:'|', beats:1},
            {text:'ⲈϘ', beats:3, audio:'low'},
            {text:'i', beats:2, audio:'low'},
            {text:'ⲝ', beats:4, audio:'chime'}
        ]
    },
    'qoph':{
        key: '100',
        back: '#AE0E36', // KING
        text: '#F0DC82', // QUEEN
        fore: '#C08A80', // EMPEROR
        backEnd: '#76826a', // EMPRESS

        imgSrc: '100-color.png',
        minDuration: 1000 * 2.3,
        clicksPerMeasure: 12,
        parts: [
            // QaniΔnayx-ipamai
            {text:'Qa', beats:1, audio:'low'},
            {text:'ni', beats:1, audio:'high'},
            {text:'d', beats:1},
            {text:'na', beats:1, audio:'high'},
            {text:'y', beats:1, audio:'low'},
            {text:'x', beats:2},

            {text:'i', beats:1, audio:'high'},
            {text:'pa', beats:1, audio:'low'},
            {text:'ma', beats:1, audio:'low'},
            {text:'i', beats:2, audio:'low'}
        ]
    },
    'resh': {
        key: '200',
        //`Ra-a-gi o selah lad na i ma wa-iⲝ`
        text: '#FEDD00',
        fore: '#FFA500',
        back: '#FF6D00',
        backEnd: '#ffb734',
        backEndRayed: '#EF3340',

        imgSrc: '200-color.png',
        minDuration: 1000*4,
        parts: [
            {text:'Ra', beats:2, audio:'high'},
            {text:'a', beats:3, audio: 'high'},
            {text:'gi', beats:2, audio: 'high'},
            {text:'os', beats:5, audio: 'high'},
            {text:'el', beats:6, audio:'low'},
            {text:'ah', beats:6, audio: 'low'},

            {text:'lad', beats:3, audio:'high'},
            {text:'na', beats:2, audio: 'high'},
            {text:'i', beats:5, audio: 'low'},
            {text:'ma', beats:3, audio:'high'},
            {text:'wa', beats:2, audio: 'high'},
            {text:'iⲝ', beats:9, audio: 'low'}
/*            {text:'Ra', beats:2, audio:'high'},
            {text:'a', beats:3.59, audio: 'high'},
            {text:'gi', beats:2, audio: 'high'},
            {text:'os', beats:5.09, audio: 'high'},
            {text:'el', beats:5.66, audio:'low'},
            {text:'ah', beats:5.66, audio: 'low'},

            {text:'lad', beats:3.17, audio:'high'},
            {text:'na', beats:2.16, audio: 'high'},
            {text:'i', beats:5.24, audio: 'low'},
            {text:'ma', beats:3.17, audio:'high'},
            {text:'wa', beats:2.16, audio: 'high'},
            {text:'iⲝ', beats:8.10, audio: 'low'}*/
        ]
    },
    'shin': {
        key: '300',
        back: '#ff3300', // KING
        text: '#efae00', // QUEEN
        fore: '#d92400', // EMPEROR
        backEnd: '#D9381E', // EMPRESS
        backFlecked: ['#AE0E36', '#00A550'],

        imgSrc: '300-color.png',
        //minDuration: 1000 * 1.5,
        minDuration: 1000 * 1.8,
        parts: [
            {text:'shab', beats:2, audio:'high'},
            {text:'nax', beats:2, audio:'high'},
            {text:'od', beats:1, audio:'low'},
            {text:'ob', beats:1, audio:'low'},
            {text:'or', beats:2, audio:'low'}
        ]
    },
    'tav':{
        key: '400',
        back: '#001489', // KING
        text: '#000000', // QUEEN
        fore: '#000a44', // EMPEROR
        backEnd: '#000000', // EMPRESS
        backEndRayed: '#0085ca',

        imgSrc: '400-color.png',
        minDuration: 1000 * 3, // most people probably max out at 4
        includeClicks: true,
        clicksPerMeasure: 12,
        customTimes: {
            drum11: {
                initialDuration: 1000 * 12
            },
        },
        parts: [
            // Thath'th'thithعthuth-thiⲝ

/*
            // 12 beats
            {text:'Thath', beats:4, audio:'low'},
            {text:"'th'", beats:2, audio:'high'},
            {text:'thi', beats:1, audio:'low'},
            {text:'thع', beats:1, audio:'low'},
            {text:'thuth', beats:2, audio:'low'},
            {text:'thiⲝ', beats:2, audio:'high'}
*/

            // 16 beats
            {text:'Thath', beats:6, audio:'low'},
            {text:"'th'", beats:2, audio:'high'},
            {text:'thi', beats:1, audio:'low'},
            {text:'thع', beats:1, audio:'low'},
            {text:'thuth', beats:2, audio:'low'},
            {text:'thiⲝ', beats:4, audio:'high'}
        ]
    }

};


module.exports = words;
