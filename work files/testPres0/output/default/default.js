let currentKeyframe = -1;
let URLparams = new URLSearchParams(location.search);

function advanceKeyframe() {
    if (currentKeyframe + 1 < allFrames.length) {
        currentKeyframe += 1;
        updateKeyframe();
        for (let transition of allFrames[currentKeyframe]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                switch (transition.effect) {
                    case 'class':
                        if (transition.add) {
                            elem.classList.add(transition.value);
                        }
                        else {
                            elem.classList.remove(transition.value);
                        }
                        break;
                    case 'translate':
                        let current_transform = window.getComputedStyle(elem).transform;
                        if (current_transform == 'none') {
                            current_transform = '';
                        }
                        let translation = `translate(${transition.value[0]}, ${transition.value[1]})`;
                        elem.style.transform = `${current_transform} ${translation}`;
                    case 'style':
                        elem.style.cssText = `${elem.style.cssText} ${transition.value}`;
                }
            }
        }
    }
}

function backKeyframe() {
    if (currentKeyframe > 0) {
        for (let transition of allFrames[currentKeyframe]) {
            let elems = document.querySelectorAll(transition.selector);
            for (let elem of elems) {
                switch (transition.effect) {
                    case 'class':
                        if (transition.add) {
                            elem.classList.remove(transition.value);
                        }
                        else {
                            elem.classList.add(transition.value);
                        }
                        break;
                    case 'translate':
                        let current_transform = window.getComputedStyle(elem).transform;
                        if (current_transform == 'none') {
                            current_transform = '';
                        }
                        let xy_trans = [];
                        for (let val of transition.value) {
                            if (val.trim().substring(0, 1) == '-') {
                                xy_trans.push(val.substring(1));
                            }
                            else {
                                xy_trans.push('-' + val);
                            }
                        }
                        let translation = `translate(${xy_trans[0]}, ${xy_trans[1]})`;
                        elem.style.transform = `${current_transform} ${translation}`;
                    case 'style':
                        elem.style.cssText = elem.style.cssText.replace(transition.value, '');
                }
            }
        }
        currentKeyframe -= 1;
        updateKeyframe();
    }
}

function updateKeyframe() {
    // console.log(currentKeyframe);
    let newURL = window.location.origin +
        window.location.pathname +
        "?frame=" + currentKeyframe;
    window.history.replaceState({}, "", newURL);
}

function goToKeyframe(keyframe) {
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
}

function hideElements() {
    for (frame of allFrames) {
        for (transition of frame) {
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

window.addEventListener('keydown', function(e) {
    if (e.key == "ArrowRight" || e.key == " ") {
        advanceKeyframe();
    }
    else if (e.key == "ArrowLeft") {
        backKeyframe();
    }
});
window.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.clientX < window.innerWidth/2) {
        backKeyframe();
    }
    else {
        advanceKeyframe();
    }
})

window.addEventListener('load', function() {
    hideElements();
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