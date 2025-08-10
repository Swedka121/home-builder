import { randomUUID } from "crypto"
import { v4 } from "uuid"
import { create } from "zustand"
import { WallData } from "./editorStore"
import { toast } from "sonner"

type World = {
    name: string
    date: Date
    data: {
        walls: WallData[]
    }
}

type WorldStore = {
    worlds: Map<string, World>
    create: (name: string) => void
    delete: (id: string) => void
    getShare: (id: string) => string
    load: () => void
    join: (worldId: string) => World | false
    save: (worldId: string, walls: WallData[]) => boolean
    loadFromFile: (text: string) => void | false
}

export const useWorldStore = create<WorldStore>()((set) => ({
    worlds: new Map(),
    create(name) {
        const id = v4()
        const world: World = {
            name,
            date: new Date(),
            data: {
                walls: [],
            },
        }
        let worlds_ = this.worlds
        worlds_.set(id, world)

        localStorage.setItem("worlds", JSON.stringify(Object.fromEntries(worlds_)))

        set({ worlds: worlds_ })
    },
    join(worldId: string) {
        if (!this.worlds.has(worldId)) return false
        return this.worlds.get(worldId) as World
    },
    save(worldId: string, walls: WallData[]) {
        if (!this.worlds.has(worldId)) return false
        let world = this.worlds.get(worldId) as World
        world.data.walls = walls
        this.worlds.set(worldId, world)
        localStorage.setItem("worlds", JSON.stringify(Object.fromEntries(this.worlds)))
        set({ worlds: this.worlds })
        return true
    },
    load() {
        try {
            let worlds_ = JSON.parse(localStorage.getItem("worlds") || "", (key, value) => {
                if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                    return new Date(value)
                }
                return value
            }) as World[]
            let worlds__ = new Map(Object.entries(worlds_))
            set((state) => ({ ...state, worlds: worlds__ }))
        } catch (err) {
            toast("Nothing to load")
        }
    },
    loadFromFile(text) {
        try {
            let world = JSON.parse(text, (key, value) => {
                if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                    return new Date(value)
                }
                return value
            }) as World
            toast("World import is success")

            let worlds = this.worlds
            worlds.set(v4(), world)
            localStorage.setItem("worlds", JSON.stringify(Object.fromEntries(worlds)))
            set((state) => ({ ...state, worlds: worlds }))
        } catch (err) {
            toast("World import is failed")
            return false
        }
    },
    delete(id) {
        let worlds_ = this.worlds
        worlds_.delete(id)

        localStorage.setItem("worlds", JSON.stringify(Object.fromEntries(worlds_)))

        set({ worlds: worlds_ })
    },
    getShare(id) {
        const blob = URL.createObjectURL(new Blob([JSON.stringify(this.worlds.get(id))], { type: "application/json" }))
        return blob
    },
}))
