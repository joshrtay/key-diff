/**
 * Imports
 */

import test from 'tape'
import diff from '../src'

/**
 * Tests
 */

test('add', (t) => {
  let a = []
  let b = [{key: 'foo', val: 'bar'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('add many', (t) => {
  let a = []
  let b = [{key: 'foo', val: 'bar'}, {key: 'bat', val: 'box'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('add before/after', (t) => {
  let a = [{key: 'bar', val: 'two'}]
  let b = [
    {key: 'foo', val: 'one'},
    {key: 'bar', val: 'two'},
    {key: 'baz', val: 'three'}
  ]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('add middle', (t) => {
  let a = [{key: 'foo', val: 'one'}, {key: 'baz', val: 'four'}]
  let b = [
    {key: 'foo', val: 'one'},
    {key: 'bar', val: 'five'},
    {key: 'baz', val: 'four'}
  ]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('remove', (t) => {
  let a = [{key: 'foo', val: 'bar'}]
  let b = []
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('remove many', (t) => {
  let a = [{key: 'foo', val: 'bar'}, {key: 'bat', val: 'box'}]
  let b = []
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('remove one', (t) => {
  let a = [{key: 'bar', val: 'two'}, {key: 'foo', val: 'one'}]
  let b = [{key: 'bar', val: 'two'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('update', (t) => {
  let a = [{key: 'foo', val: 'bar'}]
  let b = [{key: 'foo', val: 'box'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('update/remove', (t) => {
  let a = [
    {key: 'foo', val: 'one'},
    {key: 'bar', val: 'two'},
    {key: 'baz', val: 'three'}
  ]
  let b = [{key: 'foo', val: 'one'}, {key: 'baz', val: 'four'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('update/remove 2', (t) => {
  let a = [
    {key: 'foo', val: 'one'},
    {key: 'bar', val: 'five'},
    {key: 'baz', val: 'four'}
  ]
  let b = [{key: 'foo', val: 'one'}, {key: 'bar', val: 'span'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('update/remove 3', (t) => {
  let a = [
    {key: 'bar', val: 'span'},
    {key: 'foo', val: 'one'}
  ]
  let b = [{key: 'foo', val: 'span'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})

test('swap', (t) => {
  let a = [{key: 'foo', val: 'bar'}, {key: 'bat', val: 'box'}]
  let b = [{key: 'bat', val: 'box'}, {key: 'foo', val: 'bar'}]
  let c = clone(a)
  let patch = update(c)

  diff(a, b, patch)

  t.deepEqual(c, b)

  t.end()
})




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

function insertAt (list, idx, item) {
  if (list[idx]) {
    list.splice(idx, 0, item)
  } else {
    list.push(item)
  }
}

function indexOf (list, item) {
  let i = 0
  for (; i < list.length; ++i) {
    if (list[i] === item) {
      return i
    }
  }
  return -1
}

function remove (list, item) {
  list.splice(indexOf(list, item), 1)
}

function move(list, idx, item) {
  remove(list, item)
  insertAt(list, idx, item)
}

function patch(list, pItem, nItem) {
  for (let key in pItem) {
    delete pItem[key]
  }
  for (let key in nItem) {
    pItem[key] = nItem[key]
  }
  return pItem
}

function clone (list) {
  return list.slice(0)
}
