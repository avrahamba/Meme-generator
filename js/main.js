'use strict'

let activeLine = null;
let gImg;
const gPropsCont = 5;
let gStartProps = 1;
let avtiveLineOrProp = false;

function init() {
    if (navigator.share) {
        document.querySelector('.share-api').addEventListener('click', () => {
            var canvas = document.querySelector('#meme-canvas');
            let navigator = window.navigator;
            let data = { text: '', url: '', title: '' };

            canvas.toBlob(blob => {
                var file = new File([blob], "image.png", { type: "image/png" });
                data.files = [file];
                navigator
                    .share(data)
                    .then(() => { })
                    .catch(err => {
                        alert("Unsuccessful share " + err);
                    });

            }, 'image/png');

        });
    } else {
        document.querySelector('.share-api').remove();
    }

    initGallery();
    window.addEventListener('mouseup', () => { activeLine = null });
    window.addEventListener('click', () => { avtiveLineOrProp = false; render(); })
    let hammer = new Hammer(document.querySelector('#meme-canvas'));
    hammer.on('doubletap tap', onTouchStart);
    hammer.on('panup pandown panleft panright', onTouchMove);
    document.querySelector('#meme-canvas').addEventListener('touchmove', (ev) => { ev.preventDefault() }, event)
    doTrans();
}
function initGallery() {
    let container = document.querySelector('.gallery');
    let strHtml = getImages().map(img => `
    <div class="card" onclick="enterGenerator(${img.id})">
        <img src="images/full/${img.url}"/>
    </div>
    `).join('');
    container.innerHTML = strHtml;
}
function enterGenerator(id) {
    setImg(id);
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.gallery-saved').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
    document.querySelector('.about').classList.add('hidden');
    initMemeGenerator();
    doTrans()
}
function initMemeGenerator() {
    let meme = getMeme();
    let hiddenImg = document.querySelector('.hidden-img')
    hiddenImg.src = `images/full/${getImgUrl(meme.selectedImgId)}`;
    hiddenImg.addEventListener('load', () => {
        addline();
        renderProps();
        render(meme);
    })
}

function render() {
    let meme = getMeme();
    let canvas = document.querySelector('#meme-canvas');
    let ctx = canvas.getContext('2d');
    var elImg = document.querySelector('.hidden-img')
    let ratio = elImg.width / elImg.height;
    resizeCanvas(ratio);
    ctx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    meme.props.forEach((prop, inx) => {

        let { x, y, fakeImg } = prop;
        ctx.drawImage(fakeImg, x - prop.width() / 2, y - prop.height() / 2, prop.width(), prop.height())
        if (avtiveLineOrProp && inx === getMeme().seletedPropInx) {
            ctx.beginPath()
            ctx.rect(prop.x - prop.width() / 2, prop.y - prop.height() / 2, prop.width(), prop.height())
            ctx.strokeStyle = '555555'
            ctx.stroke()
        }
    })
    meme.lines.forEach((line, inx) => {
        ctx.strokeStyle = line.colorStroke;
        ctx.fillStyle = line.colorfill;
        ctx.font = `${line.size}px ${line.font}`;
        ctx.textAlign = 'center'
        line.height = ctx.measureText(line.text).actualBoundingBoxAscent;
        line.width = ctx.measureText(line.text).width;


        if (avtiveLineOrProp && inx === getMeme().seletedLineInx) {
            ctx.beginPath()
            ctx.rect(line.x - line.width / 2, line.y - line.height, line.width, line.height)
            ctx.strokeStyle = '555555'
            ctx.stroke()
        }

        ctx.fillText(line.text, line.x, line.y);
        ctx.strokeText(line.text, line.x, line.y);
    });
}

function resizeCanvas(ratio) {
    let canvas = document.querySelector('#meme-canvas');
    let elContainer = document.querySelector('.canvas-container');
    elContainer.style.height = elContainer.offsetWidth / ratio + 'px'
    canvas.width = elContainer.offsetWidth;
    canvas.height = elContainer.offsetHeight;
}


function changeText(elText, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeTextLine(elText.value);
    render();;
}
function addline() {
    avtiveLineOrProp = true;
    let memeLineCount = getMeme().lines.length;
    let canvas = document.querySelector('#meme-canvas');
    let y = canvas.height / 2;
    if (memeLineCount === 0 || memeLineCount === 1) y = (memeLineCount) ? canvas.height - canvas.height / 10 : canvas.height / 10 + 50;
    addLineService(canvas.width / 2, y)
    document.querySelector('.edit-text').value = '';
    document.querySelector('.select-font').value = 'Impact';
}

