# Zenify-three

> Online Spotify particle visualizer using ThreeJS, Nextjs, Tailwind, TypeScript, and SpotifyAPI

## Introduction

The first solo app I ever created in React was a little Spotify audio visualizer I called Zenify. It was buggy, and had a slight de-sync, but I was proud of it.

Now, almost exactly 3 years later, I've rebuilt it from the ground up to be my dream audio visualizer!

Made with NextJs, ThreeJs, and the Spotify API, I present Zenify-Three!

zenify.silascundiff.com

Full Spotify playback, with real-time audio responsive particles.

The behavior of the particles is something I spent a lot of time refining, everything from the frequency to the colors has been significantly tied to different aspects of the audio analysis manually.

Most traditional audio visualizers use the Web Audio API to make use of real-time song audio for visualization. You cannot do that with the Spotify API, as it prevents interfacing with the Web Audio API to prevent piracy.

So instead, this uses the audio analysis JSON that the Spotify API provides and syncs the data with the song in real-time to manipulate the particles.

I've used the volume of the song to control the general animation/movement, the "attack" controls the frequency, "loudness" the amplitude, and my personal favorite: the colors are dictated by the pitch or note of the section, and follow the concept of Chromesthesia (seeing sound as colors)!

And I still have a lot more plans for it, like building out more of the Spotify functionality, and providing more visualization features.

## Setup

> This project has been fully ported from Next 12 -> 14 and updated to use ThreeJS instead of TSParticles

