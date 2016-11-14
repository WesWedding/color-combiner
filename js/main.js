(function ($) {
'use strict';
var DEFAULT_FG = {values: [255, 255, 255]};
var DEFAULT_BG = {values: [100, 0, 0]};
var DEFAULT_ALPHA = {value: 0.42};

var _fgColor = DEFAULT_FG;
var _bgColor = DEFAULT_BG;
var _alpha = DEFAULT_ALPHA;

var _readStringFor = {
  rgbVals: function(colorString) {
    var numbers = colorString.trim().toLowerCase();
    numbers = numbers.split('(');
    if (numbers.length > 1) {
      numbers = numbers[1];
    } else {
      numbers = numbers[0];
    }
    numbers = numbers.split(')')[0].split(',');
    numbers = numbers.map(function(string) {
      return string.trim();
    });
    return numbers;
  },
  alphaVals: function(alphaString) {
    var number = parseFloat(alphaString.trim().toLowerCase());
    return number;
  }
};

function rgbValuesAreValid(values) {
  var valid;
  if (values.length !== 3) {
    return false;
  }
  valid = values.reduce(function(prev, current) {
    // parseInt will accept a string like "1d093," but that's okay...
    var number = parseInt(current, 10);

    return prev && number >= 0 && number <= 255;
  }, true);

  return valid;
}

function setRgbVals(inputId, values) {
  var targetColor;
  switch(inputId) {
    case 'bgcolor':
      targetColor = _bgColor;
      break;
    case 'fgcolor':
      targetColor = _fgColor;
      break;
    default:
      throw new Error("Invalid inputId: " + inputId);
      break;
  }
  if (!rgbValuesAreValid(values)) {
    throw new Error("Invalid values passed.");
  }

  targetColor.values = values;
}
function setAlphaVals(value) {
  _alpha.value = value;
}

function onColorChange(event) {
  var value = _readStringFor.rgbVals(event.target.value);
  setRgbVals(event.target.name, value);
  setDocumentColors();
  updateTextValues();
}
function onAlphaChange(event) {
  var value = _readStringFor.alphaVals(event.target.value);
  setAlphaVals(value);
  setDocumentColors();
  updateTextValues();
}

function setDocumentColors() {
  var bgSwatch = document.querySelector('#bgcolor .swatch');
  var fgSwatch = document.querySelector('#fgcolor .swatch');
  var combinedSwatch = document.querySelector('#result .swatch');
  bgSwatch.style.backgroundColor = colorToRGBString(_bgColor);
  fgSwatch.style.backgroundColor = colorToRGBString(_fgColor);
  fgSwatch.style.opacity = _alpha.value;
  combinedSwatch.style.backgroundColor = colorToRGBString(combineColors(_bgColor, _fgColor, _alpha));
}

function updateTextValues() {
  var bgInput = document.querySelector('#bgcolor input');
  var fgInput = document.querySelector('#fgcolor input');
  var alphaInput = document.querySelector('#fgalpha input');
  var resultOutput = document.querySelector('#result .output');

  bgInput.setAttribute('placeholder', colorToRGBString(_bgColor));
  fgInput.setAttribute('placeholder', colorToRGBString(_fgColor));
  alphaInput.setAttribute('placeholder', _alpha.value);
  resultOutput.innerHTML = colorToRGBString(combineColors(_bgColor, _fgColor, _alpha));

}

function colorToRGBString(color) {
  var colorStr = 'rgb(';
  if (!color.values || color.values.length !== 3) {
    throw new Error("colorToRGBString given an invalid color object");
  }
  colorStr += color.values[0];
  colorStr += ', ' + color.values[1];
  colorStr += ', ' + color.values[2];
  colorStr += ')';
  return colorStr;
}

function combineColors(bgColor, fgColor, alpha) {
  var color = {values: [100, 100, 100]};
  color.values[0] = Math.floor((1 - alpha.value) * bgColor.values[0] + alpha.value * fgColor.values[0]);
  color.values[1] = Math.floor((1 - alpha.value) * bgColor.values[1] + alpha.value * fgColor.values[1]);
  color.values[2] = Math.floor((1 - alpha.value) * bgColor.values[2] + alpha.value * fgColor.values[2]);

  return color;
}

function attachListenersToInputs() {
  var fgInput = document.getElementById('fgcolor').querySelector('input');
  var bgInput = document.getElementById('bgcolor').querySelector('input');
  var alphaInput = document.getElementById('fgalpha').querySelector('input');

  fgInput.addEventListener('input', onColorChange);
  bgInput.addEventListener('input', onColorChange);
  alphaInput.addEventListener('input', onAlphaChange);
}

  document.addEventListener("DOMContentLoaded", function(event) {
    attachListenersToInputs();
    setDocumentColors();
    updateTextValues();
  });

})(window.jQuery);