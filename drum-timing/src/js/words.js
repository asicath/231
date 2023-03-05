
const words = {

    'aleph': {
        background: '#fee74d',
        imgSrc: '001.png',
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
        background: '#FEDD00',
        imgSrc: '002.png',
        minDuration: 1000 * 2.5,
        parts: [
            // Beعθaoooabitom
            {text:'Be', count:3.55, audio:'high'},
            {text:'ع', count:5.89, audio:'low'},
            {text:'θa', count:3.70, audio:'high'},
            {text:'o', count:9.93, audio:'low'},
            {text:'o', count:5.97, audio:'low'},
            {text:'o', count:3.53, audio:'low'},
            {text:'a', count:5.72, audio:'high'},
            {text:'bi', count:3.46, audio:'high'},
            {text:'tom', count:6.26, audio:'low'}
        ]
    },
    'gimel':{
        background: '#0085ca',
        imgSrc: '003.png',
        minDuration: 1000 * 2,
        parts: [
            // Gitωnosapφωllois
            {text:'Gi', count:5.23, audio:'low'},
            {text:'tω', count:7.54, audio:'low'},
            {text:'no', count:5.23, audio:'low'},
            {text:'sap', count:9.51, audio:'high'},
            {text:'φωl', count:7.68, audio:'low'},
            {text:'lo', count:5.09, audio:'low'},
            {text:'is', count:7.72, audio:'low'}
        ]
    },
/*    'gimel':{
        background: '#0085ca',
        imgSrc: '003.png',
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
        background: '#00A550',
        imgSrc: '004.png',
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
        background: '#ed2800',
        imgSrc: '005.png',
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
        background: '#FF4E00',
        imgSrc: '006.png',
        minDuration: 1000 * 1.5,
        parts: [
            // Vuaretza
            {text:'Vu', count:6, audio:'low'},
            {text:'a', count:2, audio:'high'},
            {text:'re', count:4, audio:'high'}, // maybe 3?
            {text:'tza', count:5, audio:'high'}
        ]
    },
    'zain':{
        background: '#FF6D00',
        imgSrc: '007.png',
        minDuration: 1000 * 2,
        parts: [
            // Zooωasar
            {text:'Z', count:1},
            {text:'o', count:3, audio:'high'},
            {text:'o', count:3, audio:'high'},
            {text:'ω', count:4, audio:'low'},
            {text:'a', count:2, audio:'high'},
            {text:'sar', count:3, audio:'high'}
        ]
    },
    'cheth':{
        background: '#ffb734',
        imgSrc: '008.png',
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
        background: '#E5D708',
        imgSrc: '009.png',
        minDuration: 1000 * 2.5,
        includeClicks: true,
        clicksPerMeasure: 12,
        parts: [
            {text:'θa', count:5, audio:'low'},
            {text:'lع', count:3, audio:'high'},
            {text:'ⲝer', count:8, audio:'high'},
            {text:'ā', count:8, audio:'low'},

            {text:'de', count:5, audio:'high'},
            {text:'ker', count:3, audio:'low'},
            {text:'val', count:5, audio:'low'},
            {text:'|', count:11}
        ]
    },

    'yod':{
        background: '#59B934',
        imgSrc: '010.png',
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
        background: '#8C15C4',
        imgSrc: '020.png',
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
        background: '#00A550',
        imgSrc: '030.png',
        minDuration: 1000 * 2,
        clicksPerMeasure: 16,
        parts: [
            // Lusana her andraton
            {text:'Lu', count:3, audio:'low'},
            {text:'sa', count:1, audio:'high'},
            {text:'na', count:2, audio:'high'},
            {text:'her', count:2},
            {text:'an', count:3, audio:'low'},
            {text:'dra', count:1, audio:'high'},
            {text:'ton', count:4, audio:'high'}
        ]
    },
    'mem': {
        background: '#0246bc',
        imgSrc: '040.png',
        minDuration: 1000*1,
        customTimes: {
            short3: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            short2: {
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
        background: '#00958d',
        imgSrc: '050.png',
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
        background: '#0085ca',
        imgSrc: '060.png',
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
        background: '#001489',
        imgSrc: '070.png',
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
        background: '#ed2800',
        imgSrc: '080.png',
        minDuration: 1000*2.5,
        customTimes: {
            short3: {
                easingFunction: EasingFunctions.easeOutQuad
            },
            short2: {
                easingFunction: EasingFunctions.easeOutQuad
            }
        },
        parts: [
            {text:'Pu', count:5.65, audio:'low'},
            {text:'raθ', count:6.44, audio: 'low'},
            {text:'me',  count:3.07, audio: 'high'},
            {text:'ta',  count:3.16, audio: 'high'},
            {text:'i',  count:5.89, audio: 'high'},

            {text:'a', count:5.75, audio:'low'},
            {text:'pη', count:5.93, audio: 'low'},
            {text:'me',  count:2.95, audio: 'high'},
            {text:'ta',  count:3.05, audio: 'high'},
            {text:'i',  count:6.12, audio: 'high'},
        ]
    },
    'tzaddi':{
        background: '#5c00cc',
        imgSrc: '090.png',
        minDuration: 1000 * 2.4,
        clicksPerMeasure: 6,
        parts: [
            // XanθaⲝeranⲈϘ-iⲝ
            {text:'Xanth', count:3, audio:'low'},
            {text:'a', count:2, audio:'high'},
            {text:'ⲝer', count:1, audio:'high'},
            {text:'an', count:2, audio:'high'},
            {text:'|', count:1},
            {text:'ⲈϘ', count:3, audio:'low'},
            {text:'i', count:2, audio:'low'},
            {text:'ⲝ', count:4}
        ]
    },
    'qoph':{
        background: '#AE0E36',
        imgSrc: '100.png',
        minDuration: 1000 * 2,
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
        //`Ra-a-gi o selah lad na i ma wa-iⲝ`
        background: '#FF6D00',
        imgSrc: '200.png',
        minDuration: 1000*4,
        parts: [
            {text:'Ra', count:1.95, audio:'high'},
            {text:'a', count:3.64, audio: 'high'},
            {text:'gi', count:1.90, audio: 'high'},
            {text:'os', count:5.19, audio: 'high'},

            {text:'el', count:5.32, audio:'low'},
            {text:'ah', count:5.71, audio: 'low'},

            {text:'lad', count:3.42, audio:'high'},
            {text:'na', count:2.16, audio: 'high'},
            {text:'i', count:5.24, audio: 'low'},

            {text:'ma', count:3.07, audio:'high'},
            {text:'wa', count:2.29, audio: 'high'},
            {text:'iⲝ', count:8.09, audio: 'low'}
        ]
    },
    'shin': {
        background: '#ff3300',
        imgSrc: '300.png',
        //minDuration: 1000 * 1.5,
        minDuration: 1000 * 2.5,
        parts: [
            {text:'shab', count:2, audio:'high'},
            {text:'nax', count:2, audio:'high'},
            {text:'od', count:1, audio:'low'},
            {text:'ob', count:1, audio:'low'},
            {text:'or', count:2, audio:'low'}
        ]
    },
    'tav':{
        background: '#001489',
        imgSrc: '400.png',
        minDuration: 1000 * 4,
        customTimes: {
            long: {
                initialDuration: 1000 * 12
            },
        },
        parts: [
            // Thath'th'thithعthuth-thiⲝ
            {text:'Tha', count:1.5, audio:'low'},
            {text:'th', count:2.5, audio:''},
            {text:"'th'", count:2, audio:'high'},
            {text:'thi', count:1, audio:'low'},
            {text:'thع', count:1, audio:'low'},
            {text:'thuth', count:2, audio:'low'},

            {text:'thiⲝ', count:2, audio:'high'}
        ]
    }

};
