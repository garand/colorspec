"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts"
import {
  ActivityIcon,
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CommandIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  FilterIcon,
  HomeIcon,
  Inbox as InboxIcon,
  KeyboardIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  ListChecksIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SettingsIcon,
  StarIcon,
  TrashIcon,
  TrendingUpIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react"

import { cn } from "#/lib/utils.ts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/components/ui/accordion.tsx"
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert.tsx"
import { Avatar, AvatarFallback } from "#/components/ui/avatar.tsx"
import { Badge } from "#/components/ui/badge.tsx"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "#/components/ui/breadcrumb.tsx"
import { Button } from "#/components/ui/button.tsx"
import { Calendar } from "#/components/ui/calendar.tsx"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card.tsx"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "#/components/ui/chart.tsx"
import { Checkbox } from "#/components/ui/checkbox.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "#/components/ui/empty.tsx"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "#/components/ui/field.tsx"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "#/components/ui/hover-card.tsx"
import { Input } from "#/components/ui/input.tsx"
import { Kbd } from "#/components/ui/kbd.tsx"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover.tsx"
import { Progress } from "#/components/ui/progress.tsx"
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx"
import { Separator } from "#/components/ui/separator.tsx"
import { Skeleton } from "#/components/ui/skeleton.tsx"
import { Slider } from "#/components/ui/slider.tsx"
import { Spinner } from "#/components/ui/spinner.tsx"
import { Switch } from "#/components/ui/switch.tsx"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx"
import { Textarea } from "#/components/ui/textarea.tsx"
import { Toggle } from "#/components/ui/toggle.tsx"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "#/components/ui/tooltip.tsx"

const revenueData = [
  { month: "Jan", revenue: 18600, target: 16000 },
  { month: "Feb", revenue: 30500, target: 21000 },
  { month: "Mar", revenue: 23700, target: 26000 },
  { month: "Apr", revenue: 33800, target: 30000 },
  { month: "May", revenue: 21900, target: 33000 },
  { month: "Jun", revenue: 43400, target: 36000 },
  { month: "Jul", revenue: 49500, target: 40000 },
  { month: "Aug", revenue: 54200, target: 43000 },
]

const channelData = [
  { channel: "Direct", visits: 4200 },
  { channel: "Search", visits: 3100 },
  { channel: "Social", visits: 1900 },
  { channel: "Email", visits: 2400 },
  { channel: "Referral", visits: 1500 },
  { channel: "Ads", visits: 2800 },
]

const usageData = [
  { day: "Mon", desktop: 220, mobile: 130 },
  { day: "Tue", desktop: 305, mobile: 200 },
  { day: "Wed", desktop: 237, mobile: 120 },
  { day: "Thu", desktop: 273, mobile: 190 },
  { day: "Fri", desktop: 209, mobile: 230 },
  { day: "Sat", desktop: 314, mobile: 140 },
  { day: "Sun", desktop: 296, mobile: 180 },
]

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  target: { label: "Target", color: "var(--chart-3)" },
} satisfies ChartConfig

const channelChartConfig = {
  visits: { label: "Visits", color: "var(--chart-2)" },
} satisfies ChartConfig

const usageChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig

const tableRows = [
  {
    id: "INV-3201",
    customer: "Acme, Inc.",
    plan: "Enterprise",
    status: "paid" as const,
    amount: "$24,000.00",
    date: "Aug 14",
  },
  {
    id: "INV-3198",
    customer: "Globex Capital",
    plan: "Growth",
    status: "due" as const,
    amount: "$8,400.00",
    date: "Aug 12",
  },
  {
    id: "INV-3194",
    customer: "Initech Labs",
    plan: "Pro",
    status: "paid" as const,
    amount: "$1,200.00",
    date: "Aug 10",
  },
  {
    id: "INV-3187",
    customer: "Soylent Studios",
    plan: "Growth",
    status: "overdue" as const,
    amount: "$3,950.00",
    date: "Aug 06",
  },
  {
    id: "INV-3182",
    customer: "Hooli Foundation",
    plan: "Pro",
    status: "paid" as const,
    amount: "$2,400.00",
    date: "Aug 02",
  },
]

const sidebarLinks = [
  { icon: HomeIcon, label: "Overview", active: true },
  { icon: InboxIcon, label: "Inbox", badge: "12" },
  { icon: LayoutDashboardIcon, label: "Projects" },
  { icon: UsersIcon, label: "Customers" },
  { icon: CreditCardIcon, label: "Billing" },
  { icon: FileTextIcon, label: "Docs" },
  { icon: SettingsIcon, label: "Settings" },
]

