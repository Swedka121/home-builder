import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/shared/card"
import WorldList from "@/components/main/WorldList"
import { ModeToggle } from "@/components/ui/shared/theme-button"

export default function Home() {
    return (
        <>
            <Card className="w-xs">
                <CardContent className="flex flex-row items-center justify-between">
                    <ModeToggle />
                    <h1 className="scroll-m-20 text-center text-1xl font-bold tracking-tight text-balance">
                        Home Builder
                    </h1>
                </CardContent>
            </Card>
            <div className="flex w-full h-9/10 justify-center items-center">
                <Card className="w-6/12 h-7/10 min-h-lg">
                    <CardHeader>
                        <CardTitle>Welcome to Home Builder</CardTitle>
                        <CardDescription>
                            Home Builder is a web application that allows you to design your dream house in a
                            user-friendly editor, save it, and share it with your friends.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col overflow-y-scroll gap-y-5 h-8/10">
                        <WorldList />
                    </CardContent>
                    <CardFooter>
                        <CardDescription>Designed and developed by Swedka121</CardDescription>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}
