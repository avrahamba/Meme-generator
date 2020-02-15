var gTrans = {
    Gallery: {
        en: 'Gallery',
        he: 'גלרייה'
    },
    Memes: {
        en: 'Saved Memes',
        he: 'ממים שמורים',
    },
    About: {
        en: 'About',
        he: 'אודות',
    },
    'title': {
        en: 'Meme-Generator',
        he: 'מחולל ממים',
    },
    'Name': {
        en: 'Avraham Ben Arosh',
        he: 'אברהם בן ארוש',
    },
    'about-p': {
        en: 'My name is Avraham Ben Arosh, I study full-stack web developer in coding-academy.',
        he: 'שמי אברהם בן ארוש אני לומד פיתוח אפליקציות ווב בקודיג אקדמי.',
    },
    'search': {
        en: 'Enter search keyword 0.9',
        he: 'חפש',
    },
    'copyright': {
        en: 'All rights reserved 2020',
        he: 'כל הזכויות שמורות 2020',
    },
    'lang': {
        en: 'עברית',
        he: 'English',
    },
    'share': {
        en: 'Share',
        he: 'שתף',
    },
}

var gCurrLang = 'en';

function doTrans() {
    // For each el get the data-trans and use getTrans to replace the innerText 
    let elLeft = document.querySelector('.left-arrow path');
    let elright = document.querySelector('.right-arrow path');
    if (gCurrLang === 'en') {
        document.body.classList.remove('rtl');
    }
    else {
        document.body.classList.add('rtl');
    }
    document.body.dir = (gCurrLang === 'en') ? 'ltr' : 'rtl';
    var els = document.querySelectorAll('[data-trans]');
    els.forEach(el => {
        var txt = getTrans(el.dataset.trans);
        // If this is an input, translate the placeholder
        if (el.placeholder) el.placeholder = txt;
        else el.innerText = txt;
    });


}


function getTrans(transKey) {
    var langMap = gTrans[transKey]
    if (!langMap) return 'UNKNOWN';
    var txt = langMap[gCurrLang]
    // If translation not found - use english
    if (!txt) txt = langMap['en'];
    return txt;
}


function toggleLang() {
    gCurrLang = (gCurrLang === 'en') ? 'he' : 'en';
    doTrans();
}
