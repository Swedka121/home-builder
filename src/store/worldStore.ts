import { randomUUID } from "crypto"
import { v4 } from "uuid"
import { create } from "zustand"

type World = {
    name: string
    date: Date
}

type WorldStore = {
    worlds: Map<string, World>
    create: (name: string) => void
    delete: (id: string) => void
    getShare: (id: string) => string
    load: () => void
}

export const useWorldStore = create<WorldStore>()((set) => ({
    worlds: new Map(),
    create(name) {
        const id = v4()
        const world: World = {
            name,
            date: new Date(),
        }
        let worlds_ = this.worlds
        worlds_.set(id, world)

        localStorage.setItem("worlds", JSON.stringify(Object.fromEntries(worlds_)))

        set({ worlds: worlds_ })
    },
    load() {
        let worlds_ = JSON.parse(localStorage.getItem("worlds") || "", (key, value) => {
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
                return new Date(value)
            }
            return value
        }) as World[]
        let worlds__ = new Map(Object.entries(worlds_))
        set({ worlds: worlds__ })
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
