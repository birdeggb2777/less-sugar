window.onload = function () {
  var arr = ['速度', '左右移動範圍', '左右移動範圍', '左右移動範圍'];
  var str = '';
  var oDiv=document.createElement('div');
  for (let index = 0; index < arr.length; index++) {
    html = `<div class="d-flex justify-content-around align-items-center mb-3"  id="objValue${index + 1}Container">
        <span id="FormobjValue${index + 1}">${arr[index]}</span>
        <input class="form-control w-75" type="text" id="objValue${index + 1}" value="0.5" onchange='blockEdit();'/>
      </div>`;
    str += html;
  }
  oDiv.innerHTML=str;
  //window.a=oDiv;
  form.append(oDiv);
  for (let index = 1; index < 4 + 1; index++) {
    this.getByID(`objValue${index}Container`).classList.remove('d-flex')
    this.getByID(`objValue${index}Container`).classList.add('d-none');
  }
}
function download(text, name, type) {
  //下載檔案 點擊輸出 後 出現的下載超連接的事件
  let a = document.getElementById("a");
  let file = new Blob([text], { type: type });
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
  if (chooseColor == 'laser') {
    for (let index = 1; index < 4 + 1; index++) {
      this.getByID(`objValue${index}Container`).classList.remove('d-flex')
      this.getByID(`objValue${index}Container`).classList.add('d-none');
    }
    this.getByID(`objValue${1}Container`).classList.add('d-flex');
    this.getByID(`objValue${4}Container`).classList.add('d-flex');
    getByID('objValue4').value = '150';
    getByID('objValue1').value = '0.5';
    //console.log('通通出現');
    
  } else {
    for (let index = 1; index < 4 + 1; index++) {
      this.getByID(`objValue${index}Container`).classList.remove('d-flex')
      this.getByID(`objValue${index}Container`).classList.add('d-none');
      //console.log('全都是none');
    }
    for (let index = 1; index < 4 + 1; index++) {
      this.getByID(`objValue${index}`).value = '0';
      this.getByID(`objValue${index}`).value = '0';
    }
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
///////////////////
let magnetSpeed = 0;
//////////////////
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
let laserBlockImg = new Image();
laserBlockImg.src = 'laserblock.png';
laserBlockImg.alt = 'laserBlockImg';
let laserImg = new Image();
laserImg.src = 'laser.png';
laserImg.alt = 'laserImg';
let isFailFunctionRunning = false;
window.addEventListener("keydown", KeyDown, true);
window.addEventListener("keyup", KeyUp, true);
oCanvas.addEventListener("mousedown", MouseDown, true);
oCanvas.addEventListener("mousemove", MouseMove, true);
oCanvas.addEventListener("mouseup", MouseUp, true);
function resetPlayer(x) {
  AllObject[0].width = 45;
  AllObject[0].height = 45;
  AllObject[0].pointY = 0;
  if (x) AllObject[0].pointX = x;
  //placeDirection[0] = 0;
  //placeDirection[1] = 0;
  AllObject[0].registerDraw();
}
async function failfunction() {
  //遊戲失敗結束的時候觸發
  if (isFailFunctionRunning) {
    return;
  }
  let x = AllObject[0].pointX;
  isFailFunctionRunning = true;
  await playerFailAnimate();
  resetPlayer(x);
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
         for (let i in AllObject) {
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
    magnet: function () {
      //this.pointX += magnetSpeed;
      // if (magnetSpeed!=0) alert(magnetSpeed);
    },
    code: function () {
      this.pointX += this.path[0];
      this.pointY += this.path[1];
      if (this.pointY > 600) {
        if (!isFailFunctionRunning) {
          failfunction();
        }
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
      for (let i in AllObject) {
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
  let keyID = e.keyCode ? e.keyCode : e.which;
  for (let i in AllObject) {
    if (AllObject[i].registerKeyDown) {
      AllObject[i].registerKeyDown(keyID);
    }
  }
}

function KeyUp(e) {
  let keyID = e.keyCode ? e.keyCode : e.which;
  for (let i in AllObject) {
    if (AllObject[i].registerKeyUp) {
      AllObject[i].registerKeyUp(keyID);
    }
  }
}
let timeoutCode = window.setInterval(function () {
  //###主動執行，每隔n秒執行一次
  //不斷的執行綁定在每個物件內部的函數
  //如果要新增怪物，就需要在怪物裡寫function code()，這裡會調用他的行為
  magnetSpeed = 0;
  for (let i in AllObject) {
    if (AllObject[i].code) {
      AllObject[i].code();
    }
  }
  for (let i in AllObject) {
    if (AllObject[i].pounch) {
      AllObject[i].pounch();
    }
  }
  for (let i in AllObject) {
    if (AllObject[i].magnet) {
      AllObject[i].magnet();
    }
  }
  magnetSpeed = 0;
});
let timeoutDraw = window.setInterval(function () {
  //主動執行，負責每個物件的顯示
  oCtx.clearRect(0, 0, oCanvas.width, oCanvas.height);
  for (let i in AllObject) {
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
  for (let i in AllObject) {
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
  let check = 0;
  let w = getByID('formWidth').value, h = getByID('formHeight').value;
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
  else if (chooseColor == 'laser') {
    tempDrawing = function () {
      oCtx.drawImage(laserBlockImg, chooseX - w / 2, chooseY - h / 2, w, h);
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
  let check = 0;
  if (chooseColor == 'yellow') tempColor = yelloImg;
  else if (chooseColor == 'red2') tempColor = redImg2;
  else if (chooseColor == 'blue') tempColor = blueImg;
  else if (chooseColor == 'green') tempColor = greenImg;
  else if (chooseColor == 'magnet1') tempColor = magnet1Img;
  else if (chooseColor == 'magnet2') tempColor = magnet2Img;
  else if (chooseColor == 'laser') tempColor = laserBlockImg;
  else check = 1;
  chooseY = AutoEditPointY(chooseX, chooseY);
  /* if (downCheck == true) {
       for (let i in AllObject) {
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
    let obj = {
      name: getByID('formName').value,
      pointX: chooseX - 25,
      pointY: chooseY - 25,
      width: parseInt(getByID('formWidth').value),
      height: parseInt(getByID('formHeight').value),
      path: [0, 0],
      speed: parseFloat(getByID('objValue1').value),
      objValue: parseFloat(getByID('objValue2').value),
      objValue2: parseFloat(getByID('objValue3').value),
      objValue3: parseFloat(getByID('objValue4').value),
      Image: tempColor,
      magnet: function () {
        this.pointX -= magnetSpeed;
      },
      code: function () {
        let check = 0;
        for (let i in AllObject) {
          if (i == 0) continue;
          if (pounch(AllObject[0].pointX - placeDirection[0], AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            AllObject[i].pointX, AllObject[i].pointY, AllObject[i].width, AllObject[i].height) == true) {
            check = 1;
          }
        }
        if (check == 0 || isFailFunctionRunning) this.pointX += placeDirection[0];
        this.pointY += placeDirection[1];
        if (this.Image == laserBlockImg) {
          //objValue 激光高度
          //objValue2 移動參數
          //objValue3 左右移動範圍
          this.objValue2 += 1;
          if (this.objValue2 > this.objValue3) this.objValue2 = -this.objValue3;
          if (this.objValue2 > 0) this.pointX += this.speed;
          else if (this.objValue2 < 0) this.pointX -= this.speed;
          let laserMin = 1500;
          for (let i in AllObject) {
            if (AllObject[i] == this) continue;
            if (pounch(AllObject[i].pointX, AllObject[i].pointY, AllObject[i].width, 1,
              this.pointX + (this.width / 2) - 10, this.pointY + this.height + 1, 10, laserMin) == true) {
              laserMin = AllObject[i].pointY - this.pointY - AllObject[i].height;
            }
          }
          this.objValue = laserMin;
        }
      },
      pounch: function () {
        if (this.Image == redImg2) {
          if (pounch(AllObject[0].pointX /*- placeDirection[0]*/, AllObject[0].pointY + AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            if (!isFailFunctionRunning) {
              failfunction();
              //alert("");
            }
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
            if (!isFailFunctionRunning) {
              failfunction();
            }
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
            if (!isFailFunctionRunning) {
              failfunction();
            }
          }
        }
        if (this.Image == magnet2Img) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            this.pointX - this.width, this.pointY, this.width * 2, this.height) == true) {
            magnetSpeed += 1;
          }
        }
        if (this.Image == greenImg) {
          if (pounch(AllObject[0].pointX - placeDirection[0], AllObject[0].pointY + AllObject[0].downSpeed, AllObject[0].width, AllObject[0].height,
            this.pointX, this.pointY, this.width, this.height) == true) {
            winfunction();
          }
        } if (this.Image == laserBlockImg) {
          if (pounch(AllObject[0].pointX, AllObject[0].pointY, AllObject[0].width, AllObject[0].height,
            this.pointX + (this.width / 2) - 10, this.pointY + this.height + 1, 20, this.objValue) == true) {
            failfunction();
          }
        }
      },
      registerDraw: function () {
        if (this.Image == laserBlockImg) {
          if (true) {
            oCtx.beginPath();
            oCtx.drawImage(this.Image, this.pointX, this.pointY, this.width, this.height);
            oCtx.closePath();

            oCtx.beginPath();
            oCtx.drawImage(laserImg, this.pointX + (this.width / 2) - 10, this.pointY + this.height, 20, this.objValue);
            oCtx.closePath();
            return;
          }
        }
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
    for (let i in AllObject) {
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
