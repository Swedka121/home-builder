"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Toggle } from "./toggle"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <Toggle
            onClick={() => {
                if (theme == "dark") {
                    setTheme("light")
                } else {
                    setTheme("dark")
                }
            }}
        >
            {theme == "dark" ? <Moon /> : <Sun />}
        </Toggle>
    )
}
