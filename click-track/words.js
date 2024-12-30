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
            {text:'A', count: 1, countx: 4.10, audio: 'high'},
            {text:'ع', count: 1, countx: 3.86, audio: 'low'},
            {text:'u', count: 2, countx: 7.05, audio: 'low'},

            {text:'i', count: 1, countx: 4.08, audio: 'low'},
            {text:'a', count: 1, countx: 3.99, audio: 'high'},
            {text:'o', count: 2, countx: 8.17, audio: 'low'},

            {text:'u', count: 1, countx: 3.97, audio: 'low'},
            {text:'ع', count: 1, countx: 4.44, audio: 'low'},
            {text:'a', count: 2, countx: 8.34, audio: 'high'}
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
            {text:'Be', count:4, audio:'high'},
            {text:'ع', count:6, audio:'low'},
            {text:'θa', count:4, audio:'high'},
            {text:'o', count:10, audio:'low'},
            {text:'o', count:6, audio:'low'},
            {text:'o', count:4, audio:'low'},
            {text:'a', count:6, audio:'high'},
            {text:'bi', count:4, audio:'high'},
            {text:'tom', count:6, audio:'low'}
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
/*            {text:'Gi', count:5.23, audio:'low'},
            {text:'tω', count:7.54, audio:'low'},
            {text:'no', count:5.23, audio:'low'},
            {text:'sap', count:9.51, audio:'high'},
            {text:'φωl', count:7.68, audio:'low'},
            {text:'lo', count:5.09, audio:'low'},
            {text:'is', count:7.72, audio:'low'}*/

            // Gitωnosapφωllois
            {text:'Gi', count:5, audio:'low'},
            {text:'tω', count:8, audio:'low'},
            {text:'no', count:5, audio:'low'},
            {text:'sap', count:12, audio:'high'},
            {text:'φωl', count:8, audio:'low'},
            {text:'lo', count:5, audio:'low'},
            {text:'is', count:8, audio:'low'}
        ]
    },
    /*    'gimel':{
            back: '#0085ca',
            imgSrc: '003-color.png',
            minDuration: 1000 * 2,
            parts: [
                // Gitωnosapφωllois
                {text:'Gi',  count: 4.87, audio:'low'},
                {text:'tω',  count: 7.69, audio:'low'},
                {text:'no',  count: 4.80, audio:'low'},
                {text:'sap', count:10.44, audio:'high'},
                {text:'φωl', count: 7.83, audio:'low'},
                {text:'lo',  count: 4.80, audio:'low'},
                {text:'is',  count: 8.38, audio:'low'}
            ]
        },*/
    'daleth': {
        key: '004',
        back: '#00A550', // KING
        text: '#8ABAD3', // QUEEN
        fore: '#b2d135', // EMPEROR
        backEnd: '#C51959', // EMPRESS
        backEndRayed: '#B2E79F',

        imgSrc: '004-color.png',
        minDuration: 1000 * 1.5,
        parts: [
            {text:'dηn', count:2, audio:'high'},
            {text:'a', count:1.3, audio:'low'},
            {text:'star', count:2, audio:'high'},
            {text:'tar', count:1, audio:'high'},
            {text:'ωθ', count:2.5, audio:'low'}
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
            {text:'Ho', count:1, audio:'high'},
            {text:'o', count:1, audio:'high'},
            {text:'o', count:1, audio:'high'},
            {text:'o', count:2, audio:'high'},
            {text:'rω', count:1, audio:'low'},
            {text:'iⲝ', count:2, audio:'low'}
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
            {text:'Vu', count:6, audio:'low'},
            {text:'a', count:2, audio:'high'},
            {text:'re', count:4, audio:'high'}, // maybe 3?
            {text:'tza', count:5, audio:'high'}
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
            {text:'Z', count:1, audio: 'chime'},
            {text:'o', count:3, audio:'high'},
            {text:'o', count:3, audio:'high'},
            {text:'ω', count:4, audio:'low'},
            {text:'a', count:2, audio:'high'},
            {text:'sar', count:3, audio:'high'}
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
            {text:'Chi', count:2, audio:'low'},
            //{text:'', count:1, audio:'click'},
            {text:'va', count:2, audio:'low'},
            {text:'a', count:1, audio:'high'},
            {text:'bra', count:1, audio:'high'},
            {text:'ha', count:1, audio:'high'},
            {text:'da', count:3, audio:'high'},
            {text:'bra', count:2, audio:'high'},

            {text:'ca', count:2, audio:'low'},
            {text:'dax', count:2, audio:'low'},
            {text:'vi', count:2, audio:'high'},
            {text:'i', count:2, audio:'high'},
            {text:'i', count:4, audio:'high'},
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
            {text:'θa', count:5, audio:'low'},
            {text:'lع', count:3, audio:'high'},
            {text:'ⲝer', count:8, audio:'high'},
            {text:'ā', count:8, audio:'low'},

            {text:'de', count:5, audio:'high'},
            {text:'ker', count:3, audio:'low'},
            {text:'val', count:16, audio:'low'}
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
            {text:'I', count:2, audio:'high'},
            {text:'e', count:2, audio:'high'},
            {text:'hu', count:2, audio:'high'},
            {text:'vah', count:2, audio:'high'},

            {text:'a', count:1, audio:'low'},
            {text:'ⲝan', count:2, audio:'low'},
            {text:'ع', count:1, audio:'high'},
            {text:'θa', count:1, audio:'low'},
            {text:'tan', count:3, audio:'low'}
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
        minDuration: 1000*1.7,
        parts: [
            {text:'Ke', count: 6.33, audio: 'low'},
            {text:'ru', count: 9.28, audio: 'low'},
            {text:'gu', count: 6.45, audio: 'high'},
            {text:'na', count: 9.65, audio: 'high'},
            {text:'vi', count: 6.68, audio: 'high'},
            {text:'el', count: 9.61, audio: 'low'},
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
            {text:'Lu', count:3, audio:'low'},
            {text:'sa', count:1, audio:'high'},
            {text:'na', count:2, audio:'high'},
            {text:'her', count:2, audio: 'chime'},
            {text:'an', count:3, audio:'low'},
            {text:'dra', count:1, audio:'high'},
            {text:'ton', count:4, audio:'high'}
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
            {text:'Ma', count:16.14, audio:'low'},
            {text:'la', count:16.16, audio: 'low'},
            {text:'i',  count:15.70, audio: 'high'}
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

            {text:'Na', count:1, audio:'high'},//4
            {text:'dim', count:3, audio:'low'},

            {text:'ra', count:3, audio:'high'},//15
            {text:'pho', count:3, audio:'high'},
            {text:'ro', count:2, audio:'high'},
            {text:'i', count:1, audio:'high'},
            {text:'o', count:3, audio:'high'},
            {text:'zع', count:3, audio:'high'},

            {text:'tha', count:3, audio:'low'},//11
            {text:'la', count:3, audio:'low'},
            {text:'i', count:5, audio:'high'}
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
            {text:'Sa', count:2, audio:'high'},
            {text:'laθ', count:2, audio:'low'},
            {text:'la', count:2, audio:'low'},
            {text:'la', count:6, audio:'low'},
            {text:'am', count:2, audio:'high'},
            {text:'rod', count:4, audio:'high'},
            {text:'na', count:2, audio:'low'},
            {text:'θع', count:2, audio:'low'},
            {text:'iⲝ', count:6, audio:'low'}
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
            {text:'O', count:1, audio:'low'},
            {text:'a', count:1, audio:'high'},
            {text:'o', count:1, audio:'low'},
            {text:'a', count:1, audio:'high'},
            {text:'a', count:1, audio:'high'},
            {text:'a', count:1, audio:'high'},
            {text:'o', count:1, audio:'low'},
            {text:'o', count:1, audio:'low'},
            {text:'o', count:2, audio:'low'},

            {text:'ع', count:2, audio:'low'},
            {text:'i', count:2, audio:'high'},
            {text:'ⲝ', count:2, audio:'click'},
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
        minDuration: 1000*4,
        customTimes: {
            drum03: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            drum02: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
        parts: [
            // {text:'Pu', count:5.65, audio:'low'},
            // {text:'raθ', count:6.44, audio: 'low'},
            // {text:'me',  count:3.07, audio: 'high'},
            // {text:'ta',  count:3.16, audio: 'high'},
            // {text:'i',  count:5.89, audio: 'high'},
            //
            // {text:'a', count:5.75, audio:'low'},
            // {text:'pη', count:5.93, audio: 'low'},
            // {text:'me',  count:2.95, audio: 'high'},
            // {text:'ta',  count:3.05, audio: 'high'},
            // {text:'i',  count:6.12, audio: 'high'},

            {text:'Pu', count:2, audio:'low'},
            {text:'raθ', count:2, audio: 'low'},
            {text:'me',  count:1, audio: 'high'},
            {text:'ta',  count:1, audio: 'high'},
            {text:'i',  count:2, audio: 'high'},

            {text:'a', count:2, audio:'low'},
            {text:'pη', count:2, audio: 'low'},
            {text:'me',  count:1, audio: 'high'},
            {text:'ta',  count:1, audio: 'high'},
            {text:'i',  count:2, audio: 'high'},
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
            {text:'Xan', count:2, audio:'low'},
            {text:'th', count:1},
            {text:'a', count:2, audio:'high'},
            {text:'ⲝer', count:1, audio:'high'},
            {text:'an', count:3, audio:'high'},
            //{text:'|', count:1},
            {text:'ⲈϘ', count:3, audio:'low'},
            {text:'i', count:2, audio:'low'},
            {text:'ⲝ', count:4, audio:'chime'}
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
            {text:'Qa', count:1, audio:'low'},
            {text:'ni', count:1, audio:'high'},
            {text:'d', count:1},
            {text:'na', count:1, audio:'high'},
            {text:'y', count:1, audio:'low'},
            {text:'x', count:2},

            {text:'i', count:1, audio:'high'},
            {text:'pa', count:1, audio:'low'},
            {text:'ma', count:1, audio:'low'},
            {text:'i', count:2, audio:'low'}
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
            {text:'Ra', count:2, audio:'high'},
            {text:'a', count:3.59, audio: 'high'},
            {text:'gi', count:2, audio: 'high'},
            {text:'os', count:5.09, audio: 'high'},
            {text:'el', count:5.66, audio:'low'},
            {text:'ah', count:5.66, audio: 'low'},

            {text:'lad', count:3.17, audio:'high'},
            {text:'na', count:2.16, audio: 'high'},
            {text:'i', count:5.24, audio: 'low'},
            {text:'ma', count:3.17, audio:'high'},
            {text:'wa', count:2.16, audio: 'high'},
            {text:'iⲝ', count:8.10, audio: 'low'}
        ]
    },
    'shin': {
        key: '300',
        back: '#ff3300', // KING
        text: '#bf220a', // QUEEN
        fore: '#d92400', // EMPEROR
        backEnd: '#D9381E', // EMPRESS
        backFlecked: ['#AE0E36', '#00A550'],

        imgSrc: '300-color.png',
        //minDuration: 1000 * 1.5,
        minDuration: 1000 * 1.8,
        parts: [
            {text:'shab', count:2, audio:'high'},
            {text:'nax', count:2, audio:'high'},
            {text:'od', count:1, audio:'low'},
            {text:'ob', count:1, audio:'low'},
            {text:'or', count:2, audio:'low'}
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
            {text:'Thath', count:4, audio:'low'},
            {text:"'th'", count:2, audio:'high'},
            {text:'thi', count:1, audio:'low'},
            {text:'thع', count:1, audio:'low'},
            {text:'thuth', count:2, audio:'low'},
            {text:'thiⲝ', count:2, audio:'high'}
*/

            // 16 beats
            {text:'Thath', count:6, audio:'low'},
            {text:"'th'", count:2, audio:'high'},
            {text:'thi', count:1, audio:'low'},
            {text:'thع', count:1, audio:'low'},
            {text:'thuth', count:2, audio:'low'},
            {text:'thiⲝ', count:4, audio:'high'}
        ]
    }

};


module.exports = words;
