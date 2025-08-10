"use client"
import * as THREE from "three"

export type SkyboxTheme = {
    name: string
    data: string
}

export class Skybox {
    themes: Map<string, THREE.Mesh>
    constructor(themesNoInit: SkyboxTheme[]) {
        if (typeof document !== "undefined") {
            let loader = new THREE.TextureLoader()
            this.themes = new Map()

            // const cubeG = new THREE.BoxGeometry(1000, 1000, 1000)
            // this.themes = new Map()
            // themesNoInit.forEach((el) => {
            //     let geometry = cubeG.clone()

            //     const materials = [
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/pz.png`), side: THREE.BackSide }), // right
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/nz.png`), side: THREE.BackSide }), // left
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/py.png`), side: THREE.BackSide }), // top
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/ny.png`), side: THREE.BackSide }), // bottom
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/px.png`), side: THREE.BackSide }), // front
            //         new THREE.MeshBasicMaterial({ map: loader.load(`${el.data}/nx.png`), side: THREE.BackSide }), // back
            //     ]

            //     const cube = new THREE.Mesh(geometry, materials)

            //     this.themes.set(el.name, cube)
            // })

            themesNoInit.forEach((el) => {
                const geometry = new THREE.SphereGeometry(900, 60, 40, 0, Math.PI * 2, 0, Math.PI)

                const material = new THREE.MeshBasicMaterial({
                    map: loader.load(`${el.data}/skybox.png`),
                    side: THREE.BackSide,
                })

                const sphere = new THREE.Mesh(geometry, material)

                this.themes.set(el.name, sphere)
            })
        } else {
            this.themes = new Map()
        }
    }

    getTheme(theme: string) {
        return this.themes.get(theme)
    }
}

export const skybox = new Skybox([
    { name: "dark", data: "/skyboxes/dark" },
    { name: "light", data: "/skyboxes/light" },
])
