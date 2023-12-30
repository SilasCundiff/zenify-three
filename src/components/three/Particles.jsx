'use client'
import * as THREE from 'three'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'
import gsap from 'gsap'

import { useSpotifySongAnalysis, useSpotifyWebSDK } from '@/helpers/hooks'
import spotifyApi from '@/helpers/spotify'
import SpotifySync, { Sync } from '@/helpers/managers/SpotifySync'

const ParticleMaterial = shaderMaterial(
  {
    time: 0,
    offsetSize: 2,
    size: 2.5,
    frequency: 2,
    amplitude: 1,
    offsetGain: 0,
    maxDistance: 1.8,
    startColor: new THREE.Color('hsl(0, 100%, 50%)'), // red
    endColor: new THREE.Color('hsl(240, 100%, 50%)'), // blue
  },
  vertex,
  fragment,
)

extend({ ParticleMaterial })

export default function Particles() {
  // const { analysis, features } = useSpotifySongAnalysis()
  // const accessToken = spotifyApi.getAccessToken()
  const { playerState } = useSpotifyWebSDK()

  // console.dir({ analysis, features }, { depth: null, colors: true })

  const particleRef = useRef()
  const pointsRef = useRef()
  const spotifySync = useRef()
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (spotifySync?.current.time && spotifySync && playerState?.paused === false) {
      pointsRef.current.material.uniforms.time.value =
        (spotifySync.current?.time / 1000) * spotifySync?.current.volume * 0.5

      const timbreAvg = spotifySync.current?.getInterval('segment').timbre.reduce((a, b) => a + b, 0) / 12

      const pitchAvg =
        spotifySync.current?.getInterval('segment').pitches.reduce((a, b) => a + b, 0) /
        spotifySync.current?.getInterval('segment').pitches.length

      const minPitch = 0
      const maxPitch = 1

      const normalizedPitch = (pitchAvg - minPitch) / (maxPitch - minPitch)
      const newFrequency = normalizedPitch

      const minLoudness = -20 // replace with the minimum possible value of loudness_max
      const maxLoudness = 0 // replace with the maximum possible value of loudness_max

      const normalizedLoudness =
        (spotifySync.current?.getInterval('segment').loudness_max - minLoudness) / (maxLoudness - minLoudness) // normalize to 0-1
      const reversedFrequency = 1 - normalizedLoudness // reverse so that 0 becomes 1 and 1 becomes 0
      const defaultSize = 2.5
      const newSize = (defaultSize / reversedFrequency) * 0.05
      const clampedSize = Math.min(Math.max(newSize, 1.5), 5)

      // pointsRef.current.material.uniforms.size.value = clampedSize

      const minTimbre = 0
      const maxTimbre = 1

      const normalizedTimbre = (timbreAvg - minTimbre) / (maxTimbre - minTimbre)
      const hue = normalizedTimbre * 360
      const startColor = new THREE.Color('hsl(' + hue + 20 + ', 100%, 50%)')
      const endColor = new THREE.Color('hsl(' + (hue + 60) + ', 100%, 50%)')

      // Animate the start color
      gsap.to(pointsRef.current.material.uniforms.startColor.value, {
        r: startColor.r,
        g: startColor.g,
        b: startColor.b,
        duration: 1, // Adjust the duration to make the transition slower or faster
        onUpdate: () => {
          pointsRef.current.material.uniforms.startColor.needsUpdate = true
        },
      })

      // Animate the end color
      gsap.to(pointsRef.current.material.uniforms.endColor.value, {
        r: endColor.r,
        g: endColor.g,
        b: endColor.b,
        duration: 1, // Adjust the duration to make the transition slower or faster
        onUpdate: () => {
          pointsRef.current.material.uniforms.endColor.needsUpdate = true
        },
      })
    } else {
      pointsRef.current.material.uniforms.time.value += delta
      const startColor = new THREE.Color('hsl(0, 100%, 50%)')
      const endColor = new THREE.Color('hsl(240, 100%, 50%)')
      pointsRef.current.material.uniforms.startColor.value = startColor
      pointsRef.current.material.uniforms.endColor.value = endColor
      pointsRef.current.material.uniforms.size.value = 2.5
    }
  })

  const particleControls = useControls(
    'Particles',
    {
      offsetSize: { value: 2, min: 0, max: 10, step: 0.1 },
      // size: { value: 4.5, min: 0, max: 10, step: 0.1 },
      // frequency: { value: 2, min: 0, max: 10, step: 0.1 },
      amplitude: { value: 1.1, min: 0, max: 10, step: 0.1 },
      offsetGain: { value: 0.0, min: 0, max: 10, step: 0.1 },
      maxDistance: { value: 2, min: 0, max: 10, step: 0.1 },
      // startColor: new THREE.Color('hsl(0, 100%, 50%)'), // red
      // endColor: new THREE.Color('hsl(240, 100%, 50%)'), // blue
      count: { value: 200, min: 0, max: 500, step: 10 },
      geometryShape: {
        options: ['TorusGeometry', 'BoxGeometry', 'SphereGeometry', 'CylinderGeometry'],
      },
    },
    { collapsed: true },
  )

  useEffect(() => {
    if (pointsRef.current.material) {
      pointsRef.current.material.uniforms.startColor.value = new THREE.Color(particleControls.startColor)
      pointsRef.current.material.uniforms.endColor.value = new THREE.Color(particleControls.endColor)
      pointsRef.current.material.uniforms.offsetSize.value = particleControls.uOffsetSize
      // pointsRef.current.material.uniforms.size.value = particleControls.size
      // pointsRef.current.material.uniforms.frequency.value = particleControls.frequency
      pointsRef.current.material.uniforms.amplitude.value = particleControls.amplitude
      pointsRef.current.material.uniforms.offsetGain.value = particleControls.offsetGain
      pointsRef.current.material.uniforms.maxDistance.value = particleControls.maxDistance
    }
  }, [particleControls])

  useEffect(() => {
    spotifySync.current = new SpotifySync({ spotifyApi, canvasRef: pointsRef.current })

    spotifySync.current?.on('beat', (beat) => {
      if (pointsRef.current && spotifySync.current.time) {
        const pitchAvg =
          spotifySync.current?.getInterval('segment').pitches.reduce((a, b) => a + b, 0) /
          spotifySync.current?.getInterval('segment').pitches.length
        if (Math.random() < 0.5) {
          gsap.to(pointsRef.current.rotation, {
            duration: beat.duration, // Either a longer or BPM-synced duration
            // y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * pitchAvg * 10,
            ease: 'elastic.out(0.2)',
          })
        }
        if (Math.random() > 0.5) {
          gsap.to(pointsRef.current.rotation, {
            duration: beat.duration, // Either a longer or BPM-synced duration
            // y: Math.random() * Math.PI * 5,
            z: -Math.random() * Math.PI * pitchAvg * 10,
            ease: 'elastic.out(0.2)',
          })
        }
      }
    })

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
                        2,
                        2,
                        2,
                        particleControls.count / 10,
                        particleControls.count / 10,
                        particleControls.count / 10,
                      ]}
                    />
                  )
                case 'SphereGeometry':
                  return <sphereGeometry args={[2, particleControls.count, particleControls.count]} />
                case 'CylinderGeometry':
                  return <cylinderGeometry args={[2, 2, 2, particleControls.count]} />
                case 'TorusGeometry':
                  return <torusGeometry args={[2, 1, 32, particleControls.count]} />
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
