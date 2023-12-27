'use client'
import * as THREE from 'three'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

import { useSpotifySongAnalysis, useSpotifyWebSDK } from '@/helpers/hooks'
import spotifyApi from '@/helpers/spotify'
import SpotifySync from '@/helpers/managers/SpotifySync'

const ParticleMaterial = shaderMaterial(
  {
    time: 0,
    offsetSize: 2,
    size: 2.5,
    frequency: 2,
    amplitude: 1,
    offsetGain: 0,
    maxDistance: 1.8,
    startColor: new THREE.Color(0xff0000),
    endColor: new THREE.Color(0x0000ff),
  },
  vertex,
  fragment,
)

extend({ ParticleMaterial })

export default function Particles() {
  const { playerState, analysis, features, playbackData } = useSpotifyWebSDK()
  // const { analysis, features } = useSpotifySongAnalysis()
  // console.log('playbackState', playerState, playbackData, analysis, features)

  // console.log('analysis', analysis)
  // const accessToken = spotifyApi.getAccessToken()

  // console.dir({ analysis, features }, { depth: null, colors: true })

  const particleRef = useRef()
  const pointsRef = useRef()
  const spotifySync = useRef()
  const currentAmplitude = useRef(1)
  const targetAmplitude = useRef(1)
  const currentFrequency = useRef(1)
  const targetFrequency = useRef(1)

  useFrame(({ clock }) => {
    currentFrequency.current += (targetFrequency.current - currentFrequency.current) * 0.2
    particleRef.current.uniforms.amplitude.value = currentFrequency.current
    const time = clock.getElapsedTime()
    particleRef.current.uniforms.time.value = time

    if (!spotifySync.current?.isActive) {
      currentFrequency.current = 1
      particleRef.current.uniforms.amplitude.value = currentFrequency.current
    }

    if (spotifySync.current) {
      spotifySync.current.on('tatum', (tatum) => {
        if (spotifySync.current?.isActive) {
          if (spotifySync.current.volume) {
            targetFrequency.current = (spotifySync.current.volume * time) / 10
          }
        } else {
          // reset amplitude if not active
          targetFrequency.current = 1
        }
      })
    }
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
      startColor: '#ff0000',
      endColor: '#0000ff',
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
    // console.log('particleControls', meshRef.current.material.uniforms)
  }, [particleControls])

  useEffect(() => {
    // console.log('anything updated', spotifyApi, analysis, features, playerState, playbackData)
    spotifySync.current = new SpotifySync({ spotifyApi, analysis, features, playerState, playbackData })
    // spotifySync.current.updateTrackInfo({ analysis, features, playerState, playbackData })
    return () => {
      spotifySync.current = null
    }
  }, [analysis, features, playerState, playbackData])

  return (
    <>
      <Center>
        <OrbitControls makeDefault />
        <points ref={pointsRef}>
          <boxGeometry args={[2, 2, 2, 10, 10, 10]} />
          <particleMaterial ref={particleRef} side={THREE.DoubleSide} transparent />
        </points>
      </Center>
    </>
  )
}
