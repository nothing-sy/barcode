// src/index.js
function EAN13(code) {
  this.code = String(code == null ? "" : code);
}
EAN13.prototype.format = function(code) {
  code = String(code == null ? "" : code);
  if (!/^\d{12,13}$/.test(code)) {
    return false;
  }
  return code.slice(0, 12);
};
EAN13.prototype.checkCode = function(code) {
  code = this.format(code);
  if (code === false) {
    throw new Error("EAN13: code must be 12 or 13 digits");
  }
  var c1 = 0;
  var c2 = 0;
  var i;
  for (i = 0; i < code.length; i++) {
    if (i % 2 === 0) {
      c1 += parseInt(code[i], 10);
    } else {
      c2 += parseInt(code[i], 10);
    }
  }
  return (10 - (c1 + c2 * 3) % 10) % 10;
};
EAN13.prototype.encode = function() {
  var code = this.format(this.code);
  if (code === false) {
    throw new Error("EAN13: code must be 12 or 13 digits");
  }
  var charset = {
    0: [0, 0, 0, 0, 0, 0],
    1: [0, 0, 1, 0, 1, 1],
    2: [0, 0, 1, 1, 0, 1],
    3: [0, 0, 1, 1, 1, 0],
    4: [0, 1, 0, 0, 1, 1],
    5: [0, 1, 1, 0, 0, 1],
    6: [0, 1, 1, 1, 0, 0],
    7: [0, 1, 0, 1, 0, 1],
    8: [0, 1, 0, 1, 1, 0],
    9: [0, 1, 1, 0, 1, 0]
  };
  var map = {
    0: ["0001101", "0100111", "1110010"],
    1: ["0011001", "0110011", "1100110"],
    2: ["0010011", "0011011", "1101100"],
    3: ["0111101", "0100001", "1000010"],
    4: ["0100011", "0011101", "1011100"],
    5: ["0110001", "0111001", "1001110"],
    6: ["0101111", "0000101", "1010000"],
    7: ["0111011", "0010001", "1000100"],
    8: ["0110111", "0001001", "1001000"],
    9: ["0001011", "0010111", "1110100"]
  };
  var front = code.substr(0, 1);
  var left = code.substr(1, 6);
  var right = code.substr(7);
  var start = "101";
  var spl = "01010";
  var end = "101";
  var blank = "00000000000";
  var _charset = charset[front];
  var leftB = "";
  var rightB = "";
  var i;
  for (i = 0; i < left.length; i++) {
    leftB += map[left[i]][_charset[i]];
  }
  for (i = 0; i < right.length; i++) {
    rightB += map[right[i]][2];
  }
  var checkDigit = this.checkCode(code);
  var checkCode = map[checkDigit][2];
  this.checkDigit = checkDigit;
  return blank + start + leftB + spl + rightB + checkCode + end + blank;
};
EAN13.prototype.init = function() {
  return this.encode();
};
EAN13.prototype.draw = function(id, width, height) {
  var canvas = typeof id === "string" ? document.getElementById(id) : id;
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("EAN13.draw: canvas not found");
  }
  var ctx = canvas.getContext("2d");
  var binary = this.encode();
  var num = 0;
  var i;
  for (i = 0; i < binary.length; i++) {
    ctx.fillStyle = binary[i] === "0" ? "white" : "black";
    ctx.fillRect(num * width, 0, width, height);
    num++;
  }
  return this;
};
function code128(code) {
  this.code = String(code == null ? "" : code);
  this.BARS = [
    212222,
    222122,
    222221,
    121223,
    121322,
    131222,
    122213,
    122312,
    132212,
    221213,
    221312,
    231212,
    112232,
    122132,
    122231,
    113222,
    123122,
    123221,
    223211,
    221132,
    221231,
    213212,
    223112,
    312131,
    311222,
    321122,
    321221,
    312212,
    322112,
    322211,
    212123,
    212321,
    232121,
    111323,
    131123,
    131321,
    112313,
    132113,
    132311,
    211313,
    231113,
    231311,
    112133,
    112331,
    132131,
    113123,
    113321,
    133121,
    313121,
    211331,
    231131,
    213113,
    213311,
    213131,
    311123,
    311321,
    331121,
    312113,
    312311,
    332111,
    314111,
    221411,
    431111,
    111224,
    111422,
    121124,
    121421,
    141122,
    141221,
    112214,
    112412,
    122114,
    122411,
    142112,
    142211,
    241211,
    221114,
    413111,
    241112,
    134111,
    111242,
    121142,
    121241,
    114212,
    124112,
    124211,
    411212,
    421112,
    421211,
    212141,
    214121,
    412121,
    111143,
    111341,
    131141,
    114113,
    114311,
    411113,
    411311,
    113141,
    114131,
    311141,
    411131,
    211412,
    211214,
    211232,
    2331112
  ];
  this.STARTA = 103;
  this.STARTB = 104;
  this.STARTC = 105;
  this.STOP = 106;
  this.bancodeIndex = [];
  this.resData = "";
  this.startType = "";
  this.setName = "";
}
code128.prototype.bs = function(bandCode) {
  bandCode = String(bandCode);
  var y;
  var t;
  for (y = 0; y < bandCode.length; y++) {
    var count = parseInt(bandCode[y], 10);
    for (t = 0; t < count; t++) {
      this.resData += y % 2 === 0 ? "b" : "s";
    }
  }
};
code128.prototype.checkCode = function() {
  var sum = 0;
  switch (this.startType) {
    case this.BARS[this.STARTA] + "":
      sum = 103;
      break;
    case this.BARS[this.STARTB] + "":
      sum = 104;
      break;
    case this.BARS[this.STARTC] + "":
      sum = 105;
      break;
    default:
      throw new Error("code128: startType not set");
  }
  var i;
  for (i = 0; i < this.bancodeIndex.length; i++) {
    sum += (i + 1) * this.bancodeIndex[i];
  }
  return this.BARS[sum % 103];
};
code128.prototype._reset = function() {
  this.bancodeIndex = [];
  this.resData = "";
  this.startType = "";
  this.setName = "";
};
code128.prototype.encode = function() {
  this._reset();
  var code = this.code;
  if (!code) {
    throw new Error("code128: empty code");
  }
  var useC = /^\d+$/.test(code) && code.length % 2 === 0;
  var offset = 32;
  if (useC) {
    this.startType = this.BARS[this.STARTC] + "";
    this.setName = "C";
  } else if (/[a-z]/.test(code)) {
    this.startType = this.BARS[this.STARTB] + "";
    this.setName = "B";
  } else {
    this.startType = this.BARS[this.STARTA] + "";
    this.setName = "A";
  }
  this.bs(this.startType);
  var i;
  if (useC) {
    for (i = 0; i < code.length; i += 2) {
      var val = parseInt(code.substr(i, 2), 10);
      this.bancodeIndex.push(val);
      this.bs(this.BARS[val] + "");
    }
  } else {
    for (i = 0; i < code.length; i++) {
      var idx = code.charCodeAt(i) - offset;
      if (idx < 0 || idx > 94) {
        throw new Error('code128: unsupported character "' + code[i] + '"');
      }
      this.bancodeIndex.push(idx);
      this.bs(this.BARS[idx] + "");
    }
  }
  this.bs(this.checkCode() + "");
  this.bs(this.BARS[this.STOP] + "");
  return this.resData;
};
code128.prototype.draw = function(id, width, height) {
  var canvas = typeof id === "string" ? document.getElementById(id) : id;
  if (!canvas || typeof canvas.getContext !== "function") {
    throw new Error("code128.draw: canvas not found");
  }
  var ctx = canvas.getContext("2d");
  var pattern = this.encode();
  var num = 0;
  var i;
  for (i = 0; i < pattern.length; i++) {
    ctx.fillStyle = pattern[i] === "s" ? "white" : "black";
    ctx.fillRect(num * width, 0, width, height);
    num++;
  }
  return this;
};
var barcode = { EAN13, code128 };
var index_default = barcode;
export {
  EAN13,
  code128,
  index_default as default
};
