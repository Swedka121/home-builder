import { useEditorStore } from "@/store/editorStore"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export type ThreeStateType = {
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    grid: THREE.GridHelper | null
    gridPlane: THREE.Mesh | null
}

type AnyGeometry =
    | THREE.BoxGeometry
    | THREE.CircleGeometry
    | THREE.ConeGeometry
    | THREE.CylinderGeometry
    | THREE.DodecahedronGeometry
    | THREE.EdgesGeometry
    | THREE.ExtrudeGeometry
    | THREE.IcosahedronGeometry
    | THREE.LatheGeometry
    | THREE.OctahedronGeometry
    | THREE.PlaneGeometry
    | THREE.PolyhedronGeometry
    | THREE.RingGeometry
    | THREE.ShapeGeometry
    | THREE.SphereGeometry
    | THREE.TetrahedronGeometry
    | THREE.TorusGeometry
    | THREE.TorusKnotGeometry
    | THREE.TubeGeometry
    | THREE.WireframeGeometry
    | THREE.BufferGeometry

type AnyMaterial =
    | THREE.LineBasicMaterial
    | THREE.LineDashedMaterial
    | THREE.MeshBasicMaterial
    | THREE.MeshDepthMaterial
    | THREE.MeshDistanceMaterial
    | THREE.MeshLambertMaterial
    | THREE.MeshMatcapMaterial
    | THREE.MeshNormalMaterial
    | THREE.MeshPhongMaterial
    | THREE.MeshPhysicalMaterial
    | THREE.MeshStandardMaterial
    | THREE.MeshToonMaterial
    | THREE.PointsMaterial
    | THREE.RawShaderMaterial
    | THREE.ShaderMaterial
    | THREE.SpriteMaterial
    | THREE.Material

type MeshOrLine =
    | THREE.Mesh<AnyGeometry, AnyMaterial, THREE.Object3DEventMap>
    | THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>

export function useEditor(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    const [threeState, setThreeState] = useState<ThreeStateType>({
        scene: null,
        camera: null,
        renderer: null,
        grid: null,
        gridPlane: null,
    })
    const [meshState, setMeshState] = useState<{
        themed: MeshOrLine[]
        noThemed: MeshOrLine[]
    }>({
        themed: [],
        noThemed: [],
    })
    const theme = useTheme()
    const editorStore = useEditorStore()

    useEffect(() => {
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            90,
            (canvasRef.current?.clientWidth || 1) / (canvasRef.current?.clientHeight || 1),
            0.1,
            1000
        )
        if (canvasRef.current) {
            const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current })
            renderer.setSize(canvasRef.current.clientWidth || 1, canvasRef.current.clientHeight || 1)

            const PlaneG = new THREE.PlaneGeometry(128, 128)
            const PlaneMat = new THREE.MeshBasicMaterial({ color: "#2d630e" })
            const PlaneM = new THREE.Mesh(PlaneG, PlaneMat)
            PlaneM.position.y -= 0.01
            PlaneM.rotation.x = -Math.PI / 2

            scene.add(PlaneM)
            let meshState_ = meshState
            meshState_.noThemed.push(PlaneM)
            setMeshState(meshState_)

            const grid = new THREE.GridHelper(
                64,
                64,
                theme.theme != "dark" ? "#0a0a0a" : "#ffffff",
                theme.theme != "dark" ? "#0a0a0a" : "#ffffff"
            )
            scene.add(grid)

            camera.position.set(0, 10, 10)
            camera.lookAt(new THREE.Vector3(0, 0, 0))

            setThreeState({ scene, camera, renderer, grid, gridPlane: PlaneM })

            const controls = new OrbitControls(camera, canvasRef.current)
            controls.update()

            let animationId = 0
            function render() {
                animationId = requestAnimationFrame(render)

                renderer.render(scene, camera)
                console.log("render")
            }

            render()

            return () => {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    useEffect(() => {
        threeState.renderer?.setClearColor(theme.theme == "dark" ? "#0a0a0a" : "#ffffff")
        if (threeState.grid) threeState.scene?.remove(threeState.grid)

        const grid = new THREE.GridHelper(
            64,
            64,
            theme.theme != "dark" ? "#0a0a0a" : "#ffffff",
            theme.theme != "dark" ? "#0a0a0a" : "#ffffff"
        )
        if (threeState.scene) threeState.scene.add(grid)

        let meshState_ = meshState
        meshState_.themed.forEach((el) => {
            if ("color" in el.material && el.material.color instanceof THREE.Color) {
                el.material.color.set(theme.theme != "dark" ? "#0a0a0a" : "#ffffff")
            }
        })
    }, [theme.theme])

    useEffect(() => {
        const mesh = editorStore.generateWalls()
        threeState.scene?.add(mesh)

        return () => {
            threeState.scene?.remove(mesh)
        }
    }, [editorStore.wallsData])
    useEffect(() => {
        if (!canvasRef.current) return

        const getPosOnGrid = (event: PointerEvent) => {
            if (threeState.camera && threeState.gridPlane) {
                const raycaster = new THREE.Raycaster()
                const mouse = new THREE.Vector2()

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

                raycaster.setFromCamera(mouse, threeState.camera)

                const intersections = raycaster.intersectObject(threeState.gridPlane, true)
                if (intersections.length > 0) {
                    intersections[0].point.round()

                    if (editorStore.mode == "WALL_ADD")
                        editorStore.addWall(intersections[0].point.x, intersections[0].point.z)
                }
            }
        }

        canvasRef.current.addEventListener("click", getPosOnGrid)

        return () => {
            canvasRef.current?.removeEventListener("click", getPosOnGrid)
        }
    }, [threeState])
}
