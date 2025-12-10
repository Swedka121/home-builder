/** @format */

import {
  BoxGeometry,
  BufferGeometry,
  BufferGeometryEventMap,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";
import { create } from "zustand";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { toast } from "sonner";

export type EditorMode = "WALL_ADD" | "WALL_DELETE" | "DELETE";
export type EditorModel = {
  name: string;
  mesh: Mesh;
};
export type WallData = {
  x: number;
  y: number;
  o1: boolean;
  o2: boolean;
  o3: boolean;
  o4: boolean;
};

type EditorStore = {
  mode: EditorMode;
  currentModel: Mesh | null;
  furnitureData: EditorModel[];
  wallsData: WallData[];
  wallsMesh: Mesh<
    BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>,
    Material | Material[],
    Object3DEventMap
  >;
  getMesh: () => Mesh<
    BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>,
    Material | Material[],
    Object3DEventMap
  >;
  addWall: (x: number, y: number) => void;
  removeWall: (x: number, y: number) => void;
  checkWall: (
    x: number,
    y: number,
    side: "o1" | "o2" | "o3" | "o4",
    walls: WallData[]
  ) => boolean;
  checkWallWS: (x: number, y: number) => boolean;
  generateWalls: () => void;
  setMode: (mode: EditorMode) => void;
  setWallsData: (wallsData: WallData[]) => void;
};

export const useEditorStore = create<EditorStore>()((set) => ({
  mode: "WALL_ADD",
  currentModel: null,
  furnitureData: [],
  wallsData: [],
  wallsMesh: new Mesh(),
  getMesh() {
    return this.wallsMesh;
  },
  addWall(x, y) {
    set((state) => ({
      ...state,
      wallsData: [
        ...state.wallsData,
        { x, y, o1: false, o2: false, o3: false, o4: false },
      ],
    }));
  },
  removeWall(x, y) {
    let walls_ = [...this.wallsData];
    const index = walls_.findIndex((a) => a.x == x && a.y == y);
    if (index > -1) {
      walls_.splice(index, 1);
    }

    set((state) => ({ ...state, wallsData: walls_ }));
  },
  checkWall(x, y, side, walls) {
    return walls.find((a) => a.x == x && a.y == y && a[side] == false)
      ? true
      : false;
  },
  checkWallWS(x, y) {
    return true;
  },
  generateWalls() {
    set((state) => {
      console.log(state.wallsData);
      if (state.wallsData.length > 0) {
        const baseColumn = new BoxGeometry(0.1, 2, 0.1);
        const vert = new BoxGeometry(0.9, 2, 0.1);
        const horz = new BoxGeometry(0.1, 2, 0.9);
        const walls_geos: BufferGeometry[] = [];
        const newWalls = [...state.wallsData];

        state.wallsData.forEach(({ x, y }) => {
          const column_geo = baseColumn.clone();
          column_geo.translate(x, 1, y);
          walls_geos.push(column_geo);

          let sides = { o1: false, o2: false, o3: false, o4: false };

          if (state.checkWall(x, y - 1, "o3", newWalls)) {
            sides.o1 = true;
            const wall_geo = horz.clone();
            wall_geo.translate(x, 1, y - 0.5);
            walls_geos.push(wall_geo);
          }
          if (state.checkWall(x, y + 1, "o1", newWalls)) {
            sides.o3 = true;
            const wall_geo = horz.clone();
            wall_geo.translate(x, 1, y + 0.5);
            walls_geos.push(wall_geo);
          }
          if (state.checkWall(x - 1, y, "o2", newWalls)) {
            sides.o4 = true;
            const wall_geo = vert.clone();
            wall_geo.translate(x - 0.5, 1, y);
            walls_geos.push(wall_geo);
          }
          if (state.checkWall(x + 1, y, "o4", newWalls)) {
            sides.o2 = true;
            const wall_geo = vert.clone();
            wall_geo.translate(x + 0.5, 1, y);
            walls_geos.push(wall_geo);
          }
          let delete_ = newWalls.findIndex((a) => a.x == x && a.y == y);
          if (delete_ > -1) {
            newWalls.splice(delete_, 1);
            newWalls.push({ x, y, ...sides });
          }
        });

        const walls_geo = BufferGeometryUtils.mergeGeometries(
          walls_geos,
          false
        );
        const mesh = new Mesh(
          walls_geo,
          new MeshStandardMaterial({
            color: "#dbdbdbff",
            roughness: 0.8,
            metalness: 0.0,
          })
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = "wallsMesh";
        return { ...state, wallsData: newWalls, wallsMesh: mesh };
      } else {
        return { ...state, wallsMesh: new Mesh() };
      }
    });
  },
  setMode(mode) {
    set((state) => ({ ...state, mode }));
  },
  setWallsData(wallsData) {
    set((state) => {
      const newWallsData = [...wallsData];
      return { ...state, wallsData: newWallsData };
    });

    setTimeout(() => {
      this.generateWalls();
    }, 1);
  },
}));
