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

function diff (prev, next, effect, key) {
  let pStart = cursor(prev, 0)
  let pEnd = cursor(prev, prev.length - 1)

  let nStart = cursor(next, 0)
  let nEnd = cursor(next, next.length - 1)

  let keyToIdx, idxInPrev, before;

  key = key || defaultKey

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
      effect(DIFF_MOVE, pStart.item, nEnd.item, nEnd.idx)
      pStart = forward(prev, pStart)
      nEnd = back(next, nEnd)
    } else if (equal(pEnd, nStart)) {
      effect(DIFF_MOVE, pEnd.item, nStart.item, nStart.idx)
      pEnd = back(prev, pEnd)
      nStart = forward(next, nStart)
    } else {
      break
    }
  }

  keyToIdx = mapKeyToIdx(prev, pStart.idx, pEnd.idx)
  for (; nStart.idx <= nEnd.idx; nStart = forward(next, nStart)) {
    idxInPrev = keyToIdx[key(nStart.item)]
    if (isUndefined(idxInPrev)) {
      effect(DIFF_CREATE, null, nStart.item, nStart.idx)
    } else {
      effect(DIFF_MOVE, prev[idxInPrev], nStart.item, nStart.idx)
      delete keyToIdx[key(nStart.item)]
    }
  }

  for (let key in keyToIdx) {
    idxInPrev = keyToIdx[key]
    effect(DIFF_REMOVE, prev[idxInPrev])
  }

  function equal(prev, next) {
    return key(prev.item, prev.idx) === key(next.item, next.idx)
  }

  function mapKeyToIdx(list, start, end) {
    let i
    let map = {}

    for (i = start; i <= end; ++i) {
      map[key(list[i])] = i;
    }
    return map;
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



function defaultKey(item, idx) {
  return item.key || idx
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
