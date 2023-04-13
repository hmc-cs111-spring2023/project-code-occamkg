function numFrames() { return 5 }

function advanceKeyframe() {
    currentKeyframe = Math.min(numFrames(), currentKeyframe + 1);
    updateKeyframe();
    switch(currentKeyframe) {
        case 0:
            document.getElementById("group1").style.opacity = 1;
            document.getElementById("group1").style.visibility = "visible";
            break;
        case 1:
            document.getElementById("group1").style.transitionDelay = "0s";
            document.getElementById("group1").style.transform = "translateX(100%)";
            document.getElementById("group2").style.transitionDelay = "0.2s";
            document.getElementById("group2").style.visibility = "hidden";
            document.getElementById("group2").style.opacity = 1;
            document.getElementById("group2").style.visibility = "visible";
            break;
        case 2:
            document.getElementById("2text1").style.opacity = 1;
            document.getElementById("2text1").style.visibility = "visible";
            break;
        case 3:
            document.getElementById("2text1").style.opacity = 0.5;
            document.getElementById("2text1").style.fontSize = "2.8cqi";
            document.getElementById("2text2").style.opacity = 1;
            document.getElementById("2text2").style.visibility = "visible";
            break;
        case 4:
            document.getElementById("2text2").style.opacity = 0.5;
            document.getElementById("2text2").style.fontSize = "2.8cqi";
            document.getElementById("2text3").style.opacity = 1;
            document.getElementById("2text3").style.visibility = "visible";
            break;
        case 5:
            document.getElementById("group2").style.opacity = 0;
            document.getElementById("group2").style.visibility = "hidden";
            break;
    }
}

function backKeyframe() {
    currentKeyframe = Math.max(0, currentKeyframe - 1);
    updateKeyframe();
    switch(currentKeyframe) {
        case 0:
            document.getElementById("group1").style.transitionDelay = "0.2s";
            document.getElementById("group1").style.transform = "translateX(0)";
            document.getElementById("group1").style.visibility = "visible";
            document.getElementById("group2").style.transitionDelay = "0s";
            document.getElementById("group2").style.opacity = 0;
            document.getElementById("group2").style.visibility = "hidden";
            break;
        case 1:                
            document.getElementById("2text1").style.opacity = 0;
            document.getElementById("2text1").style.visibility = "hidden";
            break;
        case 2:                
            document.getElementById("2text1").style.opacity = 1;
            document.getElementById("2text1").style.fontSize = "3.6cqi";
            document.getElementById("2text2").style.opacity = 0;
            document.getElementById("2text2").style.visibility = "hidden";
            break;
        case 3:                
            document.getElementById("2text2").style.opacity = 1;
            document.getElementById("2text2").style.fontSize = "3.6cqi";
            document.getElementById("2text3").style.opacity = 0;
            document.getElementById("2text3").style.visibility = "hidden";
            break;
        case 4:
            document.getElementById("group2").style.opacity = 1;
            document.getElementById("group2").style.visibility = "visible";
            break;
        case 5:
            break;
    }
}