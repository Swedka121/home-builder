import React from "react"
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
import { Button } from "../ui/shared/button"
import { ModeToggle } from "../ui/shared/theme-button"

export default function EditorSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row">
                <SidebarTrigger>
                    <Button variant="default">
                        <SidebarIcon />
                    </Button>
                </SidebarTrigger>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Modes</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <BrickWall color="#429710ff" />
                                    <span>Add walls</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <BrickWall color="#a71212ff" />
                                    <span>Delete walls</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Trash />
                                    <span>Delete furniture</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Models</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <DoorClosed />
                                    <span>Doors</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Grid2X2 />
                                    <span>Windows</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Lightbulb />
                                    <span>Lights</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Bath />
                                    <span>Bath</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Laptop />
                                    <span>Tech</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Utensils />
                                    <span>Kitchen</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Sofa />
                                    <span>Living room</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Bed />
                                    <span>Bed room</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Leaf />
                                    <span>Plants</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ModeToggle />
                <Link href="/" className="w-full">
                    <Button variant="secondary" className="w-full">
                        <ArrowLeft />
                    </Button>
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}
