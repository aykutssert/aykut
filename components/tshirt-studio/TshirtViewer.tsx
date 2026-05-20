'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { Upload, RotateCcw, Download } from 'lucide-react'
import { FabricEditor, FabricEditorHandle } from './FabricEditor'
import { useTranslations } from 'next-intl'

function GlCapture({ glRef }: { glRef: React.MutableRefObject<THREE.WebGLRenderer | null> }) {
  const { gl } = useThree()
  glRef.current = gl
  return null
}

const PRESETS = [
  '#f0f0f0', '#1a1a1a', '#e8dcc8', '#1e3a5f',
  '#2d4a3e', '#6b1f2a', '#c0522a', '#7c6fa0',
]

function buildTexture(color: string, fabricEl: HTMLCanvasElement | null): HTMLCanvasElement {
  const size = fabricEl?.width ?? 2048
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = color
  ctx.fillRect(0, 0, size, size)
  if (fabricEl) ctx.drawImage(fabricEl, 0, 0, size, size)
  return canvas
}


function TshirtModel({
  color,
  fabricEl,
}: {
  color: string
  fabricEl: HTMLCanvasElement | null
}) {
  const { scene: rawScene } = useGLTF('/tshirt-sporty.glb')
  const scene = useMemo(() => rawScene.clone(true), [rawScene])
  const textureRef = useRef<THREE.CanvasTexture | null>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && !materialRef.current) {
        materialRef.current = new THREE.MeshStandardMaterial({
          roughness: 0.9,
          metalness: 0,
          side: THREE.DoubleSide,
        })
        child.material = materialRef.current
      }
    })
    return () => {
      textureRef.current?.dispose()
      materialRef.current?.dispose()
      textureRef.current = null
      materialRef.current = null
    }
  }, [scene])

  const updateTexture = useCallback(() => {
    const canvas = buildTexture(color, fabricEl)
    if (!textureRef.current) {
      const tex = new THREE.CanvasTexture(canvas)
      tex.flipY = false
      tex.colorSpace = THREE.SRGBColorSpace
      textureRef.current = tex
    } else {
      textureRef.current.image = canvas
      textureRef.current.needsUpdate = true
    }
    if (materialRef.current) {
      materialRef.current.map = textureRef.current
      materialRef.current.needsUpdate = true
    }
  }, [color, fabricEl])

  useEffect(() => {
    updateTexture()
  }, [updateTexture])

  return (
    <Center>
      <primitive object={scene} scale={0.1} dispose={null} />
    </Center>
  )
}

export default function TshirtViewer() {
  const [color, setColor] = useState(PRESETS[1])
  const [fabricEl, setFabricEl] = useState<HTMLCanvasElement | null>(null)
  const [brightness, setBrightness] = useState(1.0)
  const [mobileTab, setMobileTab] = useState<'design' | 'preview'>('design')
  const [editorSize, setEditorSize] = useState(400)
  const editorRef = useRef<FabricEditorHandle>(null)
  const glRef = useRef<THREE.WebGLRenderer | null>(null)
  const [canvasReady, setCanvasReady] = useState(false)
  const t = useTranslations('tshirt')

  useEffect(() => {
    const raf = requestAnimationFrame(() => setCanvasReady(true))
    return () => { cancelAnimationFrame(raf); setCanvasReady(false) }
  }, [])

  function handleDownload() {
    const canvas = glRef.current?.domElement
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'tshirt-design.png'
    a.click()
  }

  useEffect(() => {
    const update = () => {
      // sidebar padding: 32px (p-4 × 2), min 280, max 400
      setEditorSize(Math.min(400, Math.max(280, window.innerWidth - 32)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b bg-background shrink-0">
        {(['design', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMobileTab(tab)}
            className="flex-1 py-2.5 text-xs font-medium capitalize transition-colors"
            style={{
              borderBottom: mobileTab === tab ? '2px solid hsl(var(--foreground))' : '2px solid transparent',
              color: mobileTab === tab ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
            }}
          >
            {tab === 'design' ? t('tab_design') : t('tab_preview')}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 md:flex-row flex-col">

      {/* Left: UV canvas editor */}
      <div className={`md:w-[440px] flex-col border-r bg-background shrink-0 ${mobileTab === 'design' ? 'flex' : 'hidden md:!flex'}`}>
        <div className="px-4 py-3 border-b">
          <h2 className="font-semibold text-xs">{t('editor_heading')}</h2>
        </div>

        <div className="p-4 flex justify-center">
          <FabricEditor ref={editorRef} size={editorSize} onChange={(snap) => setFabricEl(snap)} />
        </div>

        <div className="px-4 py-2 border-t flex gap-2">
          <button
            type="button"
            onClick={() => editorRef.current?.triggerUpload()}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Upload className="h-3.5 w-3.5" />
            {t('upload')}
          </button>
          <button
            type="button"
            onClick={() => editorRef.current?.resetImage()}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t('reset')}
          </button>
        </div>

        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('label_color')}</p>
            <span className="font-mono text-xs text-muted-foreground">{color.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <label className="relative cursor-pointer shrink-0">
              <span
                className="block h-8 w-10 rounded border border-border"
                style={{ backgroundColor: color }}
              />
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
            <p className="text-xs text-muted-foreground">{t('color_picker_hint')}</p>
          </div>
          <div className="flex gap-1.5">
            {PRESETS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="h-6 w-6 rounded-full border-2 transition-all hover:scale-110 focus:outline-none shrink-0"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? 'hsl(var(--foreground))' : 'hsl(var(--border))',
                  boxShadow: color === c
                    ? '0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--foreground))'
                    : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-t">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('label_brightness')}</p>
            <span className="text-xs text-muted-foreground">{Math.round(brightness * 100)}%</span>
          </div>
          <input
            type="range"
            min={0.2}
            max={2.0}
            step={0.05}
            value={brightness}
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
            className="w-full accent-foreground"
          />
        </div>
      </div>

      {/* Right: 3D preview */}
      <div className={`relative flex-1 bg-[#111111] ${mobileTab === 'preview' ? 'flex' : 'hidden md:!flex'} flex-col`}>
        {canvasReady && <Canvas camera={{ position: [0, 1.5, 7], fov: 35 }} gl={{ preserveDrawingBuffer: true }}>
          <color attach="background" args={['#111111']} />
          <hemisphereLight args={['#ffffff', '#888888', brightness]} />
          <directionalLight position={[2, 4, 3]} intensity={0.3 * brightness} />
          <directionalLight position={[-2, 4, -3]} intensity={0.3 * brightness} />
          <GlCapture glRef={glRef} />
          <Suspense fallback={null}>
            <TshirtModel color={color} fabricEl={fabricEl} />
            <Environment preset="studio" environmentIntensity={0.4 * brightness} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2} maxDistance={20} enableDamping dampingFactor={0.05} />
        </Canvas>}
        <button
          type="button"
          onClick={handleDownload}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <Download className="h-3.5 w-3.5" />
          {t('download')}
        </button>
      </div>

      </div>
    </div>
  )
}
