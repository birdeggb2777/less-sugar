function download(text, name, type) {
  //下載檔案 點擊輸出 後 出現的下載超連接的事件
  var a = document.getElementById("a");
  var file = new Blob([text], { type: type });
  a.href = URL.createObjectURL(file);
  a.style.display = "";
  a.download = name;
}
function setControl() {
  getByID('formName').value = chooseColor;
  getByID('formPath').value = chooseColor + '.png ';
  if (chooseColor == 'magnet1' || chooseColor == 'magnet2') {
    getByID('formWidth').value = '90';
    getByID('formHeight').value = '90';
  }
  else {
    getByID('formWidth').value = '45';
    getByID('formHeight').value = '45';
  }
}

function getByID(id) {
  return document.getElementById(id);
}

function blockEdit() {
  //修改表單時 讓方塊得到相對的寬高
  // if (chooseColor != "edit" && chooseColor != "") return;
  if (chooseColor == "" && AllObject[NowObj]) {
    AllObject[NowObj].name = getByID('formName').value;
    AllObject[NowObj].pointX = chooseX - parseInt(getByID('formWidth').value / 2);
    AllObject[NowObj].pointY = chooseY - parseInt(getByID('formHeight').value / 2);
    AllObject[NowObj].width = parseInt(getByID('formWidth').value);
    AllObject[NowObj].height = parseInt(getByID('formHeight').value);
    return
  }
  else if (chooseColor == "edit") {
    AllObject[NowObj].name = getByID("formName").value;
    //這個不會起作用 start
    AllObject[NowObj].pointX = parseInt(getByID("formX").value);
    AllObject[NowObj].pointY = parseInt(getByID("formY").value);
    //不會起作用 end
    AllObject[NowObj].width = parseInt(getByID("formWidth").value);
    AllObject[NowObj].height = parseInt(getByID("formHeight").value);
  }
}
let NowObj = 0;
let rulerPoint = 0;
let chooseColor = "";
let chooseX = 0;
let chooseY = 0;
let downCheck = false;
let TotalXMove = 0;
let placeDirection = [0, 0];
let oCanvas = document.getElementById("game"),
  oCtx = oCanvas.getContext("2d");

let tempImg = new Image();
let yelloImg = new Image();
yelloImg.src = 'yellow.png';
yelloImg.alt = 'yelloImg';
let magnet1Img = new Image();
magnet1Img.src = 'magnet1.png';
magnet1Img.alt = 'magnet1Img';
let magnet2Img = new Image();
magnet2Img.src = 'magnet2.png';
magnet2Img.alt = 'magnet2Img';
let redImg2 = new Image();
redImg2.src = 'red2.png';
redImg2.alt = 'redImg2';
let blueImg = new Image();
blueImg.src = 'blue.png';
blueImg.alt = 'blueImg';
let greenImg = new Image();
greenImg.src = 'green.png';
greenImg.alt = 'greenImg';
let isFailFunctionRunning = false;
window.addEventListener("keydown", KeyDown, true);
window.addEventListener("keyup", KeyUp, true);
oCanvas.addEventListener("mousedown", MouseDown, true);
oCanvas.addEventListener("mousemove", MouseMove, true);
oCanvas.addEventListener("mouseup", MouseUp, true);
function resetPlayer() {
  AllObject[0].width = 45;
  AllObject[0].height = 45;
  AllObject[0].pointY = 0;
  //placeDirection[0] = 0;
  //placeDirection[1] = 0;
  AllObject[0].registerDraw();
}
async function failfunction() {
  //遊戲失敗結束的時候觸發
  if (isFailFunctionRunning) {
    return;
  }
  isFailFunctionRunning = true;
  await playerFailAnimate();
  resetPlayer();
  isFailFunctionRunning = false;
}

