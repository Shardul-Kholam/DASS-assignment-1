// src/app/dashboard/page.tsx
"use client"

import * as React from "react"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar"
import {SiteHeader} from "@/components/site-header"
import {DataTable} from "@/components/data-table"
import {SectionCards} from "@/components/section-cards"
import {ChartAreaInteractive} from "@/components/chart-area-interactive"
import data from "./data.json"

export default function DashboardPage() {
    const [activeTab, setActiveTab] = React.useState("dashboard")

    return (
        <SidebarProvider>
            <AppSidebar activeId={activeTab} onSelect={setActiveTab} variant="inset"/>
            <SidebarInset>
                <SiteHeader/>
                <div className="p-6">
                    {/* Main Dashboard View */}
                    {activeTab === "dashboard" && (
                        <div className="flex flex-col gap-6">
                            <SectionCards/>
                            <ChartAreaInteractive/>
                            <DataTable data={data}/>
                        </div>
                    )}

                    {/* Participant: Browse Events View  */}
                    {activeTab === "browse" && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <h2 className="text-2xl font-semibold">Browse All Felicity Events</h2>
                            <p className="text-muted-foreground">Search and filter upcoming competitions.</p>
                        </div>
                    )}

                    {/* Organizer: Create Event View [cite: 131] */}
                    {activeTab === "create" && (
                        <div className="max-w-2xl mx-auto py-10">
                            <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
                            {/* Form implementation would go here */}
                        </div>
                    )}

                    {/* Role-Based Profile View [cite: 111, 138] */}
                    {activeTab === "profile" && (
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h2 className="text-xl font-bold">User Profile</h2>
                            <p className="text-sm text-muted-foreground">Manage your personal information and
                                preferences.</p>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}