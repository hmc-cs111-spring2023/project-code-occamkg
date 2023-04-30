let currentKeyframe = -1;
let URLparams = new URLSearchParams(location.search);
let isFullscreen = false;
let throughTransitions = false;

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
        if (throughTransitions) {
            advanceFramePart(i + 1, frame);
        }
        else {
            let lastTrans = allFrames[frame][i][allFrames[frame][i].length - 1];
            let lastElem = document.querySelectorAll(lastTrans.selector)[0];
            lastElem.addEventListener('transitionend',
                                    advanceFramePart.bind(null, i + 1, frame),
                                    {once: true});
        }
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
            }
        }
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
        // case 'animation':
        //     if (transition.loop) {

        //     }
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
        if (throughTransitions) {
            advanceFramePart(i + 1, frame);
        }
        else {
            let lastTrans = allFrames[frame][i][allFrames[frame][i].length - 1];
            let lastElem = document.querySelectorAll(lastTrans.selector)[0];
            lastElem.addEventListener('transitionend',
                                    backFramePart.bind(null, i - 1, frame),
                                    {once: true});
        }
        for (let transition of allFrames[frame][i]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                removeTransition(elem, transition);
            }
        }
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
    throughTransitions = true;
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
    throughTransitions = false;
    document.body.classList.remove('no-transition');
}

function fullscreen() {
    if (isFullscreen) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        }
        document.getElementById('fullscreen-top').setAttribute('transform', '');
        document.getElementById('fullscreen-bottom').setAttribute('transform', '');
        document.getElementById('fullscreen-left').setAttribute('transform', '');
        document.getElementById('fullscreen-right').setAttribute('transform', '');
        document.getElementById('controls').style.opacity = 1;
    }
    else {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.webkitRequestFullscreen) { /* Safari */
            document.body.webkitRequestFullscreen();
        }
        document.getElementById('fullscreen-top').setAttribute('transform', 'translate(0, 10)');
        document.getElementById('fullscreen-bottom').setAttribute('transform', 'translate(0, -10)');
        document.getElementById('fullscreen-left').setAttribute('transform', 'translate(10, 0)');
        document.getElementById('fullscreen-right').setAttribute('transform', 'translate(-10, 0)');
        // document.getElementById('controls').style.opacity = 0;
    }
    isFullscreen = !isFullscreen;
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