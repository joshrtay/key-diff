/**
 * Constants
 */

const DIFF_CREATE = 'DIFF_CREATE'
const DIFF_UPDATE = 'DIFF_UPDATE'
const DIFF_MOVE = 'DIFF_MOVE'
const DIFF_REMOVE = 'DIFF_REMOVE'


/**
 * Key diff
 */

function diff (prev, next, effect, equal) {
  let pStart = cursor(prev, 0)
  let pEnd = cursor(prev, prev.length - 1)

  let nStart = cursor(next, 0)
  let nEnd = cursor(next, next.length - 1)

  let keyToIdx, idxInPrev, before;

  equal = equal || defaultEqual

  while (pStart.idx <= pEnd.idx && nStart.idx <= nEnd.idx) {
    if (isUndefined(pStart.item)) {
      pStart = forward(prev, pStart)
    } else if (isUndefined(pEnd.item)){
      pEnd = back(prev, pEnd)
    } else if (equal(pStart, nStart)){
      effect(DIFF_UPDATE, pStart.item, nStart.item)
      pStart = forward(prev, pStart)
      nStart = forward(next, nStart)
    } else if (equal(pEnd, nEnd)) {
      effect(DIFF_UPDATE, pEnd.item, nEnd.item)
      pEnd = back(prev, pEnd)
      nEnd = back(next, nEnd)
    } else if (equal(pStart, nEnd)) {
      effect(DIFF_MOVE, pStart.item, nEnd.item, pEnd.idx)
      pStart = forward(prev, pStart)
      nEnd = back(next, nEnd)
    } else if (equal(pEnd, nStart)) {
      effect(DIFF_MOVE, pEnd.item, nStart.item, pStart.idx)
      pEnd = back(prev, pEnd)
      nStart = forward(next, nStart)
    } else {
      if (isUndefined(keyToIdx)) {
        keyToIdx = mapKeyToIdx(prev, prev.idx, pEnd.idx)
      }
      idxInPrev = keyToIdx[key(nStart)]
      if (isUndefined(idxInPrev)) {
        effect(DIFF_CREATE, null, nStart.item, nStart.idx)
      } else {
        effect(DIFF_MOVE, prev[idxInPrev], nStart.item, nStart.idx)
        delete keyToIdx[key(nStart)]
      }
      nStart = forward(next, nStart)
    }
  }

  if (pStart.idx > pEnd.idx) {
    for (; nStart.idx <= nEnd.idx; nStart = forward(next, nStart)) {
      effect(DIFF_CREATE, null, nStart.item, nEnd.idx)
    }
  } else if (nStart.idx > nEnd.idx) {
    for(; pStart.idx <= pEnd.idx; pStart = forward(prev, pStart)) {
      effect(DIFF_REMOVE, pStart.item)
    }
  }

}

function cursor (list, idx) {
  return {
    item: list[idx],
    idx: idx
  }
}

function forward (list, c) {
  c.item = list[++c.idx]
  return c
}

function back (list, c) {
  c.item = list[--c.idx]
  return c
}

function defaultEqual(prev, next) {
  return key(prev) === key(next)
}

function key(cursor) {
  return cursor.item.key || cursor.idx
}

function mapKeyToIdx(list, start, end) {
  let i
  let key
  let map = {}

  for (i = start; i <= end; ++i) {
    key = list[i].key;
    if (!isUndefined(key)) map[key] = i;
  }
  return map;
}

function isUndefined (val) {
  return 'undefined' === typeof(val)
}

diff.CREATE = DIFF_CREATE
diff.UPDATE = DIFF_UPDATE
diff.MOVE = DIFF_MOVE
diff.REMOVE = DIFF_REMOVE

/**
 * Exports
 */

export default diff