function playerFailAnimate() {
  return new Promise(resolve => {
    // failAnimateSound.play();
    let left = AllObject[0].pointX,
      right = AllObject[0].pointX,
      top = AllObject[0].pointY,
      bottom = AllObject[0].pointY;
    function animate() {
      AllObject[0].width -= 2;
      AllObject[0].height -= 2;
      function drawLeftTopFragment() {
        left -= 1;
        top -= 1;
        AllObject[0].pointX = left;
        AllObject[0].pointY = top;
        AllObject[0].registerDraw();
      }
      function drawRightTopFragment() {
        right += 1;
        AllObject[0].pointX = right;
        AllObject[0].pointY = top;
        AllObject[0].registerDraw();
      }
      function drawLeftBottomFragment() {
        bottom += 1;
        AllObject[0].pointX = left;
        AllObject[0].pointY = bottom;
        AllObject[0].registerDraw();
      }
      function drawRightBottomFragment() {
        AllObject[0].pointX = right;
        AllObject[0].pointY = bottom;
        AllObject[0].registerDraw();
      }
      drawLeftTopFragment();
      drawRightTopFragment();
      drawLeftBottomFragment();
      drawRightBottomFragment();
      if (AllObject[0].width <= 0 && AllObject[0].height <= 0) {
        cancelAnimationFrame(animate);
        resolve();
        return;
      }
      requestAnimationFrame(animate);
    }
    animate();
  });
}
function winfunction() {
  //遊戲成功結束的時候觸發
  /* AllObject[0].pointY = 0;
         placeDirection[0] = 0;
         placeDirection[1] = 0;
         for (var i in AllObject) {
             if (i == 0) continue;
             AllObject[i].pointX -= TotalXMove;
         }*/
  // alert("");
}
let tempDrawing = function () { }; //抓取方塊時，尚未放到遊戲介面裡，途中移動的過程需要的繪製函數

