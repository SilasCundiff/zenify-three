'use client'
import { Canvas } from '@react-three/fiber'
import Particles from '../three/Particles'

export default function ParticleCanvas() {
  return (
    <Canvas className='canvas'>
      <Particles />
    </Canvas>
  )
}
