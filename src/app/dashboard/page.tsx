import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Globe, 
  Server, 
  TrendingUp, 
  AlertCircle,
  Plus,
  Search,
  Settings,
  CreditCard,
  BarChart3,
  Clock
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">DomainPro</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Domains
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Kyle! 👋</h2>
          <p className="text-slate-600 dark:text-slate-400">Here's what's happening with your domains and hosting</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
              <Globe className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hosting Sites</CardTitle>
              <Server className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                All sites operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45.2K</div>
              <p className="text-xs text-green-600 mt-1">
                +12.5% increase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-orange-600 mt-1">
                Renewal required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Domains & Sites */}
          <div className="lg:col-span-2 space-y-6">
            {/* Your Domains */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Domains</CardTitle>
                    <CardDescription>Manage and monitor your domain portfolio</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "mejiaagency.com", status: "Active", expiry: "365 days", type: "Premium" },
                    { name: "dreams2reality.io", status: "Active", expiry: "180 days", type: "Standard" },
                    { name: "domain-platform.com", status: "Active", expiry: "45 days", type: "Standard" },
                  ].map((domain, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{domain.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Expires in {domain.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={domain.expiry.includes("45") ? "destructive" : "default"}>
                          {domain.status}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hosting Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hosting Overview</CardTitle>
                    <CardDescription>Your active websites and performance</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mejia Agency", url: "mejiaagency.com", status: "Live", uptime: "99.9%" },
                    { name: "Dreams 2 Reality", url: "dreams2reality.io", status: "Live", uptime: "100%" },
                    { name: "Domain Platform", url: "domain-platform.com", status: "Live", uptime: "99.8%" },
                  ].map((site, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Server className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{site.name}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{site.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{site.uptime}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Uptime</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          {site.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Search New Domain
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Site
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  DNS Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Domain renewed", domain: "mejiaagency.com", time: "2 hours ago" },
                    { action: "SSL certificate updated", domain: "dreams2reality.io", time: "5 hours ago" },
                    { action: "New site deployed", domain: "domain-platform.com", time: "1 day ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Clock className="h-4 w-4 mt-1 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{activity.domain}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Summary</CardTitle>
                <CardDescription>Current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Domains</span>
                      <span className="font-medium">$156.00</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Hosting</span>
                      <span className="font-medium">$89.00</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">SSL Certificates</span>
                      <span className="font-medium">$29.00</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total</span>
                        <span className="text-xl font-bold text-blue-600">$274.00</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
