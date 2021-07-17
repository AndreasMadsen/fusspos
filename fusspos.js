
var near = require('indexof-surrounding');

function Fusspos(description, text) {
  if (!(this instanceof Fusspos)) return new Fusspos(description, text);

  // These are the public properties containing the analysed result
  this.first = -1;
  this.start = -1;
  this.middle = -1;
  this.end = -1;
  this.last = -1;
  this.fussy = -1;

  var padding = description.length / 2;

  // The starting word is the longest word there appears in the text
  var startingWord = this._getStartingWord(description, text);
  if (startingWord === false) {
    this.start = this.first = NaN;
    this.middle = NaN;
    this.end = this.last = NaN;
    this.fussy = 1;
    return this;
  }

  // Get the best fit
  var best = this._getBestFit(description, text, startingWord);

  // Find the first and last word in the text array
  this.first = Math.min.apply(Math, best.positions);
  this.last = Math.max.apply(Math, best.positions);

  // Calculate the middle
  var avg = average(best.positions);
  this.middle = Math.floor(avg);

  // Give an estimate about where description is
  this.start = Math.max(this.first, Math.ceil(avg - padding));
  this.end = Math.min(this.last, Math.floor(avg + padding));

  // Compare the actual distance with an estimate for how bad the distance could
  // have been
  var worstDistance = Math.max(best.origin, text.length - best.origin);
  this.fussy = Math.min(1, best.distance / (worstDistance * description.length));
}
module.exports = Fusspos;

function average(values) {
  var sum = 0, l = values.length;
  for (var i = 0; i < l; i++) {
    sum += values[i];
  }

  return sum / l;
}

function getAppearances(word, list) {
  var appears = [], index = -1;
  while (true) {
    index = list.indexOf(word, index + 1);
    if (index === -1) break;
    appears.push(index);
  }
  return appears;
}

Fusspos.prototype._getStartingWord = function (description, text) {
  // Transform the description so long words appears first
  // This is because they are less likely to appear in the text as noise
  var longwords = description.map(function (word, index) {
    return {
      'word': word,
      'index': index
    };
  }).sort(function (a, b) {
    return b.word.length - a.word.length;
  });

  // Find the longest word there appears in the text
  for (var i = 0, l = longwords.length; i < l; i++) {
    var appears = getAppearances(longwords[i].word, text);
    if (appears.length !== 0) {
      return {
        descriptionIndex: longwords[i].index,
        textIndexs: appears
      };
    }
  }

  return false;
};

Fusspos.prototype._getBestFit = function (description, text, start) {
  var sugestions = start.textIndexs.map(function (position) {
    return {
      'origin': position,
      'distance': 0,
      'positions': [position],
      'search': position
    };
  });

  var descriptionIndex = start.descriptionIndex;
  var direction = 1; // 1: right, 0: left

  var found = -1, maxIndex = -1, maxValue = 0, searchPosition;

  var loops = 0;
  while (true) {
    loops += 1;

    // Right side is reached now go left
    if (direction === 1 && descriptionIndex === (description.length - 1)) {
      direction = 0;
      descriptionIndex = start.descriptionIndex;

      // Reset search position to origin
      for (var p = 0, r = sugestions.length; p < r; p++) {
        sugestions[p].search = sugestions[p].origin;
      }
    }
    // Left side is reached, now stop
    if (direction === 0 && descriptionIndex === 0) break;

    // Move the description index in the in the correct direction
    descriptionIndex += direction ? 1 : -1;

    // Temporary variables for finding the worst sugestion
    maxIndex = -1, maxValue = 0;

    // Go though all the sugestions
    for (var n = 0, s = sugestions.length; n < s; n++) {
      // Move the search position in the in the correct direction
      searchPosition = sugestions[n].search + (direction ? 1 : -1);
      if (searchPosition < 0) searchPosition = 0;
      if (searchPosition >= text.length) searchPosition = text.length - 1;

      // Do a surounding search for the description word in the text
      found = near(text, description[descriptionIndex], searchPosition);

      // Update the sugestions[n] state
      if (found === -1) {
        // Add the largest possible distance
        sugestions[n].distance += Math.max(
          searchPosition,
          text.length - searchPosition
        );
      } else {
        sugestions[n].distance += Math.abs(found - searchPosition);
        sugestions[n].search = found;
        sugestions[n].positions.push(found);
      }

      if (sugestions[n].distance >= maxValue) {
        maxValue = sugestions[n].distance;
        maxIndex = n;
      }
    }

    // if there are more than one sugestion and there has been made more than 3
    // loops then start removing the worst cases.
    if (sugestions.length > 1 && loops > 3) {
      sugestions.splice(maxIndex, 1);
    }
  }

  // if there are multiply sugestions then take the best
  var minIndex = -1, minValue = -1;
  if (sugestions.length > 1) {
    for (var j = 0, t = sugestions.length; j < t; j++) {
      if (sugestions[j].distance > minValue) {
        minValue = sugestions[j].distance;
        minIndex = j;
      }
    }

    sugestions = [sugestions[minIndex]];
  }

  // Return the remaining (and best) sugestion
  return sugestions[0];
};