function clickOnCanvas(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    let { offsetX, offsetY } = ev;
    let line = getLine(offsetX, offsetY);

    if (line && line.type === 'line') {
        document.querySelector('.select-font').value = line.font;
        document.querySelector('.edit-text').value = line.text;
    } else if (line && line.type === 'prop') {
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
    } else {
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
        avtiveLineOrProp = false;
    }
    render();
}

function onRemoveLine() {
    removeLine();
    render();;
}

function onMoveLine(diff) {
    moveLine({ x: 0, y: diff });
    render();;
}

function onChangeSize(diff, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeSize(diff);
    render();;
}

function onChangeColor(elColor, fill) {

    changeColor(elColor.value, fill)
    render();;
}
function onDownload(elLink) {
    let canvas = document.querySelector('#meme-canvas');
    const data = canvas.toDataURL();
    elLink.href = data;
    elLink.download = 'my-meme.png';
}

function loadGallery() {
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.gallery-saved').classList.add('hidden');
    document.querySelector('.about').classList.add('hidden');
    document.querySelector('.gallery-container').classList.remove('hidden');
    initGallery();

}

function onMouseDownCanvas(ev) {
    avtiveLineOrProp = true;
    let { offsetX, offsetY } = ev;
    activeLine = getLine(offsetX, offsetY);
}
function onMousMoveCanvas(ev) {
    if (!activeLine) return;
    moveLineTo(ev.offsetX, ev.offsetY);
    render();;
}

function onMoveToRight(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(document.querySelector('#meme-canvas').width - getLineWidth() / 2, -1)
    render();;
}
function onMoveToLeft(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(getLineWidth() / 2, -1)
    render();;
}
function onMoveToCenter(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    moveLineTo(document.querySelector('#meme-canvas').width / 2, -1)
    render();;
}

function onChanchFont(font, ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    changeFont(font);
    render();
}

function onReplaceLineSelected(ev) {
    ev.stopPropagation();
    avtiveLineOrProp = true;
    replaceLineSelected();
    document.querySelector('.edit-text').value = getMeme().lines[getMeme().seletedLineInx].text;
    render();
}

function changeProps(next) {
    if (next) {
        gStartProps++;
        if (gStartProps + 2 > gPropsCont) gStartProps = 1;
    } else {
        gStartProps--;
        if (gStartProps < 1) gStartProps = gPropsCont - 2;
    }

    renderProps();
}

function renderProps() {
    let elProp1 = document.querySelector('.prop1 img');
    let elProp2 = document.querySelector('.prop2 img');
    let elProp3 = document.querySelector('.prop3 img');
    elProp1.dataset.pic = gStartProps;
    elProp1.src = `images/props/${gStartProps}.png`;
    elProp2.dataset.pic = gStartProps + 1;
    elProp2.src = `images/props/${gStartProps + 1}.png`;
    elProp3.dataset.pic = gStartProps + 2;
    elProp3.src = `images/props/${gStartProps + 2}.png`;
}

function onAddProp(el) {
    let canvas = document.querySelector('#meme-canvas');
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let propId = el.dataset.pic;
    addProp(x, y, propId);
    render();
}
function onSaveMeme() {
    saveMeme();
}

function onTouchStart(ev) {
    let [x, y] = [ev.srcEvent.pageX - ev.srcEvent.target.offsetLeft, ev.srcEvent.pageY - ev.srcEvent.target.offsetTop];
    let line = getLine(x, y);
    if (!line) return;
    if (line && line.type === 'line') {
        document.querySelector('.select-font').value = line.font;
        document.querySelector('.edit-text').value = line.text;
    } else if (line && line.type === 'prop') {
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
    } else {
        document.querySelector('.select-font').value = 'Impact';
        document.querySelector('.edit-text').value = '';
        avtiveLineOrProp = false;
    }

}

function onTouchMove(ev) {
    let target = document.querySelector('#meme-canvas');
    let [x, y] = [ev.center.x - target.offsetLeft, ev.center.y - target.offsetTop];
    moveLineTo(x, y);
    render();
}