function pounch(x, y, w, h, x2, y2, w2, h2) {
  //碰撞偵測
  if (y + h >= y2 && x + w >= x2 && y < y2 + h2 && x < x2 + w2) return true;
  return false;
}
let AllObject = [
  {
    //自己  和  地圖
    //現在是初始值  只有自己
    //地圖畫完後會是[{我},{方塊1},{方塊2}...]這樣
    name: "Me",
    pointX: 250,
    pointY: 0,
    width: 45,
    height: 45,
    upSet: 0,
    upHeight: 120,
    downSpeed: 0.5,
    speed: 1,
    path: [0, 0],
    code: function () {
      this.pointX += this.path[0];
      this.pointY += this.path[1];
      if (this.pointY > 600) {
        failfunction();
      }
      if (this.upSet > 1) {
        this.upSet -= 1;
        this.path[1] = -this.speed;
      } else {
        this.path[1] = 0;
      }
    },
    registerDraw: async function () {
      oCtx.beginPath();
      oCtx.fillStyle = "red";
      oCtx.rect(this.pointX, this.pointY, this.width, this.height);
      oCtx.fill();
      oCtx.closePath();
    },
    pounch: function () {
      //影響玩家自己的運動狀態，裡面會使用到碰撞函數
      let check = 0;
      for (var i in AllObject) {
        if (i == 0) continue;
        if (
          pounch(
            this.pointX,
            this.pointY + this.downSpeed,
            this.width,
            this.height,
            AllObject[i].pointX,
            AllObject[i].pointY,
            AllObject[i].width,
            AllObject[i].height
          ) == true
        ) {
          check = 1;
        }
        if (
          this.upSet > 0 &&
          pounch(
            this.pointX,
            this.pointY - this.speed - 1,
            this.width,
            this.height,
            AllObject[i].pointX,
            AllObject[i].pointY,
            AllObject[i].width,
            AllObject[i].height
          ) == true
        ) {
          check = 2;
        }
      }
      if (check == 0) {
        this.pointY += this.downSpeed; //alert('');
      } else if (check == 1) {
        this.upSet = 0; //alert('1');
      }
      else if (check == 2) {
        this.upSet = -100000; //alert('1');
      }
    },
    registerKeyDown: function (key) {
      if (
        key === 38 ||
        key === 87 /*|| pounch0(Me.myX, Me.myY + 2, Me.myW, Me.myH) == true*/
      ) {
        // up arrow and W
        if (this.upSet < 1 && this.upSet > -100000) {
          this.path[1] = -this.speed;
          this.upSet = this.upHeight;
        }
      }
      if (key === 39 || key === 68) {
        // right arrow and D
        placeDirection[0] = -1;
        //TotalXMove -= 1;
      }
      if (key === 40 || key === 83) {
        // down arrow and S
        //  this.path[1] = 1;
      }
      if (key === 37 || key === 65) {
        // left arrow and A
        placeDirection[0] = 1;
        //TotalXMove += 1;
      }
    },
    registerKeyUp: function (key) {
      if (
        key === 38 ||
        key === 87 /*|| pounch0(Me.myX, Me.myY + 2, Me.myW, Me.myH) == true*/
      ) {
        // up arrow and W
        // this.path[1] = 0;
      }
      if (key === 39 || key === 68) {
        // right arrow and D
        placeDirection[0] = 0;
      }
      if (key === 40 || key === 83) {
        // down arrow and S
        //  this.path[1] = 0;
      }
      if (key === 37 || key === 65) {
        // left arrow and A
        placeDirection[0] = 0;
      }
    }
  }
  /* {
             name: 'yellowblock',
             pointX: 150,
             pointY: 400,
             width: 45,
             height: 45,
             path: [0, 0],
             Image: yelloImg,
             code: function () {
                 this.pointX += placeDirection[0];
                 this.pointY += placeDirection[1];
             },
             registerDraw: function () {
                 oCtx.beginPath();
                 oCtx.drawImage(this.Image, this.pointX, this.pointY, this.width, this.height);
                 oCtx.closePath();
             }
         }*/
];

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
  //###主動執行，每隔n秒執行一次
  //不斷的執行綁定在每個物件內部的函數
  //如果要新增怪物，就需要在怪物裡寫function code()，這裡會調用他的行為

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
  /* let check=0;
         for (var i in AllObject) {
             if (i == 0) continue;
             if (pounch(AllObject[0].pointX - placeDirection[0], AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
                 AllObject[i].pointX, AllObject[i].pointY, AllObject[i].width, AllObject[i].height) == true) {
                 check = 1;
             }
         }
         if (check == 0) TotalXMove += placeDirection[0];*/
});
var timeoutDraw = window.setInterval(function () {
  //主動執行，負責每個物件的顯示
  oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
  for (var i in AllObject) {
    if (AllObject[i].registerDraw) {
      AllObject[i].registerDraw();
    }
  }
  tempDrawing();
});

