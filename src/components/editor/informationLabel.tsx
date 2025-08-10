"use client"
import { useEditorStore } from "@/store/editorStore"
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/shared/menubar"
import React from "react"
import { BrickWall, Trash } from "lucide-react"

export default function InformationLabel() {
    const editorStore = useEditorStore()
    return (
        <Menubar className="absolute right-0 top-5 mr-10 z-2">
            <MenubarMenu>
                <MenubarTrigger>
                    Current mode:{" "}
                    <span className="ml-2">
                        {editorStore.mode == "WALL_ADD" ? <BrickWall color="#429710ff" /> : null}
                        {editorStore.mode == "WALL_DELETE" ? <BrickWall color="#a71212ff" /> : null}
                        {editorStore.mode == "DELETE" ? <Trash /> : null}
                    </span>
                </MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    )
}
