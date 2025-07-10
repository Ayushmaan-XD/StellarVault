import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2 } from "lucide-react"
import { WasteItemsTable } from "@/components/waste/waste-items-table"
import { ReturnPlanForm } from "@/components/waste/return-plan-form"
import { ExpiringItemsList } from "@/components/waste/expiring-items-list"
import { LowUsesItemsList } from "@/components/waste/low-uses-items-list"

export default function WastePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Waste Management</h1>
          <p className="text-muted-foreground">Manage expired or depleted items and plan for waste return</p>
        </div>

        <Tabs defaultValue="waste-items">
          <TabsList>
            <TabsTrigger value="waste-items">Waste Items</TabsTrigger>
            <TabsTrigger value="return-plan">Return Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="waste-items" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Waste Items</CardTitle>
                  <CardDescription>Items that have expired or are out of uses</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Identify Waste</span>
                </Button>
              </CardHeader>
              <CardContent>
                <WasteItemsTable />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Expiring Soon</CardTitle>
                  <CardDescription>Items that will expire in the next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpiringItemsList />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Low on Uses</CardTitle>
                  <CardDescription>Items with less than 10% of uses remaining</CardDescription>
                </CardHeader>
                <CardContent>
                  <LowUsesItemsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="return-plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Return Plan</CardTitle>
                <CardDescription>Plan for returning waste items during the next undocking</CardDescription>
              </CardHeader>
              <CardContent>
                <ReturnPlanForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