function MouseDown(e) {
  //點完方塊移到地圖上放下的一瞬間
  //如果放置的位子沒有物件

  chooseX = e.offsetX;
  chooseY = e.offsetY;
  chooseY = AutoEditPointY(chooseX, chooseY);
  downCheck = true;

  if (chooseColor == "") {
    //防止使用者手上不會有兩個積木
    chooseBlock();
  }
}
function chooseBlock() {
  for (var i in AllObject) {
    if (
      AllObject[i].pointX &&
      AllObject[i].pointY &&
      AllObject[i].width &&
      AllObject[i].height
    ) {
      if (
        pounch(
          chooseX,
          chooseY,
          2,
          2,
          AllObject[i].pointX,
          AllObject[i].pointY,
          AllObject[i].width + 25 / 2,
          AllObject[i].height + 25 / 2
        ) == true
      ) {
        chooseColor = "move";
        getByID("formName").value = AllObject[i].name;
        getByID("formWidth").value = AllObject[i].width;
        getByID("formHeight").value = AllObject[i].height;
        tempImg = AllObject[i].Image;
        NowObj = i;
        // alert(NowObj);
        break;
      }
    }
  }
}
function MouseMove(e) {
  downCheck = false;
  chooseX = e.offsetX;
  chooseY = e.offsetY;
  chooseY = AutoEditPointY(chooseX, chooseY);
  var check = 0;
  var w = getByID('formWidth').value, h = getByID('formHeight').value;
  //  console.log(chooseColor);
  if (chooseColor == 'yellow') {
    tempDrawing = function () {
      //alert(chooseX-25);
      oCtx.drawImage(yelloImg, chooseX - w / 2, chooseY - h / 2, w, h);
    }
  } else if (chooseColor == 'red2') {
    tempDrawing = function () {
      oCtx.drawImage(redImg2, chooseX - w / 2, chooseY - h / 2, w, h);
    }
  } else if (chooseColor == 'blue') {
    tempDrawing = function () {
      oCtx.drawImage(blueImg, chooseX - w / 2, chooseY - h / 2, w, h);
    }

  } else if (chooseColor == 'green') {
    tempDrawing = function () {
      oCtx.drawImage(greenImg, chooseX - w / 2, chooseY - h / 2, w, h);
    }
  } else if (chooseColor == 'magnet1') {
    tempDrawing = function () {
      oCtx.drawImage(magnet1Img, chooseX - w / 2, chooseY - h / 2, w, h);
    }
  }
  else if (chooseColor == 'magnet2') {
    tempDrawing = function () {
      oCtx.drawImage(magnet2Img, chooseX - w / 2, chooseY - h / 2, w, h);
    }
  }
  else {
    check = 1;
  }
  if (check == 0) {
    getByID('formX').value = '' + chooseX;
    getByID('formY').value = '' + chooseY;
  } else if (chooseColor == 'move' && AllObject[NowObj]) {
    getByID('formX').value = '' + chooseX;
    getByID('formY').value = '' + chooseY;
    AllObject[NowObj].name = getByID('formName').value;
    AllObject[NowObj].pointX = chooseX - 25;
    AllObject[NowObj].pointY = chooseY - 25;
    AllObject[NowObj].width = parseInt(getByID('formWidth').value);
    AllObject[NowObj].height = parseInt(getByID('formHeight').value);
  }
}

