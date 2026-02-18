"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { CreateEventForm } from "./create-event-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconLoader, IconAlertTriangle, IconCalendar, IconUser, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { EditEventSheet } from "./edit-event-sheet"

// Types
type UserRole = 'PARTICIPANT' | 'ORGANIZER' | 'ADMIN'

interface UserData {
    userID: string;
    email: string;
    role: UserRole;
    firstName?: string;
}

interface EventData {
    _id: string;
    Name: string;
    description: string;
    startDate: string;
    endDate: string;
    registrationFee: number;
    tags: string[];
    orgID: {
        _id: string;
        organizerName: string;
        email: string;
    } | string;
}

export default function DashboardPage() {
    const params = useParams()
    const router = useRouter()
    const targetUserID = params.userID as string

    const [activeTab, setActiveTab] = React.useState("dashboard")
    const [loading, setLoading] = React.useState(true)
    const [currentUser, setCurrentUser] = React.useState<UserData | null>(null)
    const [isAuthorized, setIsAuthorized] = React.useState(false)

    // Data State
    const [events, setEvents] = React.useState<EventData[]>([])
    const [users, setUsers] = React.useState<any[]>([])

    // 1. Security & Auth Check
    React.useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await fetch(`/api/user/${targetUserID}`)
                if (res.status === 401 || res.status === 403) {
                    toast.error("Unauthorized Access")
                    router.push("/auth/login")
                    return
                }
                if (!res.ok) throw new Error("Failed to fetch user")

                const userData = await res.json()

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
        void verifyUser()
    }, [targetUserID, router])

    // 2. Fetch Events (Day 5 Task)
    const fetchEvents = React.useCallback(async () => {
        try {
            const res = await fetch('/api/events')
            if (res.ok) {
                const data = await res.json()
                setEvents(data)
            }
        } catch (error) {
            console.error("Failed to fetch events", error)
        }
    }, [])

    // 3. Fetch Users (For Admin)
    const fetchUsers = React.useCallback(async () => {
        try {
            const res = await fetch('/api/user')
            if (res.ok) {
                const data = await res.json()
                setUsers(data)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
    }, [])

    // Load Data on Tab Change
    React.useEffect(() => {
        if (!isAuthorized) return;

        if (activeTab === 'browse' || activeTab === 'dashboard') {
            fetchEvents();
        }
        if (activeTab === 'users' && currentUser?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [activeTab, isAuthorized, currentUser, fetchEvents, fetchUsers]);


    // Actions (Day 7 Task)
    const handleRegister = async (eventId: string) => {
        try {
            const res = await fetch(`/api/events/${eventId}/register`, { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Registration failed")
            toast.success("Registered successfully!")
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error("Delete failed")
            toast.success("Event deleted")
            fetchEvents() // Refresh list
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center"><IconLoader className="animate-spin" /></div>
    if (!isAuthorized || !currentUser) return null

    return (
        <SidebarProvider>
            <AppSidebar activeId={activeTab} onSelect={setActiveTab} variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="p-6 max-w-6xl mx-auto w-full space-y-8">

                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome, {currentUser.firstName || "User"}</h1>
                        <Badge variant="outline" className="text-primary border-primary/20">{currentUser.role} Account</Badge>
                    </div>

                    {/* --- DASHBOARD TAB --- */}
                    {activeTab === "dashboard" && (
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardHeader><CardTitle>Total Events</CardTitle></CardHeader>
                                <CardContent><p className="text-2xl font-bold">{events.length}</p></CardContent>
                            </Card>
                            {currentUser.role === 'ADMIN' && (
                                <Card>
                                    <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
                                    <CardContent><p className="text-2xl font-bold">{users.length}</p></CardContent>
                                </Card>
                            )}
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
                        ) : <UnauthorizedMessage />
                    )}

                    {/* --- BROWSE TAB (ALL EVENTS) --- */}
                    {activeTab === "browse" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.length === 0 ? (
                                <p className="col-span-full text-center text-muted-foreground">No events found.</p>
                            ) : (
                                events.map((event) => (
                                    <Card key={event._id} className="flex flex-col">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <Badge variant="secondary" className="mb-2">{event.tags?.[0] || 'Event'}</Badge>
                                                {event.registrationFee === 0 ? <Badge className="bg-green-500">Free</Badge> : <Badge>₹{event.registrationFee}</Badge>}
                                            </div>
                                            <CardTitle className="line-clamp-1">{event.Name}</CardTitle>
                                            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-1 text-sm text-muted-foreground space-y-2">
                                            <div className="flex items-center gap-2">
                                                <IconCalendar size={16} />
                                                <span>{format(new Date(event.startDate), "PPP p")}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <IconUser size={16} />
                                                <span>{typeof event.orgID === 'object' ? event.orgID.organizerName : 'Organizer'}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="gap-2">
                                            {currentUser.role === 'PARTICIPANT' && (
                                                <Button className="w-full" onClick={() => handleRegister(event._id)}>Register</Button>
                                            )}

                                            {(currentUser.role === 'ADMIN' || (currentUser.role === 'ORGANIZER' && (typeof event.orgID === 'string' ? event.orgID === currentUser.userID : event.orgID._id === currentUser.userID))) && (
                                                <div className="flex w-full gap-2">
                                                    <EditEventSheet event={event} onUpdate={fetchEvents} />

                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(event._id)}>
                                                        <IconTrash size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}

                    {/* --- USERS TAB (ADMIN ONLY) --- */}
                    {activeTab === "users" && (
                        currentUser.role === 'ADMIN' ? (
                            <Card>
                                <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {users.map(u => (
                                            <div key={u._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                                <div>
                                                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                </div>
                                                <Badge variant="outline">{u.role}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : <UnauthorizedMessage />
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