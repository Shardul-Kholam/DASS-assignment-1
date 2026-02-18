"use client"

import * as React from "react"
import {
  IconDashboard, IconSearch, IconUser, IconSettings,
  IconLogout, IconPlus, IconListCheck, IconUsers, IconLock
} from "@tabler/icons-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

// Navigation items mapped by role as per assignment requirements
const NAV_DATA = {
  PARTICIPANT: [
    { title: "Dashboard", id: "dashboard", icon: IconDashboard },
    { title: "Browse Events", id: "browse", icon: IconSearch },
    { title: "Clubs/Organizers", id: "clubs", icon: IconUsers },
    { title: "Profile", id: "profile", icon: IconUser },
  ],
  ORGANIZER: [
    { title: "Dashboard", id: "dashboard", icon: IconDashboard },
    { title: "Create Event", id: "create", icon: IconPlus },
    { title: "Ongoing Events", id: "ongoing", icon: IconListCheck },
    { title: "Profile", id: "profile", icon: IconUser },
  ],
  ADMIN: [
    { title: "Dashboard", id: "dashboard", icon: IconDashboard },
    { title: "Manage Clubs", id: "manage_clubs", icon: IconUsers },
    { title: "Reset Requests", id: "resets", icon: IconLock },
  ]
}

export function AppSidebar({ onSelect, activeId, ...props }: any) {
  // In a real app, parse this from document.cookie as requested
  const [userRole, setUserRole] = React.useState<"PARTICIPANT" | "ORGANIZER" | "ADMIN">("PARTICIPANT")

  const navItems = NAV_DATA[userRole]

  const handleLogout = () => {
    // Clear cookies/tokens and redirect 
    document.cookie = "auth_token=; Max-Age=0; path=/;"
    window.location.href = "/auth/login"
  }

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader className="font-bold px-4 py-4 text-xl">Felicity</SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                      isActive={activeId === item.id}
                      onClick={() => onSelect(item.id)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="text-destructive">
                <IconLogout />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
  )
}