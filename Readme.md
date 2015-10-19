
# key-diff

[![Codeship Status for joshrtay/key-diff](https://img.shields.io/codeship/6ecc3110-581f-0133-40c0-26e98ecb9625/master.svg)](https://codeship.com/projects/109614)  [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

A list diff algorightm with support for keys

## Installation

    $ npm install key-diff

## Usage

```js
import diff from 'key-diff'

let a = [{key: 'foo', val: 'one'}, {key: 'bar', val: 'two'}, {key: 'baz', val: 'three'}]
let b = [{key: 'bar', val: 'two'}, {key: 'foo', val: 'one'},  {key: 'bat', val: 'four'}]

let c = clone(a)
let handler = update(c)
diff(a, b, handler)

assert.deepEqual(c, b)

function update(list) {
  return function(action) {
    switch(action.type) {
      case diff.CREATE:
        insertAt(list, action.pos, action.next.item)
        break
      case diff.REMOVE:
        remove(list, action.prev.item)
        break
      case diff.MOVE:
        patch(list, action.prev.item, action.next.item)
        move(list, action.pos, action.prev.item)
        break
      case diff.UPDATE:
        patch(list, action.prev.item, action.next.item)
        break
    }
  }
}

// implement patch, insertAt, remove, and move ...

```

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
