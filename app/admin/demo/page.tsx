"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDemoPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIncidents, setSelectedIncidents] = useState<string[]>([])

  const stats = [
    { label: "Active Users", value: "1,247", change: "+12%", trend: "up" },
    { label: "Total Incidents", value: "89", change: "+5%", trend: "up" },
    { label: "Avg Response Time", value: "2.3m", change: "-8%", trend: "down" },
    { label: "Network Coverage", value: "94%", change: "+2%", trend: "up" },
  ]

  const incidents = [
    {
      id: "INC-001",
      type: "Medical Emergency",
      location: "Bali Resort - Villa 23",
      status: "Resolved",
      priority: "High",
      reporter: "Hotel Staff",
      assignee: "Dr. Sarah Chen",
      time: "2h ago",
      description: "Tourist experiencing chest pain, ambulance dispatched",
    },
    {
      id: "INC-002",
      type: "Transport Issue",
      location: "Bangkok Airport - Terminal 2",
      status: "Active",
      priority: "Medium",
      reporter: "Tour Guide",
      assignee: "Transport Team",
      time: "45m ago",
      description: "Flight delayed, 15 tourists need accommodation",
    },
    {
      id: "INC-003",
      type: "Medical Emergency",
      location: "Phuket Beach Resort",
      status: "Pending",
      priority: "High",
      reporter: "Tourist",
      assignee: "Unassigned",
      time: "1h ago",
      description: "Food poisoning symptoms, multiple tourists affected",
    },
    {
      id: "INC-004",
      type: "Security Alert",
      location: "Chiang Mai Night Market",
      status: "Investigating",
      priority: "Low",
      reporter: "Local Authority",
      assignee: "Security Team",
      time: "3h ago",
      description: "Pickpocketing incident reported",
    },
  ]

  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "Active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Investigating":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleIncidentSelect = (incidentId: string) => {
    setSelectedIncidents((prev) =>
      prev.includes(incidentId) ? prev.filter((id) => id !== incidentId) : [...prev, incidentId],
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      stat.trend === "up" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">vs last week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart Placeholder */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Incident Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/30 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-muted-foreground">Interactive chart will be displayed here</p>
              <p className="text-sm text-muted-foreground mt-1">Showing incident trends and response times</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="font-semibold">Create Alert</h3>
            <p className="text-sm text-muted-foreground">Send network-wide notification</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">Generate Report</h3>
            <p className="text-sm text-muted-foreground">Export incident analytics</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-muted-foreground">Add or modify network access</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderIncidents = () => (
    <div className="space-y-6">
      {/* Incidents Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Incident Management</h2>
          <p className="text-sm text-muted-foreground">Monitor and manage all tourist incidents</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button variant="outline">Filter</Button>
          <Button>New Incident</Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIncidents.length > 0 && (
        <Card className="glass-card border-border/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedIncidents.length} incident{selectedIncidents.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Assign
                </Button>
                <Button size="sm" variant="outline">
                  Update Status
                </Button>
                <Button size="sm" variant="outline">
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Incidents Table */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4 font-medium text-sm">
                    <input
                      type="checkbox"
                      className="rounded border-border/50"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIncidents(filteredIncidents.map((i) => i.id))
                        } else {
                          setSelectedIncidents([])
                        }
                      }}
                    />
                  </th>
                  <th className="p-4 font-medium text-sm">ID</th>
                  <th className="p-4 font-medium text-sm">Type</th>
                  <th className="p-4 font-medium text-sm">Location</th>
                  <th className="p-4 font-medium text-sm">Status</th>
                  <th className="p-4 font-medium text-sm">Priority</th>
                  <th className="p-4 font-medium text-sm">Assignee</th>
                  <th className="p-4 font-medium text-sm">Time</th>
                  <th className="p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-border/50"
                        checked={selectedIncidents.includes(incident.id)}
                        onChange={() => handleIncidentSelect(incident.id)}
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-medium">{incident.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{incident.type}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="text-sm font-medium">{incident.location}</span>
                        <p className="text-xs text-muted-foreground mt-1">{incident.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(incident.status)} border`}>{incident.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getPriorityColor(incident.priority)} border`}>{incident.priority}</Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{incident.assignee}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">{incident.time}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          👁️
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          ✏️
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          💬
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {filteredIncidents.length} of {incidents.length} incidents
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => {
    const users = [
      {
        id: "USR-001",
        name: "Sarah Johnson",
        email: "sarah.j@hotelgroup.com",
        role: "Hotel Manager",
        organization: "Bali Resort Group",
        status: "Active",
        lastActive: "2 hours ago",
        incidents: 12,
        location: "Bali, Indonesia",
      },
      {
        id: "USR-002",
        name: "Dr. Michael Chen",
        email: "m.chen@medicalteam.com",
        role: "Medical Responder",
        organization: "Bangkok Medical Center",
        status: "Active",
        lastActive: "30 minutes ago",
        incidents: 45,
        location: "Bangkok, Thailand",
      },
      {
        id: "USR-003",
        name: "Lisa Rodriguez",
        email: "lisa.r@tourguide.com",
        role: "Tour Guide",
        organization: "Adventure Tours Co",
        status: "Offline",
        lastActive: "1 day ago",
        incidents: 8,
        location: "Phuket, Thailand",
      },
      {
        id: "USR-004",
        name: "James Wilson",
        email: "j.wilson@security.com",
        role: "Security Officer",
        organization: "Tourist Safety Corp",
        status: "Active",
        lastActive: "15 minutes ago",
        incidents: 23,
        location: "Chiang Mai, Thailand",
      },
    ]

    return (
      <div className="space-y-6">
        {/* Users Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-sm text-muted-foreground">Manage network members and permissions</p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Search users..." className="w-64" />
            <Button variant="outline">Filter</Button>
            <Button>Add User</Button>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">1,089</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">158</div>
              <div className="text-sm text-muted-foreground">Offline Users</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">New This Week</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="glass-card border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-sm">User</th>
                    <th className="p-4 font-medium text-sm">Role</th>
                    <th className="p-4 font-medium text-sm">Organization</th>
                    <th className="p-4 font-medium text-sm">Status</th>
                    <th className="p-4 font-medium text-sm">Last Active</th>
                    <th className="p-4 font-medium text-sm">Incidents</th>
                    <th className="p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{user.role}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <span className="text-sm font-medium">{user.organization}</span>
                          <p className="text-xs text-muted-foreground">{user.location}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${user.status === "Active" ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"} border`}
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{user.incidents}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            👁️
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            ✏️
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            🚫
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderNetwork = () => {
    const networkNodes = [
      {
        id: "NODE-001",
        name: "Bangkok Medical Center",
        type: "Medical",
        status: "Online",
        connections: 45,
        responseTime: "1.2s",
      },
      {
        id: "NODE-002",
        name: "Bali Resort Network",
        type: "Hospitality",
        status: "Online",
        connections: 23,
        responseTime: "0.8s",
      },
      {
        id: "NODE-003",
        name: "Phuket Emergency Services",
        type: "Emergency",
        status: "Online",
        connections: 67,
        responseTime: "2.1s",
      },
      {
        id: "NODE-004",
        name: "Chiang Mai Tour Operators",
        type: "Tourism",
        status: "Maintenance",
        connections: 12,
        responseTime: "N/A",
      },
    ]

    return (
      <div className="space-y-6">
        {/* Network Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Network Overview</h2>
            <p className="text-sm text-muted-foreground">Monitor network health and connectivity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Refresh</Button>
            <Button variant="outline">Network Test</Button>
            <Button>Add Node</Button>
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">94%</div>
              <div className="text-sm text-muted-foreground">Network Uptime</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">147</div>
              <div className="text-sm text-muted-foreground">Active Nodes</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">1.4s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">2,341</div>
              <div className="text-sm text-muted-foreground">Messages Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Network Map Placeholder */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Network Coverage Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/30 rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <p className="text-muted-foreground">Interactive network map will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-1">Showing node locations and connection status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Nodes Table */}
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Network Nodes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border/50">
                  <tr className="text-left">
                    <th className="p-4 font-medium text-sm">Node</th>
                    <th className="p-4 font-medium text-sm">Type</th>
                    <th className="p-4 font-medium text-sm">Status</th>
                    <th className="p-4 font-medium text-sm">Connections</th>
                    <th className="p-4 font-medium text-sm">Response Time</th>
                    <th className="p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {networkNodes.map((node) => (
                    <tr key={node.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <span className="font-medium text-sm">{node.name}</span>
                          <p className="text-xs text-muted-foreground">{node.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline">{node.type}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${
                            node.status === "Online"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : node.status === "Maintenance"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          } border`}
                        >
                          {node.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium">{node.connections}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{node.responseTime}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            📊
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            ⚙️
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            🔄
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        {/* Settings Header */}
        <div>
          <h2 className="text-xl font-semibold">System Settings</h2>
          <p className="text-sm text-muted-foreground">Configure system preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">System Name</label>
                <Input defaultValue="SOS SAFETY by Tourist SOS Network" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Default Language</label>
                <select className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md bg-background">
                  <option>English</option>
                  <option>Thai</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Timezone</label>
                <select className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md bg-background">
                  <option>UTC+7 (Bangkok)</option>
                  <option>UTC+0 (London)</option>
                  <option>UTC-5 (New York)</option>
                </select>
              </div>
              <Button className="w-full">Save General Settings</Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Two-Factor Authentication</div>
                  <div className="text-xs text-muted-foreground">Require 2FA for admin access</div>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">Auto-logout after inactivity</div>
                </div>
                <select className="px-2 py-1 border border-border/50 rounded text-sm bg-background">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">IP Whitelist</div>
                  <div className="text-xs text-muted-foreground">Restrict admin access by IP</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <Button className="w-full">Update Security</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Email Alerts</div>
                  <div className="text-xs text-muted-foreground">Critical incident notifications</div>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">SMS Alerts</div>
                  <div className="text-xs text-muted-foreground">High priority incidents</div>
                </div>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Daily Reports</div>
                  <div className="text-xs text-muted-foreground">Automated daily summaries</div>
                </div>
                <input type="checkbox" className="rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Alert Recipients</label>
                <Input placeholder="admin@touristsos.com" className="mt-1" />
              </div>
              <Button className="w-full">Save Notifications</Button>
            </CardContent>
          </Card>

          {/* System Maintenance */}
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">System Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Database Status</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Healthy - Last backup: 2 hours ago</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">System Version</div>
                <div className="text-sm text-muted-foreground">v2.1.4 - Up to date</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Backup Now
                </Button>
                <Button variant="outline" size="sm">
                  Check Updates
                </Button>
                <Button variant="outline" size="sm">
                  Export Logs
                </Button>
                <Button variant="outline" size="sm">
                  System Health
                </Button>
              </div>
              <Button variant="destructive" className="w-full">
                Restart System
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderCommandCenter = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Live Command Center</h2>
          <p className="text-sm text-muted-foreground">Real-time incident monitoring and emergency response</p>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive">Emergency Broadcast</Button>
          <Button variant="outline">System Alert</Button>
        </div>
      </div>

      {/* Live Status Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔴 Active Incidents
              <Badge className="bg-red-100 text-red-800 border-red-200">3 Critical</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                id: "INC-005",
                type: "Medical Emergency",
                location: "Phuket Beach Resort",
                priority: "Critical",
                time: "2m ago",
                responder: "Dr. Chen",
              },
              {
                id: "INC-006",
                type: "Transport Crisis",
                location: "Bangkok Airport",
                priority: "High",
                time: "8m ago",
                responder: "Transport Team",
              },
              {
                id: "INC-007",
                type: "Security Alert",
                location: "Chiang Mai Market",
                priority: "Medium",
                time: "15m ago",
                responder: "Security Team",
              },
            ].map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 border border-border/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{incident.id}</span>
                    <Badge
                      className={
                        incident.priority === "Critical"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      {incident.priority}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{incident.type}</p>
                  <p className="text-xs text-muted-foreground">{incident.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{incident.responder}</p>
                  <p className="text-xs text-muted-foreground">{incident.time}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button size="sm" variant="outline">
                    Take Control
                  </Button>
                  <Button size="sm" variant="ghost">
                    💬
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              🚨 Send Emergency Alert
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              📢 Network Broadcast
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              🏥 Medical Dispatch
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              🚔 Security Alert
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              📋 Incident Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Broadcast Panel */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Emergency Broadcast System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Broadcast Type</label>
              <select className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md bg-background">
                <option>Network-wide Alert</option>
                <option>Regional Warning</option>
                <option>Medical Emergency</option>
                <option>Security Alert</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority Level</label>
              <select className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md bg-background">
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border border-border/50 rounded-md bg-background"
              rows={3}
              placeholder="Enter emergency broadcast message..."
            />
          </div>
          <div className="flex gap-2">
            <Button variant="destructive">Send Emergency Broadcast</Button>
            <Button variant="outline">Save as Template</Button>
            <Button variant="outline">Preview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Message Templates</h2>
          <p className="text-sm text-muted-foreground">Pre-built emergency response templates</p>
        </div>
        <Button>Create Template</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Medical Emergency", category: "Medical", uses: 45, language: "Multi" },
          { name: "Food Poisoning Alert", category: "Medical", uses: 23, language: "EN/TH" },
          { name: "Transport Delay", category: "Transport", uses: 67, language: "Multi" },
          { name: "Security Incident", category: "Security", uses: 12, language: "EN" },
          { name: "Weather Warning", category: "Safety", uses: 34, language: "Multi" },
          { name: "Hotel Evacuation", category: "Emergency", uses: 8, language: "Multi" },
        ].map((template, index) => (
          <Card key={index} className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm">{template.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {template.category}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    ✏️
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    📋
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Used {template.uses} times</p>
                <p>Languages: {template.language}</p>
              </div>
              <Button size="sm" className="w-full mt-3">
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Performance Analytics</h2>
        <p className="text-sm text-muted-foreground">System performance and response metrics</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2.3m</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
            <div className="text-xs text-green-600 mt-1">↓ 15% vs last week</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">94.2%</div>
            <div className="text-sm text-muted-foreground">Resolution Rate</div>
            <div className="text-xs text-green-600 mt-1">↑ 3% vs last week</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="text-sm text-muted-foreground">User Satisfaction</div>
            <div className="text-xs text-green-600 mt-1">↑ 0.2 vs last week</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">99.1%</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
            <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-muted-foreground">Response time chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/50">
          <CardHeader>
            <CardTitle>Incident Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border/30 rounded-lg">
              <div className="text-center">
                <div className="text-3xl mb-2">🥧</div>
                <p className="text-muted-foreground">Category breakdown chart</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full px-3 py-2 border border-border/50 rounded-md bg-background">
                <option>Incident Summary</option>
                <option>Performance Report</option>
                <option>User Activity</option>
                <option>Compliance Report</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <select className="w-full px-3 py-2 border border-border/50 rounded-md bg-background">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Custom range</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <select className="w-full px-3 py-2 border border-border/50 rounded-md bg-background">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Generate Report</Button>
            <Button variant="outline">Schedule Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Integration Management</h2>
          <p className="text-sm text-muted-foreground">Manage external service connections</p>
        </div>
        <Button>Add Integration</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            name: "WhatsApp Business",
            status: "Connected",
            type: "Communication",
            lastSync: "2m ago",
            health: "Healthy",
          },
          {
            name: "Slack Workspace",
            status: "Connected",
            type: "Communication",
            lastSync: "5m ago",
            health: "Healthy",
          },
          { name: "Bangkok Medical API", status: "Connected", type: "Medical", lastSync: "1m ago", health: "Healthy" },
          { name: "Google Maps API", status: "Connected", type: "Location", lastSync: "30s ago", health: "Healthy" },
          { name: "Stripe Payments", status: "Disconnected", type: "Payment", lastSync: "N/A", health: "Offline" },
          { name: "Twilio SMS", status: "Connected", type: "Communication", lastSync: "3m ago", health: "Warning" },
        ].map((integration, index) => (
          <Card key={index} className="glass-card border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm">{integration.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {integration.type}
                  </Badge>
                </div>
                <Badge
                  className={`${
                    integration.status === "Connected"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  } border`}
                >
                  {integration.status}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Last sync: {integration.lastSync}</p>
                <p
                  className={`${
                    integration.health === "Healthy"
                      ? "text-green-600"
                      : integration.health === "Warning"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  Status: {integration.health}
                </p>
              </div>
              <div className="flex gap-1 mt-3">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Configure
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  🔄
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Management */}
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle>API Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">2,341</div>
                <div className="text-sm text-muted-foreground">API Calls Today</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold">145ms</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">View API Logs</Button>
              <Button variant="outline">Rate Limits</Button>
              <Button variant="outline">Generate API Key</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold gradient-text">
              SOS SAFETY by Tourist SOS
            </Link>
            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Demo Mode</span>
            <Link href="/admin/login" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 bg-background/50 backdrop-blur-sm min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "command", label: "Command Center", icon: "🎯" },
              { id: "incidents", label: "Incidents", icon: "🚨" },
              { id: "users", label: "Users", icon: "👥" },
              { id: "network", label: "Network", icon: "🌐" },
              { id: "templates", label: "Templates", icon: "📝" },
              { id: "analytics", label: "Analytics", icon: "📈" },
              { id: "integrations", label: "Integrations", icon: "🔗" },
              { id: "settings", label: "Settings", icon: "⚙️" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "command" && renderCommandCenter()}
            {activeTab === "incidents" && renderIncidents()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "network" && renderNetwork()}
            {activeTab === "templates" && renderTemplates()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "integrations" && renderIntegrations()}
            {activeTab === "settings" && renderSettings()}
          </div>
        </main>
      </div>
    </div>
  )
}
