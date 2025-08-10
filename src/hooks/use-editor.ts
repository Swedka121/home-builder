import { skybox } from "@/components/3d/skybox"
import { useEditorStore } from "@/store/editorStore"
import { useWorldStore } from "@/store/worldStore"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

export type threeStateType = {
    scene: THREE.Scene | null
    camera: THREE.PerspectiveCamera | null
    renderer: THREE.WebGLRenderer | null
    grid: THREE.GridHelper | null
    gridPlane: THREE.Plane | null
    skyboxMesh: THREE.Mesh | null
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
    const threeState = useRef<threeStateType>({
        scene: null,
        camera: null,
        renderer: null,
        grid: null,
        gridPlane: null,
        skyboxMesh: null,
    })
    const [meshState, setMeshState] = useState<{
        themed: MeshOrLine[]
        noThemed: MeshOrLine[]
    }>({
        themed: [],
        noThemed: [],
    })
    const ghost = useRef(new THREE.Mesh())
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

            // const PlaneG = new THREE.PlaneGeometry(128, 128)
            // const PlaneMat = new THREE.MeshStandardMaterial({ color: "#2d630e", roughness: 1, metalness: 0.0 })
            // const PlaneM = new THREE.Mesh(PlaneG, PlaneMat)
            // PlaneM.receiveShadow = true
            // PlaneM.position.y -= 0.01
            // PlaneM.rotation.x = -Math.PI / 2

            let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0))

            let meshState_ = meshState
            // meshState_.noThemed.push(PlaneM)
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

            const skyboxMesh = skybox.getTheme(theme.theme || "light") || new THREE.Mesh()
            scene.add(skyboxMesh)

            threeState.current = { ...threeState.current, scene, skyboxMesh, grid, renderer, camera, gridPlane: plane }

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
        if (!threeState.current) return
        threeState.current.renderer?.setClearColor(theme.theme == "dark" ? "#0a0a0a" : "#ffffff")

        const skyboxMesh = skybox.getTheme(theme.theme || "light") || new THREE.Mesh()

        const grid = new THREE.GridHelper(
            64,
            64,
            theme.theme != "dark" ? "#0a0a0a" : "#ffffff",
            theme.theme != "dark" ? "#0a0a0a" : "#ffffff"
        )

        threeState.current = { ...threeState.current, skyboxMesh, grid }

        if (threeState.current.scene) {
            threeState.current.scene.add(grid)
            threeState.current.scene.add(skyboxMesh)
        }

        let meshState_ = meshState
        meshState_.themed.forEach((el) => {
            if ("color" in el.material && el.material.color instanceof THREE.Color) {
                el.material.color.set(theme.theme != "dark" ? "#0a0a0a" : "#ffffff")
            }
        })

        return () => {
            if (threeState.current.scene && threeState.current.grid && threeState.current.skyboxMesh) {
                threeState.current.scene.remove(threeState.current.grid)
                threeState.current.scene.remove(threeState.current.skyboxMesh)
            }
        }
    }, [theme.theme])

    useEffect(() => {
        // if (editorStore.wallsMesh) {
        const mesh = editorStore.current.wallsMesh
        threeState.current.scene?.add(mesh)

        return () => {
            threeState.current.scene?.remove(mesh)
        }
        // }
    }, [editorStore.current.wallsData, editorStore.current.wallsMesh])

    useEffect(() => {
        if (!canvasRef.current) return

        const getPosOnGrid = (event: MouseEvent, actionMode?: boolean) => {
            if (threeState.current.camera && threeState.current.gridPlane) {
                const raycaster = new THREE.Raycaster()
                const mouse = new THREE.Vector2()

                mouse.x = (event.clientX / window.innerWidth) * 2 - 1
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

                raycaster.setFromCamera(mouse, threeState.current.camera)

                let points = []

                // const intersections = raycaster.intersectObjects([editorStore.current.wallsMesh], true)
                // if (intersections.length > 0) {
                //     intersections.forEach((el) => {
                //         el.point.setY(0)
                //         el.point.round()

                //         if (actionMode) {
                //             if (editorStore.current.mode == "WALL_DELETE") {
                //                 editorStore.current.removeWall(el.point.x, el.point.z)
                //                 useEditorStore.getState().generateWalls()
                //             }
                //         }
                //         points.push(el.point)
                //     })
                // }

                const point = new THREE.Vector3()
                raycaster.ray.intersectPlane(threeState.current.gridPlane, point)

                if (point) {
                    point.round()
                    console.log(point)
                    points.push(point)
                    if (actionMode) {
                        if (editorStore.current.mode == "WALL_ADD") {
                            editorStore.current.addWall(point.x, point.z)
                            useEditorStore.getState().generateWalls()
                        }
                        if (editorStore.current.mode == "WALL_DELETE") {
                            editorStore.current.removeWall(point.x, point.z)
                            useEditorStore.getState().generateWalls()
                        }
                    }
                }
                return points.filter(
                    (value, index, self) => index === self.findIndex((a) => a.x == value.x && a.z == value.z)
                )
            }
        }

        const mouseDownEvent = (event: MouseEvent) => {
            console.log("down!")
            isMoved.current = false
        }
        const mouseMoved = (event: MouseEvent) => {
            console.log("moved!")
            isMoved.current = true

            const editorStore = useEditorStore.getState()

            const points = getPosOnGrid(event)

            if (threeState.current.scene && points && points[0]) {
                let color = "#ffffff"

                console.log(editorStore.mode)

                if (editorStore.mode == "WALL_ADD") {
                    color = "#68cc17"
                }
                if (editorStore.mode == "WALL_DELETE") {
                    color = "#cc1010"
                }

                threeState.current.scene.remove(ghost.current)

                const geometry = new THREE.BoxGeometry(0.2, 2, 0.2)
                geometry.translate(0, 1, 0)
                const material = new THREE.MeshBasicMaterial({
                    color,
                    blendAlpha: 0.6,
                })

                const mesh = new THREE.Mesh(geometry, material)
                mesh.position.x = points[0].x
                mesh.position.z = points[0].z

                threeState.current.scene.add(mesh)
                ghost.current = mesh
            }
        }
        const mouseUpEvent = (event: MouseEvent) => {
            console.log("up!", isMoved.current)
            if (!isMoved.current) getPosOnGrid(event, true)
        }

        canvasRef.current.addEventListener("mousedown", mouseDownEvent)
        canvasRef.current.addEventListener("mousemove", mouseMoved)
        canvasRef.current.addEventListener("mouseup", mouseUpEvent)

        return () => {
            canvasRef.current?.removeEventListener("mousedown", mouseDownEvent)
            canvasRef.current?.removeEventListener("mousemove", mouseMoved)
            canvasRef.current?.removeEventListener("mouseup", mouseUpEvent)
        }
    }, [threeState.current])
}
