import { scaleLog } from 'd3-scale'
import { min } from 'd3-array'
import { useTokenStore } from '../hooks'

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

function interpolate(a, b) {
  return function (t) {
    return a * (1 - t) + b * t
  }
}

function isPrimitive(val) {
  const type = typeof val
  return val == null || (type != 'object' && type != 'function')
}

function Observe(target) {
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

export default class SpotifySync {
  constructor({ canvasRef, spotifyApi, volumeSmoothing = 100, pingDelay = 2500 } = {}) {
    const accessToken = useTokenStore.getState().accessToken
    // const refreshToken = spotifyApi.getRefreshToken()

    this.canvas = canvasRef

    this.state = Observe({
      spotifyApi,
      apiConstants: {
        currentlyPlayingUri: 'https://api.spotify.com/v1/me/player',
        trackAnalysisUri: 'https://api.spotify.com/v1/audio-analysis/',
        trackFeaturesUri: 'https://api.spotify.com/v1/audio-features/',
        tokens: {
          accessToken,
          // refreshToken,
        },
        headers: {
          Authorization: 'Bearer ' + accessToken,
          Accept: 'application/json',
        },
        pingDelay,
      },
      intervalTypes: ['tatums', 'segments', 'beats', 'bars', 'sections'],
      activeIntervals: Observe({
        tatums: {},
        segments: {},
        beats: {},
        bars: {},
        sections: {},
      }),
      currentlyPlaying: {},
      trackAnalysis: {},
      trackFeatures: {},
      initialTrackProgress: 0,
      initialStart: 0,
      trackProgress: 0,
      active: false,
      initialized: false,
      volumeSmoothing,
      volume: 0,
      time: 0,
      queues: {
        volume: [],
        beat: [],
      },
    })

    // initialize hook and ping spotify
    this.initHooks()
    this.ping()
  }

  initHooks() {
    this.hooks = {
      tatum: () => {},
      segment: () => {},
      beat: () => {},
      bar: () => {},
      section: () => {},
    }

    this.state.activeIntervals.watch('tatums', (t) => this.hooks.tatum(t))
    this.state.activeIntervals.watch('segments', (s) => this.hooks.segment(s))
    this.state.activeIntervals.watch('beats', (b) => this.hooks.beat(b))
    this.state.activeIntervals.watch('bars', (b) => this.hooks.bar(b))
    this.state.activeIntervals.watch('sections', (s) => this.hooks.section(s))
  }

  ping() {
    setTimeout(() => {
      return this.getCurrentlyPlaying()
    }, this.state.apiConstants.pingDelay)
  }

  async getCurrentlyPlaying() {
    const { spotifyApi } = this.state
    const token = this.state.spotifyApi.getAccessToken()
    if (!token) {
      return this.ping()
    }
    const data = await spotifyApi.getMyCurrentPlaybackState()

    if (!data || !data?.body?.is_playing) {
      if (this.state.active) {
        this.state.active = false
      }
      return this.ping()
    }
    this.processResponse(data.body)
  }

  processResponse(data) {
    const songsInSync = JSON.stringify(data.item) === JSON.stringify(this.state.currentlyPlaying)

    if (this.state.initialized === false || !songsInSync || this.state.active === false) {
      return this.getTrackInfo(data)
    }

    this.ping()
  }

  async getTrackInfo({ item, progress_ms }) {
    // check token {}
    const token = this.state.spotifyApi.getAccessToken()
    if (!token || !item) {
      return this.ping()
    }

    const tick = window.performance.now()
    const analysisData = await this.state.spotifyApi.getAudioAnalysisForTrack(item.id)
    const featuresData = await this.state.spotifyApi.getAudioFeaturesForTrack(item.id)
    const analysis = analysisData.body
    const features = featuresData.body

    this.state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration = item.duration_ms / 1000 - type[type.length - 1].start
      type.forEach((interval) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
      })
    })

    const tock = window.performance.now() - tick

    this.state.currentlyPlaying = item
    this.state.trackAnalysis = analysis
    this.state.trackFeatures = features
    this.state.initialTrackProgress = progress_ms + tock
    this.state.trackProgress = progress_ms + tock
    this.state.initialStart = window.performance.now()

    if (this.state.initialized === false) {
      requestAnimationFrame(this.tick.bind(this))
      this.state.initialized = true
    }

    if (this.state.active === false) {
      this.state.active = true
    }

    this.ping()
  }

  setActiveIntervals() {
    const determineInterval = (type) => {
      const analysis = this.state.trackAnalysis[type]
      const progress = this.state.trackProgress
      for (let i = 0; i < analysis.length; i++) {
        if (i === analysis.length - 1) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start) return i
      }
    }

    this.state.intervalTypes.forEach((type) => {
      const index = determineInterval(type)
      if (!this.state.activeIntervals[type].start || index !== this.state.activeIntervals[type].index) {
        this.state.activeIntervals[type] = { ...this.state.trackAnalysis[type][index], index }
      }

      const { start, duration } = this.state.activeIntervals[type]
      const elapsed = this.state.trackProgress - start
      this.state.activeIntervals[type].elapsed = elapsed
      this.state.activeIntervals[type].progress = ease(elapsed / duration)
    })
  }

  /**
   * @method getVolume - Extract volume data from active segment.
   */
  getVolume() {
    const { loudness_max, loudness_start, loudness_max_time, duration, elapsed, start, index } =
      this.state.activeIntervals.segments

    if (!this.state.trackAnalysis.segments[index + 1]) return 0

    const next = this.state.trackAnalysis.segments[index + 1].loudness_start
    const current = start + elapsed

    if (elapsed < loudness_max_time) {
      const progress = Math.min(1, elapsed / loudness_max_time)
      return interpolate(loudness_start, loudness_max)(progress)
    } else {
      const _start = start + loudness_max_time
      const _elapsed = current - _start
      const _duration = duration - loudness_max_time
      const progress = Math.min(1, _elapsed / _duration)
      return interpolate(loudness_max, next)(progress)
    }
  }

  /**
   * @method watch - Convenience method for watching data store.
   * @param {string} key
   * @param {function} method
   */
  watch(key, method) {
    this.state.watch(key, method)
  }

  /**
   * @method on - Convenience method for applying interval hooks.
   * @param {string} - Interval type.
   * @param {function} - Event handler.
   */
  on(interval, method) {
    this.hooks[interval] = method
  }

  /**
   * @getter isActive - Returns if class is actively syncing with a playing track.
   */
  get isActive() {
    return this.state.active === true
  }

  get tatum() {
    return this.state.activeIntervals.tatums
  }

  get segment() {
    return this.state.activeIntervals.segments
  }

  get beat() {
    return this.state.activeIntervals.beats
  }

  get bar() {
    return this.state.activeIntervals.bars
  }

  get section() {
    return this.state.activeIntervals.sections
  }

  /**
   * @method getInterval - Convenience method for retreiving active interval of type.
   * @param {string} type - Interval type, e.g. `beat` or `tatum`
   */
  getInterval(type) {
    return this.state.activeIntervals[type + 's']
  }

  /**
   * @method tick - A single update tick from the Sync loop.
   * @param {DOMHighResTimeStamp} now
   */
  tick(now) {
    const time = now
    requestAnimationFrame(this.tick.bind(this))
    if (!this.state.active) {
      this.canvas.material.uniforms.time.value = time / 1000
      return
    }

    /** Set track progress and active intervals. */
    this.state.trackProgress = time - this.state.initialStart + this.state.initialTrackProgress
    this.setActiveIntervals()

    /** Get current volume. */
    const volume = this.getVolume()
    const queues = this.state.queues

    /** Add volume value to the beginning of the volume queue. */
    queues.volume.unshift(volume)

    /** If the queue is larger than 400 values, remove the last value. */
    if (queues.volume.length > 400) {
      queues.volume.pop()
    }

    /** Add volume value to the beginning of the beat queue. */
    queues.beat.unshift(volume)

    /** If the queue is larger than our defined smoothing value, remove the last value. */
    if (queues.beat.length > this.state.volumeSmoothing) {
      queues.beat.pop()
    }

    function average(arr) {
      return arr.reduce((a, b) => a + b) / arr.length
    }

    /** Scale volume (dB) to a linear range using the minimum and average values of the volume queue. */
    const sizeScale = scaleLog()
      .domain([min(queues.volume), average(queues.volume)])
      .range([0, 1])

    /** Average the beat queue, then pass it to our size scale. */
    const beat = average(queues.beat)
    this.volume = sizeScale(beat)

    this.time = time

    // this.canvas.material.uniforms.maxDistance.value =
  }
}
