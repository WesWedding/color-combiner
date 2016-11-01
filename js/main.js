(function ($) {
'use strict';
var DEFAULT_FG = {values: [100, 100, 100]};
var DEFAULT_BG = {values: [100, 100, 100]};
var DEFAULT_ALPHA = {value: 0.3};

var fgColor = DEFAULT_FG;
var bgColor = DEFAULT_BG;
var alpha = DEFAULT_ALPHA;

function pickOutRGBVals(colorString) {
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
}

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
      targetColor = bgColor;
      break;
    case 'fgcolor':
      targetColor = fgColor;
      break;
    default:
      throw new Error("Invalid inputId.");
      break;
  }
  if (!rgbValuesAreValid(values)) {
    throw new Error("Invalid values passed.");
  }

  console.log("before", targetColor);
  targetColor.values = values;
  console.log("after", targetColor);
}

function onColorChange(event) {
  var value = pickOutRGBVals(event.target.value);
  setRgbVals(event.target.id, value);
  setDocumentColors();
}
function onAlphaChange(event) {
  console.log('alphachange', event);
}

function setDocumentColors() {
  document.body.style.background = colorToRGBString(bgColor);
}

function colorToRGBString(color) {
  var values = [];
  if (!color.values && color.values.length === 3) {
    values = color.values;
  }
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
  });

})(window.jQuery);