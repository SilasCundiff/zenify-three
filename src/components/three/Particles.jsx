'use client'
import * as THREE from 'three'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { use, useEffect, useRef } from 'react'
import { button, useControls } from 'leva'
import gsap from 'gsap'

import { useSpotifySongAnalysis, useSpotifyWebSDK } from '@/helpers/hooks'
import spotifyApi from '@/helpers/spotify'
import SpotifySync, { Sync } from '@/helpers/managers/SpotifySync'
const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t
}

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
      pointsRef.current.material.uniforms.time.value =
        (spotifySync.current?.time / 1000) * spotifySync?.current.volume * particleControls.OffsetVolume
      const segment = spotifySync.current?.getInterval('segment')

      const timbres = segment.timbre
      const pitches = segment.pitches
      const loudnessMax = segment.loudness_max
      const loudnessMaxTime = segment.loudness_max_time
      const loudnessStart = segment.loudness_start

      // console.log({ loudnessMax, loudnessMaxTime, loudnessStart })

      const avgLoudness = timbres[0]
      const brightness = timbres[1]
      const attack = timbres[3]

      let targetAmplitude = (60 - Math.abs(loudnessMax)) * 0.01 + particleControls.offsetAmplitude
      let targetFrequency = Math.floor(100 - Math.abs(attack)) / 100

      const lerpedAmplitude = lerp(pointsRef.current.material.uniforms.amplitude.value, targetAmplitude, 0.05)
      const lerpedFrequency = lerp(pointsRef.current.material.uniforms.frequency.value, targetFrequency, 0.05)

      pointsRef.current.material.uniforms.amplitude.value = lerpedAmplitude
      pointsRef.current.material.uniforms.frequency.value = lerpedFrequency

      // const minTimbre = 0
      // const maxTimbre = 1

      // const normalizedTimbre = Math.abs((timbreAvg - minTimbre) / (maxTimbre - minTimbre))
      // const hue = normalizedTimbre * 36
      const hue1 = Math.abs(brightness) * Math.PI + particleControls.offsetHue * 2
      const hue2 = Math.abs(brightness) + Math.abs(attack) + Math.PI + particleControls.offsetHue
      const lightness =
        100 - Math.max(Math.min(Math.floor(avgLoudness * 1.2 - particleControls.lightnessOffset), 30), 0)
      // console.log({ hue1, hue2, lightness })

      // const startColor = new THREE.Color('hsl(' + hue1 + `, 100%, ${Math.floor(lightness)}%)`)
      const startColor = new THREE.Color('hsl(' + hue1 + `, 100%, ${Math.floor(lightness)}%)`)
      const endColor = new THREE.Color('hsl(' + hue2 + `, 100%, ${Math.floor(lightness)}%)`)

      // console.log({ startColor, endColor, hue1, hue2 })

      // const startColor = new THREE.Color('hsl(' + hue1 + `, 100%, 50%})`)
      // const endColor = new THREE.Color('hsl(' + hue2 + `, 100%, 50%)`)

      // Animate the start color
      gsap.to(pointsRef.current.material.uniforms.startColor.value, {
        r: startColor.r,
        g: startColor.g,
        b: startColor.b,
        duration: 0.5, // Adjust the duration to make the transition slower or faster
        onUpdate: () => {
          pointsRef.current.material.uniforms.startColor.needsUpdate = true
        },
      })

      // Animate the end color
      gsap.to(pointsRef.current.material.uniforms.endColor.value, {
        r: endColor.r,
        g: endColor.g,
        b: endColor.b,
        duration: 0.5, // Adjust the duration to make the transition slower or faster
        onUpdate: () => {
          pointsRef.current.material.uniforms.endColor.needsUpdate = true
        },
      })
    } else {
      pointsRef.current.material.uniforms.time.value += delta
      const startColor = new THREE.Color('hsl(320, 100%, 85%)')
      const endColor = new THREE.Color('hsl(240, 100%, 80%)')
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

    // spotifySync.current?.on('beat', (beat) => {
    //   if (pointsRef.current && spotifySync.current.time) {
    //     const pitchAvg =
    //       spotifySync.current?.getInterval('segment').pitches.reduce((a, b) => a + b, 0) /
    //       spotifySync.current?.getInterval('segment').pitches.length
    //     if (Math.random() < 0.5) {
    //       gsap.to(pointsRef.current.rotation, {
    //         duration: beat.duration, // Either a longer or BPM-synced duration
    //         // y: Math.random() * Math.PI * 2,
    //         z: Math.random() * Math.PI * pitchAvg * 20,
    //         ease: 'elastic.out(0.2)',
    //       })
    //     }
    //     if (Math.random() > 0.5) {
    //       gsap.to(pointsRef.current.rotation, {
    //         duration: beat.duration, // Either a longer or BPM-synced duration
    //         // y: Math.random() * Math.PI * 5,
    //         z: -Math.random() * Math.PI * pitchAvg * 20,
    //         ease: 'elastic.out(0.2)',
    //       })
    //     }
    //   }
    // })

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
