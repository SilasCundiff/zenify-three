'use client'
import * as THREE from 'three'
// import { interpolateRgb, interpolateBasis } from 'd3-interpolate'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import { useSpotifyWebSDK, useSpotifySongAnalysis } from '@/helpers/hooks'

// import spotifyApi from '@/helpers/spotify'
// import SpotifySync from '@/helpers/managers/SpotifySync'

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

const syncWithSpotify = () => {}

export default function Particles() {
  const { playerState } = useSpotifyWebSDK()
  const { trackAnalysis, trackFeatures } = useSpotifySongAnalysis(playerState)
  const [intervalTypes, setIntervalTypes] = useState(['tatums', 'segments', 'beats', 'bars', 'sections'])
  const [activeIntervals, setActiveIntervals] = useState({
    tatums: {},
    segments: {},
    beats: {},
    bars: {},
    sections: {},
  })
  const [currentlyPlaying, setCurrentlyPlaying] = useState({})
  // const [trackAnalysis, setTrackAnalysis] = useState({})
  // const [trackFeatures, setTrackFeatures] = useState({})

  const [active, setActive] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [volume, setVolume] = useState(0)
  const [queues, setQueues] = useState({
    volume: [],
    beat: [],
  })

  const particleRef = useRef()
  const pointsRef = useRef()

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    particleRef.current.uniforms.time.value = time
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
  }, [particleControls])

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
