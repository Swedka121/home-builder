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
import { useEditorStore } from "@/store/editorStore"
import InformationLabel from "@/components/editor/informationLabel"
import { useRouter } from "next/router"

export default async function page({ params }: { params: Promise<{ id: string }> }) {
    const params_ = await params
    return (
        <>
            <div className="flex flex-row">
                <EditorSidebar />
                <ThreeWindow worldId={params_.id} />
                <InformationLabel />
            </div>
        </>
    )
}
