"use client"
import React, { useEffect } from "react"
import { Plus } from "lucide-react"
import WorldCard from "@/components/main/WorldCard"
import { Card, CardContent } from "@/components/ui/shared/card"
import { useWorldStore } from "@/store/worldStore"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/shared/dialog"
import { Button } from "../ui/shared/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/shared/form"
import { z } from "zod"
import { Input } from "../ui/shared/input"
import { toast } from "sonner"

export default function WorldList() {
    const store = useWorldStore()
    const formSchema = z.object({
        name: z.string().min(3, { error: "Username should be longer than 3 symbols!" }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        store.create(values.name)
        toast("World has created!")
    }

    useEffect(() => {
        if (form.formState.errors.name) {
            toast("World creation error " + form.formState.errors.name.message)
            form.reset()
        }
    }, [form.formState.errors])

    useEffect(() => {
        store.load()
    }, [])

    return (
        <>
            {Array.from(store.worlds).map((el) => (
                <WorldCard name={el[1].name} date={el[1].date} id={el[0]} key={el[0]} />
            ))}
            <Dialog>
                <DialogTrigger>
                    <Card className="transition-all hover:border-accent-foreground">
                        <CardContent className="flex justify-center">
                            <Plus></Plus>
                        </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <DialogHeader>
                                <DialogTitle>Let's start!</DialogTitle>
                                <DialogDescription>Fill this form to create your world</DialogDescription>

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="shadcn" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="default" type="submit">
                                        Create
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
