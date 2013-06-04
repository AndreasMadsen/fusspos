#fusspos

> Fussy string search giving some estimate of a substring position

## Installation

```sheel
npm install fusspos
```

## Documentation

```JavaScript
  var fusspos = require('fusspos');

  // The function taks a description and a text, both must be arrays of words
  var description = 'The world has changed'.split(/\s+/);
  var text = 'By Andreas M.\n' +
             'The world has has changed, I\'m not sure it is ...'.split(/\s+/);

  // Search for description inside text
  var result = fusspos(description, text);
  result = {
    first: Number, // The very first appearance of any word
    start: Number, // An estimate on where the description starts
    middle: Number, // The avg. position of all description words in the text
    end: Number, // An estimate on where the description ends
    last: Number, // The very last appearance of any word
    fussy: Number // between 1 and 0, where 0 is perfect match and 1 is very bad
  };
```

##License

**The software is license under "MIT"**

> Copyright (c) 2013 Andreas Madsen
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
