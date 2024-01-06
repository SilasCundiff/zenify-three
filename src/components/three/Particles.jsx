'use client'
import * as THREE from 'three'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { button, useControls } from 'leva'
import { lerp } from '@/helpers/utils/util-functions'

import { useSpotifyWebSDK } from '@/helpers/hooks'
import spotifyApi from '@/helpers/spotify'
import SpotifySync from '@/helpers/managers/SpotifySync'

const ParticleMaterial = shaderMaterial(
  {
    time: 0,
    offsetSize: 2,
    size: 2.5,
    frequency: 2,
    amplitude: 1.4,
    offsetGain: 0.5,
    maxDistance: 1.6,
    startColor: new THREE.Color('hsl(320, 100%, 85%)'), // red
    endColor: new THREE.Color('hsl(240, 100%, 80%)'), // blue
  },
  vertex,
  fragment,
)

// mode: 0 = minor, 1 = major
// this color map is based on the concept of Chromesthesia or sound-to-color synesthesia
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

extend({ ParticleMaterial })

export default function Particles() {
  // const { analysis, features } = useSpotifySongAnalysis()
  // const accessToken = spotifyApi.getAccessToken()
  const { playerState } = useSpotifyWebSDK()
  const controls = useThree((state) => state.controls)

  // console.dir({ analysis, features }, { depth: null, colors: true })
  const controlsRef = useRef()
  const particleRef = useRef()
  const pointsRef = useRef()
  const spotifySync = useRef()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (spotifySync?.current.time && spotifySync && playerState?.paused === false) {
      const features = spotifySync.current?.state.trackFeatures
      const { energy, mode, key, acousticness, tempo, valence } = features

      const segment = spotifySync.current?.getInterval('segment')
      const timbres = segment.timbre
      const loudnessMax = segment.loudness_max

      const avgLoudness = timbres[0]
      const brightness = timbres[1]
      const attack = timbres[3]

      // animate time uniform
      pointsRef.current.material.uniforms.time.value =
        (spotifySync.current?.time / 1000) *
        spotifySync?.current.volume *
        features.energy *
        particleControls.OffsetVolume

      console.log({ segment, energy, mode, key, acousticness, tempo, valence })

      let targetAmplitude = (60 - Math.abs(loudnessMax)) * 0.01 + particleControls.offsetAmplitude
      let targetFrequency = Math.floor(100 - Math.abs(attack)) / 100

      const lerpedAmplitude = lerp(pointsRef.current.material.uniforms.amplitude.value, targetAmplitude, 0.05)
      const lerpedFrequency = lerp(pointsRef.current.material.uniforms.frequency.value, targetFrequency, 0.05)

      pointsRef.current.material.uniforms.amplitude.value = lerpedAmplitude
      pointsRef.current.material.uniforms.frequency.value = lerpedFrequency

      // pitches in order: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
      // pitches at index: 0, 1, 2, 3, 4, 5, 6, 7, 8,  9, 10, 11
      // pitches are on a scale from 0 to 1, with 1 being the most intense
      // each pitch is associated with a note, which is associated with a color, the color map is above outside of the component
      const pitches = segment.pitches

      // Find the index of the most intense pitch
      const maxPitchIndex = pitches.reduce((iMax, x, i, arr) => (x > arr[iMax] ? i : iMax), 0)

      // Map the index to a note
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const note = notes[maxPitchIndex]

      // Find the color for the note and mode from the colorMap
      const colorEntry = colorMap.find((entry) => entry.note === note && entry.mode === mode)
      const color = colorEntry ? colorEntry.color : '#FFFFFF' // default to white if no color found

      const lightness =
        100 - Math.max(Math.min(Math.floor(avgLoudness * 1.2 - particleControls.lightnessOffset), 30), 0)

      let startColorTarget = new THREE.Color(color)
      let endColorTarget = new THREE.Color(color)

      // Adjust the lightness and saturation of the color based on the loudness
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

      // Animate the start color
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

      // Animate the end color
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
    } else {
      pointsRef.current.material.uniforms.time.value += delta
      const startColor = new THREE.Color('hsl(320, 50%, 85%)')
      const endColor = new THREE.Color('hsl(240, 50%, 80%)')
      pointsRef.current.material.uniforms.startColor.value = startColor
      pointsRef.current.material.uniforms.endColor.value = endColor
      // pointsRef.current.material.uniforms.size.value = 4.5
      pointsRef.current.material.uniforms.amplitude.value = 1.2
    }
  })

  const particleControls = useControls(
    'Particles',
    {
      offsetSize: { value: 2, min: 0, max: 10, step: 0.1 },
      size: { value: 2.5, min: 0, max: 10, step: 0.1 },
      // frequency: { value: 2, min: 0, max: 10, step: 0.1 },
      offsetAmplitude: { value: 0.7, min: 0, max: 10, step: 0.1 },
      offsetGain: { value: 0.6, min: 0, max: 10, step: 0.1 },
      maxDistance: { value: 2.4, min: 0, max: 10, step: 0.1 },
      // startColor: new THREE.Color('hsl(320, 100%, 85%)'), // red
      // endColor: new THREE.Color('hsl(240, 100%, 80%)'), // blue
      count: { value: 500, min: 0, max: 2500, step: 10 },
      lightnessOffset: { value: 45, min: 0, max: 100, step: 5 },
      offsetHue: { value: 160, min: 0, max: 360, step: 10 },
      OffsetVolume: { value: 0.5, min: 0.01, max: 1, step: 0.01 },
      geometryShape: {
        options: [
          'TorusGeometry',
          'TorusKnotGeometry',
          'BoxGeometry',
          'SphereGeometry',
          'CylinderGeometry',
          'DancingStrings',
          'CircleGeometry',
        ],
      },
      // Reset: button(() => {
      //   pointsRef.current.material.uniforms.startColor.value = new THREE.Color('hsl(320, 100%, 85%)')
      //   pointsRef.current.material.uniforms.endColor.value = new THREE.Color('hsl(240, 100%, 80%)')
      //   pointsRef.current.material.uniforms.offsetSize.value = 2
      //   pointsRef.current.material.uniforms.size.value = 2.5
      //   pointsRef.current.material.uniforms.frequency.value = 2
      //   pointsRef.current.material.uniforms.amplitude.value = 1.2
      //   pointsRef.current.material.uniforms.offsetGain.value = 0.6
      //   pointsRef.current.material.uniforms.maxDistance.value = 1.6
      // }),
      // 'Reset Camera': button(() => {
      //   if (controls) controlsRef.current.reset()
      // }),
    },
    { collapsed: true },
  )

  useEffect(() => {
    if (pointsRef.current.material) {
      pointsRef.current.material.uniforms.startColor.value = new THREE.Color(particleControls.startColor)
      pointsRef.current.material.uniforms.endColor.value = new THREE.Color(particleControls.endColor)
      pointsRef.current.material.uniforms.offsetSize.value = particleControls.uOffsetSize
      pointsRef.current.material.uniforms.size.value = particleControls.size
      // pointsRef.current.material.uniforms.frequency.value = particleControls.frequency
      // pointsRef.current.material.uniforms.amplitude.value = particleControls.amplitude
      pointsRef.current.material.uniforms.offsetGain.value = particleControls.offsetGain
      pointsRef.current.material.uniforms.maxDistance.value = particleControls.maxDistance
    }
  }, [particleControls])

  // useEffect(() => {
  //   // set controls to ref
  //   controlsRef.current = controls
  // }, [controls])

  useEffect(() => {
    spotifySync.current = new SpotifySync({ spotifyApi, canvasRef: pointsRef.current })

    return () => {
      spotifySync.current = null
    }
  }, [])

  return (
    <>
      <Center>
        <OrbitControls makeDefault />
        <points ref={pointsRef}>
          {
            // return the selected geometry
            (() => {
              switch (particleControls.geometryShape) {
                case 'BoxGeometry':
                  return (
                    <boxGeometry
                      args={[
                        3,
                        3,
                        3,
                        particleControls.count / 10,
                        particleControls.count / 10,
                        particleControls.count / 10,
                      ]}
                    />
                  )
                case 'SphereGeometry':
                  return <sphereGeometry args={[2, particleControls.count, particleControls.count]} />
                case 'CylinderGeometry':
                  return <cylinderGeometry args={[2, 2, 8, 32, particleControls.count]} />
                case 'DancingStrings':
                  return <cylinderGeometry args={[2, 2, 2, 32, particleControls.count]} />
                case 'CircleGeometry':
                  return <circleGeometry args={[2, particleControls.count]} />
                case 'TorusGeometry':
                  return <torusGeometry args={[2, 1, 32, particleControls.count]} />
                case 'TorusKnotGeometry':
                  return <torusKnotGeometry args={[10, 3, particleControls.count, 16]} />
                default:
                  return <torusGeometry args={[2, 1, 32, particleControls.count]} />
              }
            })()
          }

          <particleMaterial ref={particleRef} side={THREE.DoubleSide} transparent />
        </points>
      </Center>
    </>
  )
}
