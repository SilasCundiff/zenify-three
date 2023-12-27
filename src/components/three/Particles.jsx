'use client'
import * as THREE from 'three'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

import { useSpotifySongAnalysis } from '@/helpers/hooks'
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
  // const { analysis, features } = useSpotifySongAnalysis()
  // const accessToken = spotifyApi.getAccessToken()

  // console.dir({ analysis, features }, { depth: null, colors: true })

  const particleRef = useRef()
  const pointsRef = useRef()
  const spotifySync = useRef()
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (particleRef.current) {
      particleRef.current.uniforms.time.value = clock.getElapsedTime()

      if (spotifySync.current) {
        spotifySync.current.on('beat', (beat) => {
          // console.log('beat', spotifySync.current.active)
          if (spotifySync.current.isActive) {
            console.log('beat', beat, spotifySync.current.volume)
            particleRef.current.uniforms.amplitude.value = spotifySync.current.volume * time
          } else {
            particleRef.current.uniforms.amplitude.value = 1
          }
        })
      }
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
    spotifySync.current = new SpotifySync({ spotifyApi })
    return () => {
      spotifySync.current = null
    }
  }, [])

  return (
    <>
      <Center>
        <OrbitControls makeDefault />
        <points ref={pointsRef}>
          <boxGeometry args={[1, 1, 1, 10, 10, 10]} />
          <particleMaterial ref={particleRef} side={THREE.DoubleSide} transparent />
        </points>
      </Center>
    </>
  )
}
