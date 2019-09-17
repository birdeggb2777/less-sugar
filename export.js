function asdHappyCopy() {
    function superToString(objArr) {
        let theStr = 'let AllObject=[';
        objArr.forEach(obj => {
            theStr += "{";
            for (const key in obj) {
                if (key == "name") theStr += key + ":" + "'" + obj[key] + "',";
                else if (key == "path") theStr += key + ":" + "[" + obj[key] + "],";
                else if (key == "Image") { theStr += key + ":" + "" + obj[key].alt + ","; }
                else theStr += key + ":" + obj[key] + ",";//;`"${key}":${obj[key]},`;
            }
            theStr += "},";
        })
        theStr = "" + theStr + "]";
        return theStr;
    }
    const yo = `<span style='font-size: large;'></span>
<canvas height='550' id='game' width='750'></canvas>
    <script>let NowObj = 0;
let rulerPoint = 0;
let chooseColor = '';
let chooseX = 0;
let chooseY = 0;
let downCheck = false;
let TotalXMove = 0;
let placeDirection = [0, 0];
let oCanvas = document.getElementById('game'),
    oCtx = oCanvas.getContext('2d');
let tempImg = new Image();
let yelloImg = new Image();
yelloImg.src = 'https://raw.githubusercontent.com/birdeggb2777/less-sugar/master/yellow.png';
let blueImg = new Image();
blueImg.src = 'https://raw.githubusercontent.com/birdeggb2777/less-sugar/master/blue.png';
let redImg2 = new Image();
redImg2.src = 'https://raw.githubusercontent.com/birdeggb2777/less-sugar/master/red2.png';
let greenImg = new Image();
greenImg.src = 'https://raw.githubusercontent.com/birdeggb2777/less-sugar/master/green.png';
window.addEventListener('keydown', KeyDown, true);
window.addEventListener('keyup', KeyUp, true);
function failfunction() {
    AllObject[0].pointY = 0;
    placeDirection[0] = 0;
    placeDirection[1] = 0;
    for (var i in AllObject) {
        if (i == 0) continue;
        AllObject[i].pointX -= TotalXMove;
    }
    alert('fail');
    window.location.reload();
}
function winfunction() {
    /*AllObject[0].pointY = 0;
    placeDirection[0] = 0;
    placeDirection[1] = 0;
    for (var i in AllObject) {
        if (i == 0) continue;
        AllObject[i].pointX -= TotalXMove;
    }*/
    clearInterval(timeoutCode);
    alert('win');
}
let tempDrawing = function () { };
function pounch(x, y, w, h, x2, y2, w2, h2) {
    if (y + h >= y2 && x + w >= x2 && y < y2 + h2 && x < x2 + w2)
        return true;
    return false;
};
${superToString(AllObject)};
function KeyDown(e) {                                   
    var keyID = e.keyCode ? e.keyCode : e.which;               
    for (var i in AllObject) {                                 
        if (AllObject[i].registerKeyDown) {                    
            AllObject[i].registerKeyDown(keyID);               
        }                                                      
    }                                                          
}                                                              
function KeyUp(e) {                                            
    var keyID = e.keyCode ? e.keyCode : e.which;               
    for (var i in AllObject) {                                 
        if (AllObject[i].registerKeyUp) {                      
            AllObject[i].registerKeyUp(keyID);                 
        }                                                      
    }                                                          
}                                                              
var timeoutCode = window.setInterval(function () {             
    for (var i in AllObject) {                                 
        if (AllObject[i].code) {                               
            AllObject[i].code();                               
        }                                                      
    }                                                          
    for (var i in AllObject) {                                 
        if (AllObject[i].pounch) {                             
            AllObject[i].pounch();                             
        }                                                      
    }                                                          
                                                               
});                                                            
var timeoutDraw = window.setInterval(function () {             
    oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);       
    for (var i in AllObject) {                                 
        if (AllObject[i].registerDraw) {                       
            AllObject[i].registerDraw();                       
        }                                                      
    }                                                          
    tempDrawing(); }) <\/script>`;
    //console.log(yo, 'yooooo')
    return yo;
}