const activityItems = [
  { user: "Avery Brooks", initials: "AB", action: "shipped a new release on Aurora", time: "12m" },
  { user: "Priya Patel", initials: "PP", action: "left a comment on Onboarding draft", time: "37m" },
  { user: "Jonas Lee", initials: "JL", action: "marked invoice INV-3187 as overdue", time: "1h" },
  { user: "Mira Saito", initials: "MS", action: "promoted Globex Capital to Enterprise", time: "3h" },
]

const teammates = [
  { name: "Avery Brooks", role: "Engineer", initials: "AB" },
  { name: "Priya Patel", role: "Designer", initials: "PP" },
  { name: "Jonas Lee", role: "Finance", initials: "JL" },
  { name: "Mira Saito", role: "Operations", initials: "MS" },
  { name: "Lin Wei", role: "Support", initials: "LW" },
]

function StatusBadge({ status }: { status: "paid" | "due" | "overdue" }) {
  if (status === "paid") {
    return (
      <Badge variant="secondary" className="gap-1">
        <CheckIcon data-icon="inline-start" />
        Paid
      </Badge>
    )
  }
  if (status === "due") {
    return (
      <Badge variant="outline" className="gap-1">
        <ClockIcon data-icon="inline-start" />
        Due
      </Badge>
    )
  }
  return (
    <Badge variant="destructive" className="gap-1">
      <BellIcon data-icon="inline-start" />
      Overdue
    </Badge>
  )
}

