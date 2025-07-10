import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSimulationForm } from "@/components/simulation/time-simulation-form"
import { SimulationResults } from "@/components/simulation/simulation-results"
import { CurrentStatus } from "@/components/simulation/current-status"

export default function SimulationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Simulation</h1>
          <p className="text-muted-foreground">Simulate the passage of time to plan for future cargo operations</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Simulation Controls</CardTitle>
              <CardDescription>Advance time to see how cargo status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSimulationForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Overview of the current cargo situation</CardDescription>
            </CardHeader>
            <CardContent>
              <CurrentStatus />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>Changes that will occur after time simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <SimulationResults />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
