'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { CloseableTabsTrigger } from "@/components/CloseableTabsTrigger"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"

export default function Page() {
  return (
    <SidebarProvider className="dark">
      <AppSidebar/>
      <SidebarInset>
        <Tabs>
          <TabsList className="transition-transform overflow-x-clip w-full justify-start rounded-none group-has-[[data-state=expanded]]/sidebar-wrapper:max-w-[calc(100vw-256px)] group-has-[[data-state=collapsed]]/sidebar-wrapper:max-w-[100vw]">
            <SidebarTrigger className="min-w-[28px]" />
            <Separator orientation="vertical" className="mr-1" />
            <CloseableTabsTrigger value={"tab1"} onClose={() => {}}>DashboardDashboardDashboardDashboard</CloseableTabsTrigger>
            <CloseableTabsTrigger value={"tab2"} onClose={() => {}}>Dashboard2</CloseableTabsTrigger>
          </TabsList>
          <TabsContent value={"tab1"}>
            <div className="flex flex-1 flex-col p-0">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                Tab1
              </div>
            </div>
          </TabsContent>
          <TabsContent value={"tab2"}>
            <div className="flex flex-1 flex-col p-0">
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                Tab2
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SidebarInset>
    </SidebarProvider>
  )
}
