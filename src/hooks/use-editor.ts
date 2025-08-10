import { useEditorStore } from "@/store/editorStore"
import { useWorldStore } from "@/store/worldStore"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
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

export function useEditor(canvasRef: React.RefObject<HTMLCanvasElement | null>, worldId: string) {
    const isMoved = useRef(false)
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
    const editorStoreState = useEditorStore()
    const editorStore = useRef(editorStoreState)
    const router = useRouter()

    useEffect(() => {
        editorStore.current = editorStoreState
    }, [editorStoreState])

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
            renderer.shadowMap.enabled = true
            renderer.shadowMap.type = THREE.PCFSoftShadowMap

            const PlaneG = new THREE.PlaneGeometry(128, 128)
            const PlaneMat = new THREE.MeshStandardMaterial({ color: "#2d630e", roughness: 1, metalness: 0.0 })
            const PlaneM = new THREE.Mesh(PlaneG, PlaneMat)
            PlaneM.receiveShadow = true
            PlaneM.position.y -= 0.01
            PlaneM.rotation.x = -Math.PI / 2

            scene.add(PlaneM)
            let meshState_ = meshState
            meshState_.noThemed.push(PlaneM)
            setMeshState(meshState_)

            const AmbientLight = new THREE.AmbientLight("#f5e8cfff", 1.1)
            const DirectionLight = new THREE.DirectionalLight("#ffe6a1", 1.5) // softer yellow sunlight
            DirectionLight.castShadow = true

            DirectionLight.shadow.mapSize.width = 4096 // higher = sharper shadows
            DirectionLight.shadow.mapSize.height = 4096

            DirectionLight.shadow.camera.near = 1
            DirectionLight.shadow.camera.far = 500 // must cover scene depth

            // Increase the orthographic shadow camera size for wide coverage
            // DirectionLight.shadow.camera.left = -200
            // DirectionLight.shadow.camera.right = 200
            // DirectionLight.shadow.camera.top = 200
            // DirectionLight.shadow.camera.bottom = -200

            DirectionLight.position.set(-128, 30, -128)
            DirectionLight.lookAt(128, 0, 128)

            scene.add(AmbientLight)
            scene.add(DirectionLight)

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
            }

            render()

            let worldStore = useWorldStore.getState()
            let editorStore = useEditorStore.getState()
            let result = worldStore.join(worldId)
            console.log(result)
            if (result === false) router.push("/")
            if (result !== false) {
                editorStore.setWallsData(result.data.walls)
            }

            let timeoutSave = setInterval(() => {
                let worldStore = useWorldStore.getState()
                let editorStore = useEditorStore.getState()
                console.log(editorStore, worldStore)
                if (worldStore.save(worldId, editorStore.wallsData)) toast("World autosave is success")
                else toast("World autosave is failed")
            }, 100 * 60)

            return () => {
                clearInterval(timeoutSave)
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
        // if (editorStore.wallsMesh) {
        const mesh = editorStore.current.wallsMesh
        threeState.scene?.add(mesh)

        return () => {
            threeState.scene?.remove(mesh)
        }
        // }
    }, [editorStore.current.wallsData, editorStore.current.wallsMesh])

    useEffect(() => {
        if (!canvasRef.current) return

        const getPosOnGrid = (event: MouseEvent) => {
            if (threeState.camera && threeState.gridPlane) {
                const raycaster = new THREE.Raycaster()
                const mouse = new THREE.Vector2()

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

                raycaster.setFromCamera(mouse, threeState.camera)

                const intersections = raycaster.intersectObjects(
                    [threeState.gridPlane, editorStore.current.wallsMesh],
                    true
                )
                if (intersections.length > 0) {
                    intersections.forEach((el) => {
                        el.point.setY(0)
                        el.point.round()

                        console.log(el)

                        if (editorStore.current.mode == "WALL_ADD") {
                            editorStore.current.addWall(el.point.x, el.point.z)
                            useEditorStore.getState().generateWalls()
                        }
                        if (editorStore.current.mode == "WALL_DELETE") {
                            editorStore.current.removeWall(el.point.x, el.point.z)
                            useEditorStore.getState().generateWalls()
                        }
                        // if (editorStore.mode == "WALL_ADD") {
                        //     editorStore.addWall(intersections[0].point.x, intersections[0].point.z)
                        //     editorStore.generateWalls()
                        // }
                    })
                }
            }
        }

        const mouseDownEvent = (event: MouseEvent) => {
            console.log("down!")
            isMoved.current = false
        }
        const mouseMoved = (event: MouseEvent) => {
            console.log("moved!")
            isMoved.current = true
        }
        const mouseUpEvent = (event: MouseEvent) => {
            console.log("up!", isMoved.current)
            if (!isMoved.current) getPosOnGrid(event)
        }

        canvasRef.current.addEventListener("mousedown", mouseDownEvent)
        canvasRef.current.addEventListener("mousemove", mouseMoved)
        canvasRef.current.addEventListener("mouseup", mouseUpEvent)

        return () => {
            canvasRef.current?.removeEventListener("mousedown", mouseDownEvent)
            canvasRef.current?.removeEventListener("mousemove", mouseMoved)
            canvasRef.current?.removeEventListener("mouseup", mouseUpEvent)
        }
    }, [threeState])
}