To run locally you will need a Spotify Premium account with a `public key` and `public client id` set up in your [developer dashboard](https://developer.spotify.com/), additionally, you will want to make sure you [assign a redirect url](https://developer.spotify.com/documentation/web-api/concepts/apps) so Spotify knows to redirect back to the correct site. For a locally hosted site, this can just be `localhost:3000`

Make sure you allow the app defined in your dashboard to use _both_ the Web Api _and_ the Web Playback SDK!

In your `.env.local` - Environment variables:

```
NEXTAUTH_URL={full site url} // http://localhost:3000
NEXT_PUBLIC_CLIENT_SECRET={public key from spotify dashbaord}
NEXT_PUBLIC_CLIENT_ID={public client id from spotify dashboard}
JWT_SECRET={hashed value to use as a jwt secret} // I personally use openSSL to gen this
```

Credits for some of the code, courses, and inspirations:
[threejs-journey.com](threejs-journey.com)
[tympanus.net](https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/)
[spotify-viz](https://github.com/zachwinter/spotify-viz)

## The colors are significant

> [Chromesthesia](https://en.wikipedia.org/wiki/Chromesthesia#:~:text=Chromesthesia%20or%20sound-to-color,associations%2Fperceptions%20in%20daily%20life.) is a type of [synesthesia](https://en.wikipedia.org/wiki/Synesthesia 'Synesthesia') in which sound involuntarily evokes an experience of color, shape, and movement.

While I don't believe I have Chromesthesia, I have always associated music with colors, so I wanted Zenify to express that in some meaningful way.

So I decided to implement a way for the particles to change their color to match is perceived to be their associated note.

### How Chromesthesia is implemented

First, I needed to create a color map, one that assigns notes to different colors, this map also takes into consideration the major and minor scales, so a C Major and a C Minor express themselves in a different color (Azure and Gray respectively).

I found these colors referenced in several [articles online](https://www.chrisatthepiano.com/post/a-mapping-between-musical-notes-and-colours) as being a relatively common occurrence in individuals that experience Chromesthesia:

```js
// the association of a color with a musical note
// references:
// https://en.wikipedia.org/wiki/Chromesthesia
// https://www.chrisatthepiano.com/post/a-mapping-between-musical-notes-and-colours
const colorMap = [
  { mode: 1, note: 'C', color: '#007FFF' }, // C Major - azure
  { mode: 0, note: 'A', color: '#40E0D0' }, // A Minor - turquoise
  { mode: 1, note: 'G', color: '#008000' }, // G Major - green
  { mode: 0, note: 'E', color: '#013220' }, // E Minor - dark, pine green
  { mode: 1, note: 'D', color: '#FFFF00' }, // D Major - yellow
  { mode: 0, note: 'B', color: '#9B870C' }, // B Minor - dark yellow
  { mode: 1, note: 'A', color: '#FFA500' }, // A Major - orange
  { mode: 0, note: 'F#', color: '#800080' }, // F# Minor - purple
  { mode: 1, note: 'E', color: '#FFA500' }, // E Major - orange
  { mode: 0, note: 'C#', color: '#FF8C00' }, // C# Minor - dark orange
  { mode: 1, note: 'B', color: '#800080' }, // B Major - purple
  { mode: 0, note: 'G#', color: '#654321' }, // G# Minor - dark brown
  { mode: 1, note: 'F#', color: '#FFC0CB' }, // Gb Major - pink
  { mode: 0, note: 'D#', color: '#D2B48C' }, // D# Minor - light brown
  { mode: 1, note: 'C#', color: '#E34234' }, // Db Major - vermilion red
  { mode: 0, note: 'A#', color: '#000000' }, // Bb Minor - black
  { mode: 1, note: 'G#', color: '#DC143C' }, // Ab Major - crimson red
  { mode: 0, note: 'F', color: '#800000' }, // F Minor - maroon
  { mode: 1, note: 'D#', color: '#120A8F' }, // Eb Major - ultramarine blue
  { mode: 0, note: 'C', color: '#808080' }, // C Minor - gray
  { mode: 1, note: 'A#', color: '#008000' }, // Bb Major - green
  { mode: 0, note: 'G', color: '#ADD8E6' }, // G Minor - light blue
  { mode: 1, note: 'F', color: '#FF2400' }, // F Major - scarlet red
  { mode: 0, note: 'D', color: '#E0B0FF' }, // D Minor - mauve
]
```

Then I needed to grab the pitch of the current segment:

```js
// pitches in order: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
// pitches at index: 0, 1, 2, 3, 4, 5, 6, 7, 8,  9, 10, 11
// pitches are on a scale from 0 to 1, with 1 being the most intense
const pitches = segment.pitches
console.log(pitches)

// output
// [0.625, 0.866, 0.843, 0.842, 0.989, 1, 0.714, 0.718, 0.57, 0.575, 0.118, 0.151]

// or a more readable example
/** [
    0.214, // C = 0
    0.076, // C# = 1
    0.143, // D = 2
    0.122, // D# = 3
    0.194, // E = 4
    1,     // F = 5
    0.143, // F# = 6
    0.149, // G = 7
    0.165, // G# = 8
    0.752, // A = 9
    0.204, // A# = 10
    0.094  // B = 11
] */
```

The mode of the song is found in the audio features retrieved from the API:

```js
const features = spotifySync.current?.state.trackFeatures
console.log(features)

/** the output is trimmed down, the features contain a more data not used in this section
{
	"mode": 1, // The "mode" of the sound, Major/Minor
} */
```

### Putting it all together

Finally, I needed to assign the color using the mode of the song and the pitch and retrieving the matching entry from the color map:

```js
// Find the index of the most intense pitch
const maxPitchIndex = pitches.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0)

// Map the index to a note
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const note = notes[maxPitchIndex]

// Find the color for the note and mode from the colorMap
const colorEntry = colorMap.find((entry) => entry.note === note && entry.mode === mode)
const color = colorEntry ? colorEntry.color : '#FFFFFF' // default to white if no color found
```

How this value is then used to animate the color changes, note that all of these code blocks are being used within an useFrame() hook in react three fiber, so they are being continuously calculate and updated.

```js
let startColorTarget = new THREE.Color(color)
let endColorTarget = new THREE.Color(color)

// Adjust the lightness and saturation of the color based on the loudness calculated elsewhere
let hsl = startColorTarget.getHSL({ h: 0, s: 0, l: 0 })
hsl.l = Math.max(hsl.l, lightness / 100)
hsl.s = Math.min(hsl.s + 0.1, 1)
startColorTarget.setHSL(hsl.h, hsl.s, hsl.l)

hsl = endColorTarget.getHSL({ h: 0, s: 0, l: 0 })
// shift the hue by 120 degrees
hsl.h += 0.33
hsl.l = Math.max(hsl.l, lightness / 100)
hsl.s = Math.min(hsl.s + 0.1, 1)
endColorTarget.setHSL(hsl.h, hsl.s, hsl.l)

// Using Lerps to animate the colors
// start color
pointsRef.current.material.uniforms.startColor.value.r = lerp(
  pointsRef.current.material.uniforms.startColor.value.r,
  startColorTarget.r,
  0.05,
)
pointsRef.current.material.uniforms.startColor.value.g = lerp(
  pointsRef.current.material.uniforms.startColor.value.g,
  startColorTarget.g,
  0.05,
)
pointsRef.current.material.uniforms.startColor.value.b = lerp(
  pointsRef.current.material.uniforms.startColor.value.b,
  startColorTarget.b,
  0.05,
)

pointsRef.current.material.uniforms.startColor.needsUpdate = true

// end color
pointsRef.current.material.uniforms.endColor.value.r = lerp(
  pointsRef.current.material.uniforms.endColor.value.r,
  endColorTarget.r,
  0.05,
)
pointsRef.current.material.uniforms.endColor.value.g = lerp(
  pointsRef.current.material.uniforms.endColor.value.g,
  endColorTarget.g,
  0.05,
)
pointsRef.current.material.uniforms.endColor.value.b = lerp(
  pointsRef.current.material.uniforms.endColor.value.b,
  endColorTarget.b,
  0.05,
)

pointsRef.current.material.uniforms.endColor.needsUpdate = true
```

TODO:

- [x] Improve UI player elements
- [x] Add instructions for activating a spotify session if player takes too long to load
- [x] improve image loading placeholders
- [x] add buttons to hide the ui outside of the player, as well as independently hide just the center content
