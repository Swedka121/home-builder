import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/shared/card"
import { Button } from "../ui/shared/button"
import { useWorldStore } from "@/store/worldStore"
import {
    AlertDialogTrigger,
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogTitle,
    AlertDialogDescription,
} from "../ui/shared/alert-dialog"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function WorldCard({ name, date, id }: { name: string; date: Date; id: string }) {
    const store = useWorldStore()
    const router = useRouter()
    return (
        <Card className="transition-all hover:border-accent-foreground">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>Creation date {date.toDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row gap-x-3">
                <Link href={`/world/${id}`}>
                    <Button variant="default">Join</Button>
                </Link>
                <Link href={store.getShare(id)} download={true}>
                    <Button variant="secondary">Share</Button>
                </Link>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your world.
                                <br />
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => {
                                    store.delete(id)
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    )
}
