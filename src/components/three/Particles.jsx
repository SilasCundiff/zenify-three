'use client'
import * as THREE from 'three'
import gsap from 'gsap'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'
import { Center, OrbitControls, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'
import AudioManager from '@/helpers/managers/AudioManager'
import BPMManager from '@/helpers/managers/BPMManager'
import { debounce } from 'lodash'

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

let audioManager
let bpmManager

export default function Particles() {
  const particleRef = useRef()
  const meshRef = useRef()
  const pointsRef = useRef()
  useFrame(({ clock }) => {
    // console.log('audio manager playing in clock?', audioManager?.frequencyData)
    if (particleRef.current) {
      // console.log('audioManager', audioManager.frequencyData)
      particleRef.current.uniforms.amplitude.value =
        0.8 + THREE.MathUtils.mapLinear(audioManager.frequencyData.high, 0, 0.6, -0.1, 0.2)
      particleRef.current.uniforms.offsetSize.value = audioManager.frequencyData.mid * 0.6
      const t = THREE.MathUtils.mapLinear(audioManager.frequencyData.low, 0.6, 1, 0.2, 0.5)
      particleRef.current.uniforms.time.value += THREE.MathUtils.clamp(t, 0.2, 0.5)
    } else {
      console.log('no particleRef')
    }
    audioManager.update()
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
    ;(async () => {
      audioManager = new AudioManager()
      await audioManager.loadAudioBuffer()

      bpmManager = new BPMManager()
      bpmManager.addEventListener('beat', (e) => {
        if (!audioManager?.isPlaying || !bpmManager) return
        console.log('beat', audioManager?.frequencyData)
        const duration = bpmManager?.getBPMDuration() / 1000
        if (audioManager?.isPlaying) {
          if (Math.random() < 0.5) {
            gsap.to(pointsRef.current.rotation, {
              duration: Math.random() < 0.8 ? 15 : duration, // Either a longer or BPM-synced duration
              // y: Math.random() * Math.PI * 2,
              z: Math.random() * Math.PI,
              ease: 'elastic.out(0.2)',
            })
          }
        }
      })
      await bpmManager.detectBPM(audioManager.audio.buffer)

      audioManager.update()
    })()

    // TODO clean up event listeners
    return () => {
      audioManager.pause()
      audioManager = null
      bpmManager = null
    }
  }, [])

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

  const handlePausePlay = debounce((e) => {
    e.stopPropagation()
    if (audioManager.isPlaying) {
      audioManager.pause()
    } else {
      audioManager.play()
    }
  }, 50)

  return (
    <>
      <Center>
        <OrbitControls makeDefault />
        <points ref={pointsRef} onClick={handlePausePlay}>
          <boxGeometry args={[1, 1, 1, 10, 10, 10]} />
          <particleMaterial ref={particleRef} side={THREE.DoubleSide} transparent />
        </points>
      </Center>
    </>
  )
}
