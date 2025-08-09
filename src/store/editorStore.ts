import { BoxGeometry, BufferGeometry, Mesh, MeshBasicMaterial } from "three"
import { create } from "zustand"
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js"

export type EditorMode = "WALL_ADD" | "WALL_DELETE" | "DELETE"
export type EditorModel = {
    name: string
    mesh: Mesh
}
export type WallData = {
    x: number
    y: number
    o1: boolean
    o2: boolean
    o3: boolean
    o4: boolean
}

type EditorStore = {
    mode: EditorMode
    currentModel: Mesh | null
    furnitureData: EditorModel[]
    wallsData: WallData[]
    addWall: (x: number, y: number) => void
    removeWall: (x: number, y: number) => void
    checkWall: (x: number, y: number, side: "o1" | "o2" | "o3" | "o4", walls: WallData[]) => boolean
    checkWallWS: (x: number, y: number) => boolean
    generateWalls: () => Mesh
}

export const useEditorStore = create<EditorStore>()((set) => {
    return {
        mode: "WALL_ADD",
        currentModel: null,
        furnitureData: [],
        wallsData: [],
        addWall(x, y) {
            set((state) => ({
                ...state,
                wallsData: [...state.wallsData, { x, y, o1: false, o2: false, o3: false, o4: false }],
            }))
        },
        removeWall(x, y) {
            let walls_ = this.wallsData
            walls_ = walls_.splice(
                walls_.findIndex((a) => a.x == x && a.y == y),
                1
            )
            set({ ...this, wallsData: walls_ })
        },
        checkWall(x, y, side, walls) {
            return walls.find((a) => a.x == x && a.y == y && a[side] == false) ? true : false
        },
        checkWallWS(x, y) {
            return true
        },
        generateWalls() {
            if (this.wallsData.length > 0) {
                const baseColumn = new BoxGeometry(0.1, 2, 0.1)
                const vert = new BoxGeometry(0.9, 2, 0.1)
                const horz = new BoxGeometry(0.1, 2, 0.9)
                const walls_geos: BufferGeometry[] = []
                const newWalls = this.wallsData

                this.wallsData.forEach(({ x, y }) => {
                    const column_geo = baseColumn.clone()
                    column_geo.translate(x, 1, y)
                    walls_geos.push(column_geo)

                    let sides = { o1: false, o2: false, o3: false, o4: false }

                    if (this.checkWall(x, y - 1, "o3", newWalls)) {
                        sides.o1 = true
                        const wall_geo = horz.clone()
                        wall_geo.translate(x, 1, y - 0.5)
                        walls_geos.push(wall_geo)
                    }
                    if (this.checkWall(x, y + 1, "o1", newWalls)) {
                        sides.o3 = true
                        const wall_geo = horz.clone()
                        wall_geo.translate(x, 1, y + 0.5)
                        walls_geos.push(wall_geo)
                    }
                    if (this.checkWall(x - 1, y, "o2", newWalls)) {
                        sides.o4 = true
                        const wall_geo = vert.clone()
                        wall_geo.translate(x - 0.5, 1, y)
                        walls_geos.push(wall_geo)
                    }
                    if (this.checkWall(x + 1, y, "o4", newWalls)) {
                        sides.o2 = true
                        const wall_geo = vert.clone()
                        wall_geo.translate(x + 0.5, 1, y)
                        walls_geos.push(wall_geo)
                    }
                })

                console.log(walls_geos)

                const walls_geo = BufferGeometryUtils.mergeGeometries(walls_geos, false)
                return new Mesh(walls_geo, new MeshBasicMaterial({ color: "#0a0a0a" }))
            } else {
                return new Mesh()
            }
        },
    }
})
