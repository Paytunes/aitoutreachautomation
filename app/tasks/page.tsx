"use client"

import { useState, useEffect } from "react"
import { getTasks, getEmployees } from "@/lib/mock-api"
import type { TaskView } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskView[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [employeeFilter, setEmployeeFilter] = useState("")
  const [employees, setEmployees] = useState<ReturnType<typeof getEmployees>>([])

  const limit = 10

  // Load employees data
  useEffect(() => {
    setEmployees(getEmployees())
  }, [])

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      const result = await getTasks(page, limit, {
        status: statusFilter || undefined,
        employee_id: employeeFilter || undefined,
      })
      setTasks(result.data)
      setTotal(result.total)
      setLoading(false)
    }
    loadTasks()
  }, [page, statusFilter, employeeFilter])

  // Filter by search query
  const filteredTasks = tasks.filter(
    (task) =>
      task.actionable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(total / limit)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 border-green-500/30"
      case "in-progress":
        return "bg-blue-500/10 text-blue-700 border-blue-500/30"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/30"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground">Manage and track task assignments</p>
      </div>

      {/* Filters Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by action or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-background text-foreground border-border"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Employee Filter */}
            <Select
              value={employeeFilter}
              onValueChange={(value) => {
                setEmployeeFilter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-background text-foreground border-border">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("")
                setEmployeeFilter("")
                setPage(1)
              }}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Tasks ({filteredTasks.length} of {total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No tasks found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Action</TableHead>
                      <TableHead className="text-foreground">Description</TableHead>
                      <TableHead className="text-foreground">Employee</TableHead>
                      <TableHead className="text-foreground">Status</TableHead>
                      <TableHead className="text-foreground">Updated</TableHead>
                      <TableHead className="text-foreground">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id} className="border-border hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link href={`/tasks/${task.id}`} className="text-primary hover:underline">
                            {task.actionable.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate" title={task.description}>
                          {task.description || "—"}
                        </TableCell>
                        <TableCell className="text-sm">{task.employee.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(task.task_status)}>
                            {task.task_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(task.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(task.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-muted disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-muted disabled:opacity-50"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
