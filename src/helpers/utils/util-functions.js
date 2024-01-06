export const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
export function rgbToHsv(r, g, b) {
  ;(r /= 255), (g /= 255), (b /= 255)

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    v = max

  let d = max - min
  s = max == 0 ? 0 : d / max

  if (max == min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, v]
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export function hsvToRgb(h, s, v) {
  let r, g, b

  let i = Math.floor(h * 6)
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      ;(r = v), (g = t), (b = p)
      break
    case 1:
      ;(r = q), (g = v), (b = p)
      break
    case 2:
      ;(r = p), (g = v), (b = t)
      break
    case 3:
      ;(r = p), (g = q), (b = v)
      break
    case 4:
      ;(r = t), (g = p), (b = v)
      break
    case 5:
      ;(r = v), (g = p), (b = q)
      break
  }

  return [r * 255, g * 255, b * 255]
}

/**
 * Common easing functions.
 * https://gist.github.com/gre/1650294
 */
export const easingFunctions = {
  linear(t) {
    return t
  },
  easeInQuad(t) {
    return t * t
  },
  easeOutQuad(t) {
    return t * (2 - t)
  },
  easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  easeInCubic(t) {
    return t * t * t
  },
  easeOutCubic(t) {
    return --t * t * t + 1
  },
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
  easeInQuart(t) {
    return t * t * t * t
  },
  easeOutQuart(t) {
    return 1 - --t * t * t * t
  },
  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t
  },
  easeInQuint(t) {
    return t * t * t * t * t
  },
  easeOutQuint(t) {
    return 1 + --t * t * t * t * t
  },
  easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  },
}

/**
 * @function ease – Apply an easing function to a progress value [0 - 1].
 * @param { string } method – Selected easing function.
 * @param { integer } smoothing – Smoothing factor. Increase value to reduce the effect of the easing function.
 */
export function ease(t, method = 'easeOutQuart') {
  if (!easingFunctions[method]) throw new Error(`Unknown easing function "${method}"`)
  const progress = Math.min(Math.max(0, t), 1)
  return easingFunctions[method](progress)
}

export function interpolate(a, b) {
  return function (t) {
    return a * (1 - t) + b * t
  }
}

export function isPrimitive(val) {
  const type = typeof val
  return val == null || (type != 'object' && type != 'function')
}

export function Observe(target) {
  const _target = Object.seal({ ...target })

  /** Store observers for the entire object. */
  const _observers = {
    __all__: [],
  }

  /** Store observers for individual keys. */
  for (let key in _target) {
    _observers[key] = []
  }

  /** Hijack the `set` method for sweet interception action. */
  const traps = {
    set(obj, key, val) {
      let old

      if (isPrimitive(obj[key])) {
        old = obj[key]
      } else if (Array.isArray(obj[key])) {
        old = [...obj[key]]
      } else {
        old = { ...obj[key] }
      }

      obj[key] = val

      if (_observers[key]) {
        _observers[key].map((observer) => observer(val, old))
        _observers.__all__.map((observer) => observer(val, old))
      }

      return true
    },
  }

  return new Proxy(
    {
      ..._target,
      watch(key, callback) {
        /** Watch a single key. */
        if (typeof key === 'string') {
          if (key in _observers) {
            _observers[key].push(callback)
          }
        }

        /** Watch entire object. */
        if (typeof key === 'function') {
          _observers.__all__.push(key)
        }
      },
    },
    {
      set: traps.set,
    },
  )
}
