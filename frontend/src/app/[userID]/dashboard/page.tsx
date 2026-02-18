"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { CreateEventForm } from "./create-event-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconLoader, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"

type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN'

interface UserData {
    userID: string;
    email: string;
    role: UserRole;
    firstName?: string;
}

export default function DashboardPage() {
    const params = useParams()
    const router = useRouter()
    const targetUserID = params.userID as string

    const [activeTab, setActiveTab] = React.useState("dashboard")
    const [loading, setLoading] = React.useState(true)
    const [currentUser, setCurrentUser] = React.useState<UserData | null>(null)
    const [isAuthorized, setIsAuthorized] = React.useState(false)

    // 1. Security & Auth Check
    React.useEffect(() => {
        const verifyUser = async () => {
            try {
                // Fetch the user profile to verify identity.
                const res = await fetch(`/api/user/${targetUserID}`)

                if (res.status === 401 || res.status === 403) {
                    toast.error("Unauthorized Access")
                    router.push("/auth/login")
                    return
                }

                if (!res.ok) {
                    toast.error("Failed to fetch user data")
                    return
                }

                const userData = await res.json()

                // SECURITY CHECK: URL Parameter vs Logged In User
                // If the API returns the logged-in user's data, check if it matches the URL
                if (userData._id !== targetUserID) {
                    toast.error("Security Warning: You cannot access another user's dashboard.")
                    router.push(`/auth/login`)
                    return;
                }

                setCurrentUser({
                    userID: userData._id,
                    email: userData.email,
                    role: userData.role || 'PARTICIPANT',
                    firstName: userData.firstName
                })
                setIsAuthorized(true)

            } catch (error) {
                console.error("Auth Error:", error)
                toast.error("Session expired or unauthorized access.")
                router.push("/auth/login")
            } finally {
                setLoading(false)
            }
        }

        // Execute and handle promise
        void verifyUser()
    }, [targetUserID, router])

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <IconLoader className="animate-spin size-10" />
            </div>
        )
    }

    if (!isAuthorized || !currentUser) {
        return null // Router will redirect
    }

    return (
        <SidebarProvider>
            <AppSidebar activeId={activeTab} onSelect={setActiveTab} variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="p-6 max-w-6xl mx-auto w-full space-y-8">

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome, {currentUser.firstName || "User"}
                        </h1>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                            {currentUser.role} Account
                        </span>
                    </div>

                    {/* --- DASHBOARD TAB --- */}
                    {activeTab === "dashboard" && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Overview</CardTitle>
                                    <CardDescription>Your activity summary</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {currentUser.role === 'PARTICIPANT' && <p>You have registered for 0 events.</p>}
                                    {currentUser.role === 'ORGANIZER' && <p>You have created 0 active events.</p>}
                                    {currentUser.role === 'ADMIN' && <p>System status: Healthy</p>}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* --- CREATE EVENT TAB (ORGANIZER ONLY) --- */}
                    {activeTab === "create" && (
                        currentUser.role === 'ORGANIZER' ? (
                            <div className="max-w-3xl mx-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Create New Event</CardTitle>
                                        <CardDescription>Fill in the details to publish a new event.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <CreateEventForm userId={currentUser.userID} />
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <UnauthorizedMessage />
                        )
                    )}

                    {/* --- BROWSE TAB (PARTICIPANT ONLY) --- */}
                    {activeTab === "browse" && (
                        currentUser.role === 'PARTICIPANT' ? (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/10">
                                <h2 className="text-2xl font-semibold mb-2">Browse Events</h2>
                                <p className="text-muted-foreground">List of events will appear here.</p>
                            </div>
                        ) : (
                            <UnauthorizedMessage />
                        )
                    )}

                    {/* --- ADMIN USERS TAB (ADMIN ONLY) --- */}
                    {activeTab === "users" && (
                        currentUser.role === 'ADMIN' ? (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-red-50 dark:bg-red-950/10 border-red-200">
                                <h2 className="text-2xl font-semibold mb-2 text-red-600">User Management</h2>
                                <p className="text-muted-foreground">Admin controls for users go here.</p>
                            </div>
                        ) : (
                            <UnauthorizedMessage />
                        )
                    )}

                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

function UnauthorizedMessage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="bg-destructive/10 p-4 rounded-full">
                <IconAlertTriangle className="size-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Access Restricted</h3>
            <p className="text-muted-foreground max-w-sm">
                Your account type does not have permission to view this section.
            </p>
        </div>
    )
}