function MouseUp(e) {
  tempDrawing = function () { };
  chooseX = e.offsetX;
  chooseY = e.offsetY;
  let tempColor;
  var check = 0;
  if (chooseColor == 'yellow') tempColor = yelloImg;
  else if (chooseColor == 'red2') tempColor = redImg2;
  else if (chooseColor == 'blue') tempColor = blueImg;
  else if (chooseColor == 'green') tempColor = greenImg;
  else if (chooseColor == 'magnet1') tempColor = magnet1Img;
  else if (chooseColor == 'magnet2') tempColor = magnet2Img;
  else check = 1;
  chooseY = AutoEditPointY(chooseX, chooseY);
  /* if (downCheck == true) {
       for (var i in AllObject) {
           if (AllObject[i].pointX && AllObject[i].pointY && AllObject[i].width && AllObject[i].height) {
               if (pounch(chooseX, chooseY, 2, 2, AllObject[i].pointX, AllObject[i].pointY, AllObject[i].width + 25 / 2, AllObject[i].height + 25 / 2) == true) {
                   chooseColor = 'edit';
                   getByID('formName').value = AllObject[i].name;
                   getByID('formWidth').value = AllObject[i].width;
                   getByID('formHeight').value = AllObject[i].height;
                   tempImg = AllObject[i].Image;
                   NowObj = i;
                   // alert(NowObj);
                   break;
               }
           }
       }
   }*/
  if (check == 0) {
    downCheck = false;
    var obj = {
      name: getByID('formName').value,
      pointX: chooseX - 25,
      pointY: chooseY - 25,
      width: parseInt(getByID('formWidth').value),
      height: parseInt(getByID('formHeight').value),
      path: [0, 0],
      Image: tempColor,
      code: function () {
        let check = 0;
        for (var i in AllObject) {
          if (i == 0) continue;
          if (pounch(AllObject[0].pointX - placeDirection[0], AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            AllObject[i].pointX, AllObject[i].pointY, AllObject[i].width, AllObject[i].height) == true) {
            check = 1;
          }
        }
        if (check == 0) this.pointX += placeDirection[0];
        this.pointY += placeDirection[1];
      },
      pounch: function () {
        if (this.Image == redImg2) {
          if (pounch(AllObject[0].pointX /*- placeDirection[0]*/, AllObject[0].pointY + AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            failfunction();

          }
        }
        if (this.Image == blueImg) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY + AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            this.pointY += 0.4;
          }
        }
        if (this.Image == magnet1Img) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY - AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            failfunction();
          }
        }
        if (this.Image == magnet1Img) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY + this.height, this.width, this.height * 2) == true) {
            AllObject[0].pointY -= 1;
          }
        }
        if (this.Image == magnet2Img) {
          if (pounch(AllObject[0].pointX - AllObject[0].speed, AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            failfunction();
          }
        }
        if (this.Image == magnet2Img) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            this.pointX - this.width, this.pointY, this.width * 2, this.height) == true) {
            AllObject[0].pointX += 1;
          }
        }
        if (this.Image == greenImg) {
          if (pounch(AllObject[0].pointX - placeDirection[0], AllObject[0].pointY + AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            winfunction();
          }
        }
      },
      registerDraw: function () {
        oCtx.beginPath();
        oCtx.drawImage(this.Image, this.pointX, this.pointY, this.width, this.height);
        oCtx.closePath();
      }
    }
    AllObject.push(obj);
    chooseColor == 'move';
  }
  else if (chooseColor == 'move' && AllObject[NowObj]) {
    AllObject[NowObj].name = getByID('formName').value;
    AllObject[NowObj].pointX = chooseX - 25;
    AllObject[NowObj].pointY = chooseY - 25;
    AllObject[NowObj].width = parseInt(getByID('formWidth').value);
    AllObject[NowObj].height = parseInt(getByID('formHeight').value);
  }
  console.log(AllObject[NowObj]);
  // if (AllObject[NowObj])
  //alert(parseInt(getByID('formHeight').value));
  chooseColor = '';
}

function AutoEditPointY(chooseX, chooseY) {
  //功能-座標修正
  if (getByID("AutoPoint").checked == true) {
    for (var i in AllObject) {
      //console.log(i);
      if (NowObj == 0) continue;
      if (i == 0) continue;
      if (i == NowObj) continue;
      if (
        AllObject[i].pointX &&
        AllObject[i].pointY &&
        AllObject[i].width &&
        AllObject[i].height
      ) {
        if (
          pounch(
            chooseX - parseInt(getByID("formWidth").value),
            chooseY,
            parseInt(getByID("formWidth").value),
            10,
            AllObject[i].pointX,
            AllObject[i].pointY,
            AllObject[i].width + 25 / 2,
            AllObject[i].height + 25 / 2
          ) == true
        ) {
          chooseY = AllObject[i].pointY + 25;
          break;
        }
      }
      if (
        AllObject[i].pointX &&
        AllObject[i].pointY &&
        AllObject[i].width &&
        AllObject[i].height
      ) {
        if (
          pounch(
            chooseX + parseInt(getByID("formWidth").value),
            chooseY,
            parseInt(getByID("formWidth").value),
            10,
            AllObject[i].pointX,
            AllObject[i].pointY,
            AllObject[i].width + 25 / 2,
            AllObject[i].height + 25 / 2
          ) == true
        ) {
          chooseY = AllObject[i].pointY + 25;
          break;
        }
      }
    }
  }
  return chooseY;
}
