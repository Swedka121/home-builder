import EditorSidebar from "@/components/editor/editorSidebar"
import ThreeWindow from "@/components/editor/threeWindow"
import React from "react"
import InformationLabel from "@/components/editor/informationLabel"

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
