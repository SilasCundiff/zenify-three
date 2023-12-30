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

  useFrame(({ clock }) => {
    if (spotifySync?.current.time && spotifySync && playerState?.paused === false) {
      pointsRef.current.material.uniforms.time.value =
        (spotifySync.current?.time / 1000) * spotifySync?.current.volume * 0.5

      // average pitch value * time
      const pitchAvg =
        spotifySync.current?.getInterval('segment').pitches.reduce((a, b) => a + b, 0) /
        spotifySync.current?.getInterval('segment').pitches.length
      const minPitch = 0 // replace with the minimum possible value of pitchAvg
      const maxPitch = 1 // replace with the maximum possible value of pitchAvg

      const normalizedPitch = (pitchAvg - minPitch) / (maxPitch - minPitch) // normalize to 0-1
      const hue = normalizedPitch * 360 // scale to 0-360
      const startColor = new THREE.Color('hsl(' + hue + ', 100%, 50%)')
      const endColor = new THREE.Color('hsl(' + (hue + 120) + ', 100%, 50%)')

      pointsRef.current.material.uniforms.startColor.value = startColor
      pointsRef.current.material.uniforms.endColor.value = endColor
    } else {
      pointsRef.current.material.uniforms.time.value = timeRef.current

      // random rotation based on time value, use pi and math.random
      pointsRef.current.rotation.z = Math.PI * Math.random() * timeRef.current
    }

    // if (particleRef.current) {
    //   particleRef.current.uniforms.time.value = clock.getElapsedTime()
    // }
  })

  const particleControls = useControls(
    'Particles',
    {
      offsetSize: { value: 2, min: 0, max: 10, step: 0.1 },
      size: { value: 2.5, min: 0, max: 10, step: 0.1 },
      frequency: { value: 2, min: 0, max: 10, step: 0.1 },
      amplitude: { value: 1, min: 0, max: 10, step: 0.1 },
      offsetGain: { value: 0, min: 0, max: 10, step: 0.1 },
      maxDistance: { value: 1.8, min: 0, max: 10, step: 0.1 },
      startColor: new THREE.Color('hsl(0, 100%, 50%)'), // red
      endColor: new THREE.Color('hsl(240, 100%, 50%)'), // blue
    },
    { collapsed: true },
  )

  useEffect(() => {
    if (pointsRef.current.material) {
      pointsRef.current.material.uniforms.startColor.value = new THREE.Color(particleControls.startColor)
      pointsRef.current.material.uniforms.endColor.value = new THREE.Color(particleControls.endColor)
      pointsRef.current.material.uniforms.offsetSize.value = particleControls.uOffsetSize
      pointsRef.current.material.uniforms.size.value = particleControls.size
      pointsRef.current.material.uniforms.frequency.value = particleControls.frequency
      pointsRef.current.material.uniforms.amplitude.value = particleControls.amplitude
      pointsRef.current.material.uniforms.offsetGain.value = particleControls.offsetGain
      pointsRef.current.material.uniforms.maxDistance.value = particleControls.maxDistance
    }
  }, [particleControls])

  useEffect(() => {
    spotifySync.current = new SpotifySync({ spotifyApi, canvasRef: pointsRef.current })

    spotifySync.current?.on('segment', (segment) => {
      console.log('segment', segment)
    })
    spotifySync.current?.on('beat', (beat) => {
      // get the current active interval from spotifySync
      console.log('in beat', spotifySync.current?.getInterval('beat'))

      if (pointsRef.current && spotifySync.current.time) {
        if (Math.random() < 0.5) {
          gsap.to(pointsRef.current.rotation, {
            duration: beat.duration, // Either a longer or BPM-synced duration
            // y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI,
            ease: 'elastic.out(0.2)',
          })
        }
      }
      console.log('pointsRef', pointsRef.current.rotation.x)
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
          <boxGeometry args={[3, 3, 3, 10, 10, 10]} />
          <particleMaterial ref={particleRef} side={THREE.DoubleSide} transparent />
        </points>
      </Center>
    </>
  )
}
