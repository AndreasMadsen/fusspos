
var test = require('tap').test;
var fusspos = require('./fusspos.js');

test('when description is text', function (t) {
  t.test('start search at the beginning', function (t) {
    var description = ['long', 'a', 'b', 'c', 'd'];
  
    t.deepEqual(fusspos(description, description), {
      first: 0,
      start: 0,
      middle: 2,
      end: 4,
      last: 4,
      fussy: 0
    });
    t.end();
  });

  t.test('start search at the end', function (t) {
    var description = ['a', 'b', 'c', 'd', 'long'];
  
    t.deepEqual(fusspos(description, description), {
      first: 0,
      start: 0,
      middle: 2,
      end: 4,
      last: 4,
      fussy: 0
    });
    t.end();
  });

  t.test('start search at the middle', function (t) {
    var description = ['a', 'b', 'long', 'c', 'd'];
  
    t.deepEqual(fusspos(description, description), {
      first: 0,
      start: 0,
      middle: 2,
      end: 4,
      last: 4,
      fussy: 0
    });
    t.end();
  });

  t.end();
});

test('no description word exists in text', function (t) {
  var description = ['missing'];
  var text = ['a', 'b', 'c'];

  var result = fusspos(description, text);
  t.ok(Number.isNaN(result.first), 'first is NaN');
  t.ok(Number.isNaN(result.start), 'start is NaN');
  t.ok(Number.isNaN(result.middle), 'middle is NaN');
  t.ok(Number.isNaN(result.end), 'end is NaN');
  t.ok(Number.isNaN(result.last), 'last is NaN');
  t.equal(result.fussy, 1);
  t.end();
});

test('extra words in text do not make it fussy', function (t) {
  t.test('start search at the beginning', function (t) {
    var description = ['long', 'a', 'b'];
    var text = ['e', 'long', 'a', 'b', 'e'];

    t.deepEqual(fusspos(description, text), {
      first: 1,
      start: 1,
      middle: 2,
      end: 3,
      last: 3,
      fussy: 0
    });
    t.end();
  });

  t.test('start search at the end', function (t) {
    var description = ['a', 'b', 'long'];
    var text = ['e', 'a', 'b', 'long', 'e'];

    t.deepEqual(fusspos(description, text), {
      first: 1,
      start: 1,
      middle: 2,
      end: 3,
      last: 3,
      fussy: 0
    });
    t.end();
  });
  
  t.test('start search at the middle', function (t) {
    var description = ['a', 'long', 'b'];
    var text = ['e', 'a', 'long', 'b', 'e'];

    t.deepEqual(fusspos(description, text), {
      first: 1,
      start: 1,
      middle: 2,
      end: 3,
      last: 3,
      fussy: 0
    });
    t.end();
  });
  
  t.end();
});

test('double apperence in text should not be fussy', function (t) {
  var description = ['long', 'a', 'b'];

  t.test('with margin', function (t) {
    var text = ['e', 'long', 'a', 'b', 'e', 'long', 'a', 'b', 'e'];

    t.deepEqual(fusspos(description, text), {
      first: 1,
      start: 1,
      middle: 2,
      end: 3,
      last: 3,
      fussy: 0
    });
    t.end();
  });
  
  t.test('without margin', function (t) {
    var text = ['long', 'a', 'b', 'long', 'a', 'b'];

    t.deepEqual(fusspos(description, text), {
      first: 0,
      start: 0,
      middle: 1,
      end: 2,
      last: 2,
      fussy: 0
    });
    t.end();
  });

  t.end();
});

test('the text contains noice within the description', function (t) {
  var description = ['long', 'a', 'b'];
  var text = ['e', 'long', 'e', 'a', 'e', 'b', 'e'];

  t.deepEqual(fusspos(description, text), {
    first: 1,
    start: 2,
    middle: 3,
    end: 4,
    last: 5,
    fussy: 2/18
  });
  t.end();
});

test('the text do not contain all the description words', function (t) {
  var description = ['long', 'a', 'b'];
  var text = ['e', 'long', 'e', 'a', 'e'];

  t.deepEqual(fusspos(description, text), {
    first: 1,
    start: 1,
    middle: 2,
    end: 3,
    last: 3,
    fussy: 5/12
  });
  t.end();
});

test('the expected position won\'t go out of range', function (t) {
  t.test('to the left', function (t) {
    var description = ['a', 'long', 'b'];
    var text = ['long', 'b', 'e'];
  
    t.deepEqual(fusspos(description, text), {
      first: 0,
      start: 0,
      middle: 0,
      end: 1,
      last: 1,
      fussy: 3/9
    });
    t.end();
  });

  t.test('to the right', function (t) {
    var description = ['a', 'long', 'b'];
    var text = ['e', 'a', 'long'];
  
    t.deepEqual(fusspos(description, text), {
      first: 1,
      start: 1,
      middle: 1,
      end: 2,
      last: 2,
      fussy: 1/3
    });
    t.end();
  });
  t.end();
});
