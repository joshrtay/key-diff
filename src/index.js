/**
 * Imports
 */
import is from '@weo-edu/is'

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

function diff (prev, next, effect) {
  let pStart = cursor(prev, 0)
  let pEnd = cursor(prev, prev.length - 1)

  let nStart = cursor(next, 0)
  let nEnd = cursor(next, next.length - 1)

  let keyToIdx, idxInPrev, before;

  while (pStart.idx <= pEnd.idx && nStart.idx <= nEnd.idx) {
    if (is.undefined(pStart.item)) {
      pStart = forward(prev, pStart)
    } else if (is.undefined(pEnd.item)){
      pEnd = back(prev, pEnd)
    } else if (equal(pStart, nStart)){
      effect(change(DIFF_UPDATE, pStart, nStart))
      pStart = forward(prev, pStart)
      nStart = forward(next, nStart)
    } else if (equal(pEnd, nEnd)) {
      effect(change(DIFF_UPDATE, pEnd, nEnd))
      pEnd = back(prev, pEnd)
      nEnd = back(next, nEnd)
    } else if (equal(pStart, nEnd)) {
      effect(change(DIFF_MOVE, pStart, nEnd, pEnd.idx))
      pStart = forward(prev, pStart)
      nEnd = back(next, nEnd)
    } else if (equal(pEnd, nStart)) {
      effect(change(DIFF_MOVE, pEnd, nStart, pStart.idx))
      pEnd = back(prev, pEnd)
      nStart = forward(next, nStart)
    } else {
      if (is.undefined(keyToIdx)) {
        keyToIdx = mapKeyToIdx(prev, prev.idx, pEnd.idx)
      }
      idxInPrev = keyToIdx[key(nStart)]
      if (is.undefined(idxInPrev)) {
        effect(change(DIFF_CREATE, null, nStart, pStart.idx))
      } else {
        effect(change(DIFF_MOVE, prev[idxInPrev], nStart, pStart.idx))
        delete keyToIdx[key(nStart)]
      }
      nStart = forward(next, nStart)
    }
  }

  if (pStart.idx > pEnd.idx) {
    for (; nStart.idx <= nEnd.idx; nStart = forward(next, nStart)) {
        effect(change(DIFF_CREATE, null, nStart, nEnd.idx))
    }
  } else if (nStart.idx > nEnd.idx) {
    for(; pStart.idx <= pEnd.idx; pStart = forward(prev, pStart)) {
      effect(change(DIFF_REMOVE, pStart))
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
  return cursor(list, c.idx + 1)
}

function back (list, c) {
  return cursor(list, c.idx - 1)
}

function change (type, prev, next, pos) {
  let action = {type, prev, next}
  if (!is.undefined(pos)) {
    action.pos = pos
  }
  return action
}

function equal(prev, next) {
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
    if (!is.undefined(key)) map[key] = i;
  }
  return map;
}

diff.CREATE = DIFF_CREATE
diff.UPDATE = DIFF_UPDATE
diff.MOVE = DIFF_MOVE
diff.REMOVE = DIFF_REMOVE

/**
 * Exports
 */

export default diff