function loadAbout() {
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.gallery-saved').classList.add('hidden');
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.about').classList.remove('hidden');

}
function loadSaved() {
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.gallery-saved').classList.remove('hidden');
    document.querySelector('.editor-container').classList.add('hidden');
    document.querySelector('.about').classList.add('hidden');

    let savedMemes = getSavedMeme();

    document.querySelector('.gallery-saved').innerHTML = savedMemes.map((meme, inx) =>
        `
        <div class="meme-card meme-card${inx}">
            <canvas onclick="openMeme(${inx})" class="meme${inx}"></canvas>
        </div>

        `
    ).join('');
    savedMemes.forEach((meme, inx) => {
        meme.fakeImg = document.createElement('img');
        meme.fakeImg.src = `images/full/${meme.selectedImgId}.jpg`;

        let newProps = [];

        meme.props.forEach((prop) => {
            let fakeImg = document.createElement('img');
            fakeImg.src = `images/props/${prop.propId}.png`;
            let size = prop.size;
            let propRatio = prop.propRatio;
            let { propId, x, y } = prop;
            newProps.push({
                type: 'prop',
                propId,
                fakeImg,
                setSize: (diff) => { size += diff; },
                x,
                y,
                height: () => size / propRatio,
                width: () => size,
            })
        });
        meme.props = newProps;
        let canvas = document.querySelector(`.meme${inx}`);
        let elContainer = document.querySelector(`.meme-card${inx}`);
        canvas.width = elContainer.offsetWidth;

        elContainer.height = elContainer.offsetWidth * (meme.fakeImg.height / meme.fakeImg.width);
        canvas.height = elContainer.height;
        renderMemeSaved(meme, canvas)
    }
    );

}

function renderMemeSaved(meme, canvas) {
    let ctx = canvas.getContext('2d');
    let elImg = meme.fakeImg;

    let ratio = elImg.width / elImg.height;
    resizeCanvas(ratio);
    ctx.drawImage(elImg, 0, 0, canvas.width, canvas.height)
    console.log(meme.fakeImg);
    meme.props.forEach((prop, inx) => {
        var img = new Image()
        img.src = `images/props/${prop.propId}.png`;
        img.onload = () => {
            let { x, y } = prop;
            ctx.drawImage(img, x - prop.width() / 2, y - prop.height() / 2, prop.width(), prop.height());
        }
    })
    meme.lines.forEach((line, inx) => {
        ctx.strokeStyle = line.colorStroke;
        ctx.fillStyle = line.colorfill;
        ctx.font = `${line.size}px ${line.font}`;
        ctx.textAlign = 'center'
        line.height = ctx.measureText(line.text).actualBoundingBoxAscent;
        line.width = ctx.measureText(line.text).width;
        ctx.fillText(line.text, line.x, line.y);
        ctx.strokeText(line.text, line.x, line.y);
    });
}

function openMeme(inx) {
    let meme = getSavedMeme()[inx];

    meme.fakeImg = document.createElement('img');
    meme.fakeImg.src = `images/full/${meme.selectedImgId}.jpg`;

    let newProps = [];

    meme.props.forEach((prop) => {
        let fakeImg = document.createElement('img');
        fakeImg.src = `images/props/${prop.propId}.png`;
        let size = prop.size;
        let propRatio = prop.propRatio;
        let { propId, x, y } = prop;
        newProps.push({
            type: 'prop',
            propId,
            fakeImg,
            setSize: (diff) => { size += diff; },
            x,
            y,
            height: () => size / propRatio,
            width: () => size,
        })
    });
    meme.props = newProps;


    gMeme = meme;
    document.querySelector('.gallery-container').classList.add('hidden');
    document.querySelector('.gallery-saved').classList.add('hidden');
    document.querySelector('.editor-container').classList.remove('hidden');
    document.querySelector('.about').classList.add('hidden');
    initMemeGenerator();

}
function onChangeBar() {
    document.body.classList.toggle('side-bar');
}

function searchTabs(el) {
    let container = document.querySelector('.gallery');
    let strSearch = el.value.toLowerCase();
    if (strSearch === '') {
        let strHtml = getImages().map(img => `
            <div class="card" onclick="enterGenerator(${img.id})">
            <img src="images/full/${img.url}"/>
            </div>
            `).join('');
        container.innerHTML = strHtml;
    } else {
        let strHtml = getImages().filter(img =>
            img.keywords.findIndex(keyword => keyword.toLowerCase().includes(strSearch)) !== -1
        ).map(img => `
            <div class="card" onclick="enterGenerator(${img.id})">
            <img src="images/full/${img.url}"/>
            </div>
            `).join('');
        container.innerHTML = strHtml;
    }

}