export function SaasPreview() {
  const [tab, setTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [sliderValue, setSliderValue] = useState([62])
  const [progress, setProgress] = useState(72)
  const [notifications, setNotifications] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [billingCycle, setBillingCycle] = useState("annual")
  const [planSelection, setPlanSelection] = useState<Record<string, boolean>>({
    pro: true,
    addOns: false,
    sso: true,
  })
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex min-h-[820px] flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-sm">
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayersIcon className="size-4" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Aurora</span>
            <Badge variant="outline" className="font-normal">
              Enterprise
            </Badge>
          </div>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Revenue</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Forecast</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden gap-2 text-muted-foreground sm:inline-flex"
            >
              <CommandIcon data-icon="inline-start" />
              Search...
              <Kbd className="ml-1">⌘K</Kbd>
            </Button>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <BellIcon />
                  </Button>
                }
              />
              <TooltipContent>Notifications</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="rounded-full p-0">
                    <Avatar className="size-7">
                      <AvatarFallback>AB</AvatarFallback>
                    </Avatar>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon data-icon="inline-start" />
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon data-icon="inline-start" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon data-icon="inline-start" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <KeyboardIcon data-icon="inline-start" />
                    Keyboard shortcuts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LifeBuoyIcon data-icon="inline-start" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOutIcon data-icon="inline-start" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[220px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-1 border-r border-border bg-sidebar p-3 text-sidebar-foreground">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Workspace
            </div>
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <button
                  key={link.label}
                  type="button"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium",
                    link.active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  <span className="flex-1 text-left">{link.label}</span>
                  {link.badge ? (
                    <Badge variant="secondary" className="font-mono">
                      {link.badge}
                    </Badge>
                  ) : null}
                </button>
              )
            })}

            <Separator className="my-3" />

            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Plan
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-card-foreground">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Pro trial</span>
                <Badge variant="outline" className="font-mono">
                  18d
                </Badge>
              </div>
              <Progress value={progress} className="mt-2" />
              <p className="mt-2 text-[11px] text-muted-foreground">
                {progress}% of 100 seats used
              </p>
              <Button
                size="xs"
                className="mt-3 w-full"
                onClick={() => setProgress((value) => Math.min(100, value + 7))}
              >
                Upgrade plan
              </Button>
            </div>
          </aside>

          <main className="flex flex-col gap-4 bg-background p-4">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Q3 forecast
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  Pipeline performance
                </h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Real-time revenue, retention, and channel health for the Aurora workspace.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Toggle aria-label="Toggle filter">
                  <FilterIcon />
                  Filter
                </Toggle>
                <Button variant="outline" size="sm">
                  <CalendarIcon data-icon="inline-start" />
                  Last 30 days
                </Button>
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button size="sm">
                        <PlusIcon data-icon="inline-start" />
                        New invoice
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create invoice</DialogTitle>
                      <DialogDescription>
                        Draft a new invoice. We will autosave changes every 5 seconds.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="invoice-customer">Customer</FieldLabel>
                        <Select defaultValue="acme">
                          <SelectTrigger id="invoice-customer">
                            <SelectValue placeholder="Pick a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acme">Acme, Inc.</SelectItem>
                            <SelectItem value="globex">Globex Capital</SelectItem>
                            <SelectItem value="initech">Initech Labs</SelectItem>
                            <SelectItem value="soylent">Soylent Studios</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="invoice-amount">Amount</FieldLabel>
                        <Input id="invoice-amount" placeholder="$0.00" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="invoice-note">Internal note</FieldLabel>
                        <Textarea id="invoice-note" placeholder="Visible to your team" rows={3} />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <Button variant="ghost">Cancel</Button>
                      <Button>Save draft</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </header>

            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Net revenue"
                value="$284,920"
                delta="+18.2%"
                icon={DollarSignIcon}
                tone="positive"
              />
              <KpiCard
                label="Active accounts"
                value="1,246"
                delta="+4.8%"
                icon={UsersIcon}
                tone="positive"
              />
              <KpiCard
                label="Avg. response"
                value="42s"
                delta="-12s"
                icon={ActivityIcon}
                tone="positive"
              />
              <KpiCard
                label="Churn risk"
                value="3.4%"
                delta="+0.6%"
                icon={ZapIcon}
                tone="warning"
              />
            </section>

            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="flex flex-col gap-4">
                <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue vs. target</CardTitle>
                      <CardDescription>Monthly net revenue compared to forecast.</CardDescription>
                      <CardAction>
                        <Select defaultValue="ytd">
                          <SelectTrigger size="sm" className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ytd">Year to date</SelectItem>
                            <SelectItem value="q3">This quarter</SelectItem>
                            <SelectItem value="m">This month</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={revenueChartConfig} className="h-[260px] w-full">
                        <AreaChart data={revenueData} margin={{ left: 0, right: 8, top: 8 }}>
                          <defs>
                            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--color-target)" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="var(--color-target)" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                          <Area
                            dataKey="target"
                            type="monotone"
                            fill="url(#targetGradient)"
                            stroke="var(--color-target)"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                          />
                          <Area
                            dataKey="revenue"
                            type="monotone"
                            fill="url(#revGradient)"
                            stroke="var(--color-revenue)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top channels</CardTitle>
                      <CardDescription>Last 30 days of acquisition.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={channelChartConfig} className="h-[260px] w-full">
                        <BarChart data={channelData} margin={{ left: 0, right: 8, top: 8 }}>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} />
                          <XAxis
                            dataKey="channel"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="visits" fill="var(--color-visits)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent invoices</CardTitle>
                      <CardDescription>Outstanding balances across your top accounts.</CardDescription>
                      <CardAction>
                        <Button variant="ghost" size="sm">
                          View all
                          <ChevronRightIcon data-icon="inline-end" />
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px] pl-4">Invoice</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Plan</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="pr-4 text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableRows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="pl-4 font-mono text-xs text-muted-foreground">
                                {row.id}
                              </TableCell>
                              <TableCell className="font-medium">{row.customer}</TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">
                                {row.plan}
                              </TableCell>
                              <TableCell className="hidden md:table-cell text-muted-foreground">
                                {row.date}
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={row.status} />
                              </TableCell>
                              <TableCell className="pr-4 text-right font-mono tabular-nums">
                                {row.amount}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Team activity</CardTitle>
                      <CardDescription>Real-time pulse from the Aurora team.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      {activityItems.map((item) => (
                        <div key={item.user} className="flex items-start gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback>{item.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-sm">
                            <p>
                              <HoverCard>
                                <HoverCardTrigger className="font-medium underline-offset-4 hover:underline">
                                  {item.user}
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="size-10">
                                      <AvatarFallback>{item.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-semibold">{item.user}</p>
                                      <p className="text-xs text-muted-foreground">Lead engineer</p>
                                    </div>
                                  </div>
                                  <p className="mt-3 text-xs text-muted-foreground">
                                    Last active just now. Shipped 3 PRs this week.
                                  </p>
                                </HoverCardContent>
                              </HoverCard>{" "}
                              <span className="text-muted-foreground">{item.action}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{item.time} ago</p>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <Button variant="ghost" size="sm" className="self-start">
                        Load more
                        <ArrowUpRightIcon data-icon="inline-end" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Active usage</CardTitle>
                      <CardDescription>Average daily sessions across surfaces.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={usageChartConfig} className="h-[200px] w-full">
                        <LineChart data={usageData} margin={{ left: 0, right: 8, top: 8 }}>
                          <CartesianGrid strokeDasharray="4 4" vertical={false} />
                          <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="desktop"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="mobile"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule</CardTitle>
                      <CardDescription>Pick a date to plan billing.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-lg border border-border p-2"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="flex flex-col gap-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Customer health</CardTitle>
                      <CardDescription>
                        Triage churn risk across your top accounts.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      {teammates.map((member, index) => (
                        <div key={member.name} className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="hidden flex-1 md:block">
                            <Progress value={92 - index * 13} />
                          </div>
                          <Badge variant={index % 2 === 0 ? "secondary" : "outline"}>
                            {index % 2 === 0 ? "Healthy" : "Watch"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button variant="ghost" size="icon-sm">
                                  <MoreHorizontalIcon />
                                </Button>
                              }
                            />
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <UserIcon data-icon="inline-start" />
                                Open profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <StarIcon data-icon="inline-start" />
                                Star
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive">
                                <TrashIcon data-icon="inline-start" />
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Empty pipeline</CardTitle>
                      <CardDescription>You handled every escalation today.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <ListChecksIcon />
                          </EmptyMedia>
                          <EmptyTitle>No escalations</EmptyTitle>
                          <EmptyDescription>
                            All tickets are resolved or scheduled. Take a breath.
                          </EmptyDescription>
                        </EmptyHeader>
                        <Button variant="outline" size="sm">
                          Create playbook
                        </Button>
                      </Empty>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Onboarding tasks</CardTitle>
                    <CardDescription>Three steps to finish a new customer rollout.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion defaultValue={["step-1"]} className="w-full">
                      <AccordionItem value="step-1">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              01
                            </Badge>
                            Provision workspace
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Create a workspace, set up SSO, and invite the rollout team. Owners can adjust
                          permissions later in the admin console.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="step-2">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              02
                            </Badge>
                            Connect data sources
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Pull metrics from Stripe, Hubspot, and Linear. Aurora will hydrate dashboards
                          within five minutes.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="step-3">
                        <AccordionTrigger>
                          <span className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              03
                            </Badge>
                            Configure alerts
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Pick the metrics that matter and route alerts to Slack, email, or PagerDuty
                          for on-call escalation.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="flex flex-col gap-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Workspace settings</CardTitle>
                      <CardDescription>
                        Configure how Aurora behaves for your team.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FieldGroup>
                        <Field>
                          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
                          <Input id="workspace-name" defaultValue="Aurora HQ" />
                          <FieldDescription>
                            Visible to teammates in invites and exports.
                          </FieldDescription>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="workspace-region">Data residency</FieldLabel>
                          <Select defaultValue="us-east">
                            <SelectTrigger id="workspace-region">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us-east">US East (Virginia)</SelectItem>
                              <SelectItem value="us-west">US West (Oregon)</SelectItem>
                              <SelectItem value="eu">EU West (Dublin)</SelectItem>
                              <SelectItem value="ap">Asia Pacific (Tokyo)</SelectItem>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field orientation="horizontal">
                          <div className="flex-1">
                            <FieldLabel htmlFor="auto-update">Auto-update components</FieldLabel>
                            <FieldDescription>
                              Roll out non-breaking releases to your team automatically.
                            </FieldDescription>
                          </div>
                          <Switch
                            id="auto-update"
                            checked={autoUpdate}
                            onCheckedChange={setAutoUpdate}
                          />
                        </Field>
                        <Field orientation="horizontal">
                          <div className="flex-1">
                            <FieldLabel htmlFor="notifications">Daily digest emails</FieldLabel>
                            <FieldDescription>
                              Aurora summarizes account changes once per day.
                            </FieldDescription>
                          </div>
                          <Switch
                            id="notifications"
                            checked={notifications}
                            onCheckedChange={setNotifications}
                          />
                        </Field>
                      </FieldGroup>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Changes save automatically.</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Reset
                        </Button>
                        <Button size="sm">Save changes</Button>
                      </div>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Plan and billing</CardTitle>
                      <CardDescription>Tune entitlements and review usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <FieldSet>
                        <FieldGroup>
                          <RadioGroup value={billingCycle} onValueChange={setBillingCycle}>
                            <Field orientation="horizontal">
                              <RadioGroupItem id="cycle-monthly" value="monthly" />
                              <FieldLabel htmlFor="cycle-monthly">Monthly</FieldLabel>
                              <span className="ml-auto text-xs text-muted-foreground">$24/mo</span>
                            </Field>
                            <Field orientation="horizontal">
                              <RadioGroupItem id="cycle-annual" value="annual" />
                              <FieldLabel htmlFor="cycle-annual">Annual</FieldLabel>
                              <span className="ml-auto text-xs text-muted-foreground">$19/mo</span>
                            </Field>
                          </RadioGroup>
                        </FieldGroup>
                      </FieldSet>

                      <Separator />

                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="addon-pro"
                            checked={planSelection.pro}
                            onCheckedChange={(checked) =>
                              setPlanSelection((previous) => ({ ...previous, pro: Boolean(checked) }))
                            }
                          />
                          <FieldLabel htmlFor="addon-pro">Pro insights</FieldLabel>
                          <Badge variant="secondary" className="ml-auto">
                            Recommended
                          </Badge>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="addon-extras"
                            checked={planSelection.addOns}
                            onCheckedChange={(checked) =>
                              setPlanSelection((previous) => ({ ...previous, addOns: Boolean(checked) }))
                            }
                          />
                          <FieldLabel htmlFor="addon-extras">Advanced playbooks</FieldLabel>
                        </Field>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="addon-sso"
                            checked={planSelection.sso}
                            onCheckedChange={(checked) =>
                              setPlanSelection((previous) => ({ ...previous, sso: Boolean(checked) }))
                            }
                          />
                          <FieldLabel htmlFor="addon-sso">Enterprise SSO</FieldLabel>
                        </Field>
                      </FieldGroup>

                      <Separator />

                      <Field>
                        <FieldLabel>Seat allocation</FieldLabel>
                        <Slider
                          value={sliderValue}
                          onValueChange={(values) => {
                            const next = Array.isArray(values) ? values : [values as number]
                            setSliderValue(next.map((value) => Number(value)))
                          }}
                          max={120}
                          step={5}
                        />
                        <FieldDescription>
                          {sliderValue[0]} of 120 seats reserved
                        </FieldDescription>
                      </Field>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <TrendingUpIcon />
                  <AlertTitle>Annual savings unlocked</AlertTitle>
                  <AlertDescription>
                    Switching to annual billing saves your workspace 21% over the next 12 months.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle>Component gallery</CardTitle>
                    <CardDescription>
                      A quick reference of the most common shadcn building blocks under this scheme.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="link">Link</Button>
                      <Button size="sm">
                        <PlusIcon data-icon="inline-start" />
                        Small
                      </Button>
                      <Button size="icon">
                        <PlusIcon />
                      </Button>
                      <Button disabled>
                        <Spinner data-icon="inline-start" />
                        Loading
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Skeleton
                        </p>
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Popover
                        </p>
                        <Popover>
                          <PopoverTrigger
                            render={<Button variant="outline" size="sm">Open</Button>}
                          />
                          <PopoverContent className="w-56 text-sm">
                            <p className="font-medium">Helpful tip</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Popovers inherit their colors from your scheme.
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Tooltip
                        </p>
                        <Tooltip>
                          <TooltipTrigger
                            render={<Button variant="outline" size="sm">Hover</Button>}
                          />
                          <TooltipContent>Tooltips use --popover</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
          <DialogContent className="overflow-hidden p-0 sm:max-w-md">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Quick search</DialogTitle>
              <DialogDescription>
                Find anything across this workspace. Try a customer or invoice.
              </DialogDescription>
            </DialogHeader>
            <div className="border-y border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
              Try: <Kbd>customer</Kbd> <Kbd>invoice</Kbd> <Kbd>settings</Kbd>
            </div>
            <div className="flex flex-col gap-1 p-2 text-sm">
              {[
                { icon: UsersIcon, label: "Open Customers" },
                { icon: CreditCardIcon, label: "Recent invoices" },
                { icon: SettingsIcon, label: "Workspace settings" },
                { icon: LifeBuoyIcon, label: "Contact support" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setCommandOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent hover:text-accent-foreground"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string
  value: string
  delta: string
  icon: typeof DollarSignIcon
  tone: "positive" | "warning"
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tracking-tight">{value}</CardTitle>
        <CardAction>
          <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex items-center gap-2 bg-muted/30 text-xs">
        <Badge variant={tone === "positive" ? "secondary" : "destructive"} className="gap-1">
          {tone === "positive" ? <ArrowUpRightIcon data-icon="inline-start" /> : <BellIcon data-icon="inline-start" />}
          {delta}
        </Badge>
        <span className="text-muted-foreground">vs prior period</span>
      </CardFooter>
    </Card>
  )
}
