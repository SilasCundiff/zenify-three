'use client'
import { Object3D, Color, Points } from 'three'
import gsap from 'gsap'
import vertex from '@/helpers/three/shaders/vertex.glsl'
import fragment from '@/helpers/three/shaders/fragment.glsl'

export default function Particles() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color='blue' />
    </mesh>
  )
}
