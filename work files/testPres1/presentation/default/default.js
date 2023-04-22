let currentKeyframe = -1;
let URLparams = new URLSearchParams(location.search);

function advanceKeyframe() {
    if (currentKeyframe + 1 < allFrames.length) {
        currentKeyframe += 1;
        updateKeyframe();
        advanceFramePart(0, currentKeyframe);
    }
}
function advanceFramePart(i, frame) {
    if (i < allFrames[frame].length) {
        console.log(`advancing part ${i} of keyframe ${frame}`);
        let lastElem;
        for (let transition of allFrames[frame][i]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                let propUp = false;
                let propDown = false;
                if (transition.propagate) {
                    propUp = true;
                    propDown = true;
                }
                addTransition(elem, transition, propUp, propDown);
                lastElem = elem;
            }
        }
        lastElem.addEventListener('transitionend',
                                   advanceFramePart.bind(null, i + 1, frame),
                                   {once: true});
    }
}
function addTransition(elem, transition, propagateUp = false, propagateDown = false) {
    switch (transition.effect) {
        case 'class':
            if (transition.add) {
                elem.classList.add(transition.value);
            }
            else {
                elem.classList.remove(transition.value);
            }
            break;
        case 'transform':
            elem.style.transform += transition.value;
            break;
        case 'style':
            elem.style.cssText = `${elem.style.cssText} ${transition.value}`;
            break;
    }
    if (propagateUp && elem.parentElement.id != 'canvas') {
        addTransition(elem.parentElement, transition, true, false);
    }
    if (propagateDown) {
        for (child of elem.children) {
            addTransition(child, transition, false, true);
        }
    }
}

function backKeyframe() {
    if (currentKeyframe > 0) {
        backFramePart(allFrames[currentKeyframe].length - 1, currentKeyframe);
        currentKeyframe -= 1;
        updateKeyframe();
    }
}
function backFramePart(i, frame) {
    if (i >= 0) {
        console.log(`reversing part ${i} of keyframe ${frame}`);
        let lastElem;
        for (let transition of allFrames[frame][i]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                removeTransition(elem, transition);
                lastElem = elem;
            }
        }
        lastElem.addEventListener('transitionend', backFramePart.bind(null, i - 1, frame), {once: true});
    }
}
function removeTransition(elem, transition) {
    switch (transition.effect) {
        case 'class':
            if (transition.add) {
                elem.classList.remove(transition.value);
            }
            else {
                elem.classList.add(transition.value);
            }
            break;
        case 'transform':
            elem.style.transform = elem.style.transform.replace(transition.value, '');
            break;
        case 'style':
            elem.style.cssText = elem.style.cssText.replace(transition.value, '');
            break;
    }
}

function updateKeyframe() {
    document.getElementById('frame-num').value = currentKeyframe;
    let newURL = window.location.origin +
        window.location.pathname +
        "?frame=" + currentKeyframe;
    window.history.replaceState({}, "", newURL);

    if (currentKeyframe == allFrames.length - 1) {
        document.getElementById('fwd-frame').disabled = true;
    }
    else {
        document.getElementById('fwd-frame').disabled = false;
    }
    if (currentKeyframe == 0) {
        document.getElementById('back-frame').disabled = true;
    }
    else {
        document.getElementById('back-frame').disabled = false;
    }
}

function goToKeyframe(keyframe) {
    document.body.classList.add('no-transition');
    if (keyframe >= 0 && keyframe < allFrames.length) {
        while (currentKeyframe < keyframe) {
            advanceKeyframe();
        }
        while (currentKeyframe > keyframe) {
            backKeyframe();
        }
    }
    else {
        goToKeyframe(0);
    }
    document.body.classList.remove('no-transition');
}

function hideElements() {
    document.body.classList.add('no-transition');
    for (frame of allFrames) {
        for (framePart of frame) {
            for (transition of framePart) {
                if (transition.effect == 'class' && transition.value == 'show') {
                    let elems = document.querySelectorAll(transition.selector);
                    for (let elem of elems) {
                        if (transition.add && !elem.classList.contains('show')) {
                            elem.classList.add('hide');
                        }
                        else if (!transition.add && !elem.classList.contains('hide')) {
                            elem.classList.add('hide');
                            elem.classList.add('show');
                        }
                    }
                }
            }
        }
    }
    document.body.classList.remove('no-transition');
}

window.addEventListener('keydown', function(e) {
    if (e.key == "ArrowRight" || e.key == " ") {
        advanceKeyframe();
    }
    else if (e.key == "ArrowLeft") {
        backKeyframe();
    }
});
// window.addEventListener('click', function(e) {
//     e.preventDefault();
//     if (e.clientX < window.innerWidth/2) {
//         backKeyframe();
//     }
//     else {
//         advanceKeyframe();
//     }
// })

window.addEventListener('load', function() {
    // hideElements();
    feather.replace();
    document.getElementById('cover').classList.add('hide');

    if (URLparams.has('frame')) {
        if (URLparams.get('frame') >= 0 && URLparams.get('frame') < allFrames.length) {
            goToKeyframe(URLparams.get('frame'))
        }
        else {
            advanceKeyframe();
        }
    }
    else {
        advanceKeyframe();
    }
})