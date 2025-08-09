import EditorSidebar from "@/components/editor/editorSidebar"
import ThreeWindow from "@/components/editor/threeWindow"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/shared/menubar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/shared/sidebar"
import {
    ArrowLeft,
    Bath,
    Bed,
    BrickWall,
    Computer,
    DoorClosed,
    DoorClosedIcon,
    Grid2X2,
    Laptop,
    Leaf,
    Lightbulb,
    SidebarIcon,
    Sofa,
    Table,
    Trash,
    Utensils,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/shared/button"
import { ModeToggle } from "@/components/ui/shared/theme-button"

import React from "react"

export default function page() {
    return (
        <>
            <div className="flex flex-row">
                <EditorSidebar />
                <ThreeWindow />
                <Menubar className="absolute right-0 top-5 mr-10 z-2">
                    <MenubarMenu>
                        <MenubarTrigger>Current mode: </MenubarTrigger>
                    </MenubarMenu>
                </Menubar>
            </div>
        </>
    )
}
