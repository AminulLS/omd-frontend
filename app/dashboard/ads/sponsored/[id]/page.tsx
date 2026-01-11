'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, BarChart3, Settings, Calendar, FileText, Eye, Plus, Pencil, Trash2, Play, Pause, Upload, Code, Variable, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'

// Filter Types
type FilterRadioOption = { value: string; label: string }
type FilterCheckboxOption = { value: string; label: string }
type AgeRangeRule = { id: string; logic: '=' | '!=' | '>' | '>=' | '<' | '<='; value: string }

type Schedule = {
    id: number
    name: string
    startTime: string
    endTime: string
    days: string[]
    status: 'active' | 'paused'
    cpc: number
    spend: number
    balance: number
}

// Mock ad data
const mockAdData = {
    id: '1',
    name: 'Summer Sale Campaign 2024',
    partner: 'Partner 1',
    partnerId: 1,
    title: 'Ad Title 1',
    placement: 'Homepage Banner',
    nickname: 'Summer Banner',
    uniqueId: 'ID-ABC123',
    status: 'active',
    country: 'US',
    dailyBudget: 150.00,
    description: 'Promotional campaign for summer sale with special discounts on all products.',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
}

// Mock stats data
const mockStatsData = [
    { date: '01/09/2026', impressions: 45230, clicks: 1234, ctr: 2.73, revenue: 245.67 },
    { date: '01/10/2026', impressions: 48120, clicks: 1456, ctr: 3.03, revenue: 298.45 },
    { date: '01/11/2026', impressions: 44560, clicks: 1189, ctr: 2.67, revenue: 212.34 },
    { date: '01/12/2026', impressions: 51230, clicks: 1567, ctr: 3.06, revenue: 312.56 },
    { date: '01/13/2026', impressions: 47890, clicks: 1345, ctr: 2.81, revenue: 267.89 },
    { date: '01/14/2026', impressions: 49340, clicks: 1423, ctr: 2.88, revenue: 278.90 },
    { date: '01/15/2026', impressions: 50670, clicks: 1523, ctr: 3.01, revenue: 301.23 },
]

// Default schedules data
const defaultSchedulesData: Schedule[] = [
    { id: 1, name: 'Morning Rush', startTime: '06:00', endTime: '10:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'active', cpc: 0.50, spend: 125.50, balance: 500.00 },
    { id: 2, name: 'Weekend Blast', startTime: '09:00', endTime: '23:59', days: ['Sat', 'Sun'], status: 'active', cpc: 0.75, spend: 340.25, balance: 250.00 },
    { id: 3, name: 'Evening Commute', startTime: '17:00', endTime: '20:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], status: 'paused', cpc: 0.45, spend: 87.30, balance: 1000.00 },
]

// Mock audit logs data
const mockAuditLogsData = [
    { id: 1, action: 'Status changed', details: 'Changed from paused to active', user: 'John Doe', timestamp: '2024-01-15 14:32:00' },
    { id: 2, action: 'Budget updated', details: 'Daily budget increased from $100 to $150', user: 'Jane Smith', timestamp: '2024-01-14 09:15:00' },
    { id: 3, action: 'Ad modified', details: 'Updated title and description', user: 'John Doe', timestamp: '2024-01-13 16:45:00' },
    { id: 4, action: 'Schedule added', details: 'Added new schedule: Morning Rush', user: 'Jane Smith', timestamp: '2024-01-12 11:20:00' },
    { id: 5, action: 'Created', details: 'Campaign created', user: 'John Doe', timestamp: '2024-01-01 08:00:00' },
]

const countries = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' },
]

const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'paused', label: 'Paused' },
]

const weekDays = [
    { value: 'Mon', label: 'Monday' },
    { value: 'Tue', label: 'Tuesday' },
    { value: 'Wed', label: 'Wednesday' },
    { value: 'Thu', label: 'Thursday' },
    { value: 'Fri', label: 'Friday' },
    { value: 'Sat', label: 'Saturday' },
    { value: 'Sun', label: 'Sunday' },
]

// Ad Settings Constants
const adStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'archive', label: 'Archive' },
]

const pricingTypes = [
    { value: 'cpc', label: 'CPC (Cost Per Click)' },
    { value: 'tcpa', label: 'TCPA (Target CPA)' },
    { value: 'cpa', label: 'CPA (True CPA)' },
    { value: 'rsoc', label: 'RSOC (API Rev)' },
    { value: 'auto', label: 'Auto (Rev Event)' },
]

const imagePriorities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
]

const boardPlacements = [
    { value: 'top', label: 'Top' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'footer', label: 'Footer' },
    { value: 'featured', label: 'Featured' },
]

// Board codes for multi-select (A-Z)
const boardCodes = [
    { value: 'ALL', label: 'All Boards' },
    { value: 'ABC', label: 'ABC' },
    { value: 'DEF', label: 'DEF' },
    { value: 'GHI', label: 'GHI' },
    { value: 'JKL', label: 'JKL' },
    { value: 'MNO', label: 'MNO' },
    { value: 'PQR', label: 'PQR' },
    { value: 'STU', label: 'STU' },
    { value: 'VWX', label: 'VWX' },
    { value: 'YZ', label: 'YZ' },
]

// ========== FILTER CONSTANTS ==========

// User Type Options
const userTypeOptions: FilterRadioOption[] = [
    { value: 'mixed', label: 'Mixed (Uniques/Duplicates)' },
    { value: 'uniques', label: 'Uniques Only' },
    { value: 'duplicates', label: 'Duplicates Only' },
]

// Gender Options
const genderOptions: FilterRadioOption[] = [
    { value: 'any', label: 'Any (Male/Female/Non-Binary)' },
    { value: 'male', label: 'Only Males' },
    { value: 'female', label: 'Only Females' },
]

// Prepop Options
const prepopOptions: FilterRadioOption[] = [
    { value: 'no', label: 'Any Traffic' },
    { value: 'yes', label: 'Only Prepop' },
    { value: 'none', label: 'Only Non-Prepop' },
]

// Education Options
const educationOptions: FilterRadioOption[] = [
    { value: 'all', label: 'All' },
    { value: 'yes', label: 'Yes' },
    { value: 'yes_or_maybe', label: 'Yes or Maybe' },
    { value: 'no', label: 'No' },
]

// Device Options
const deviceOptions: FilterRadioOption[] = [
    { value: 'all', label: 'All' },
    { value: 'mobile_only', label: 'Mobile Only' },
    { value: 'desktop_only', label: 'Desktop Only' },
]

// Browser Language Options
const browserLanguageOptions: FilterRadioOption[] = [
    { value: 'all', label: 'All' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
]

// Employment Status Options
const employmentStatusOptions: FilterCheckboxOption[] = [
    { value: 'employed', label: 'Employed' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'disability', label: 'Disability' },
    { value: 'student', label: 'Student' },
    { value: 'retired', label: 'Retired' },
]

// Mobile OS Options
const mobileOsOptions: FilterCheckboxOption[] = [
    { value: 'ios', label: 'iOS' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'other_android', label: 'Other Android' },
]

// Age Range Logic Options
const ageLogicOptions = [
    { value: '=', label: 'Equals (=)' },
    { value: '!=', label: 'Not Equals (!=)' },
    { value: '>', label: 'Greater Than (>)' },
    { value: '>=', label: 'Greater or Equal (>=)' },
    { value: '<', label: 'Less Than (<)' },
    { value: '<=', label: 'Less or Equal (<=)' },
]

// ========== REUSABLE FILTER COMPONENTS ==========

interface FilterSectionProps {
    title: string
    description?: string
    children: React.ReactNode
}

const FilterSection = ({ title, description, children }: FilterSectionProps) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
)

interface FilterRadioProps {
    label: string
    value: string
    options: FilterRadioOption[]
    onChange: (value: string) => void
}

const FilterRadio = ({ label, value, options, onChange }: FilterRadioProps) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={label}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="w-4 h-4 text-primary border-border"
                        />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>
        </FieldContent>
    </Field>
)

interface FilterCheckboxGroupProps {
    label: string
    value: string[]
    options: FilterCheckboxOption[]
    onChange: (value: string) => void
}

const FilterCheckboxGroup = ({ label, value, options, onChange }: FilterCheckboxGroupProps) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            value={option.value}
                            checked={value.includes(option.value)}
                            onChange={() => onChange(option.value)}
                            className="w-4 h-4 text-primary border-border rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                    </label>
                ))}
            </div>
        </FieldContent>
    </Field>
)

interface FilterTextareaProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const FilterTextarea = ({ label, value, onChange, placeholder }: FilterTextareaProps) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || 'Enter comma-separated values'}
                rows={2}
            />
        </FieldContent>
    </Field>
)

interface FilterSwitchProps {
    label: string
    value: boolean
    onChange: (value: boolean) => void
    description?: string
}

const FilterSwitch = ({ label, value, onChange, description }: FilterSwitchProps) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
            <div className="flex items-center gap-2">
                <Switch checked={value} onCheckedChange={onChange} />
                <span className="text-sm text-muted-foreground">
                    {value ? 'Enabled' : 'Disabled'}
                </span>
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </FieldContent>
    </Field>
)

interface FilterFileProps {
    label: string
    file: File | null
    onChange: (file: File | null) => void
    accept?: string
}

const FilterFile = ({ label, file, onChange, accept }: FilterFileProps) => (
    <Field>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                {file ? (
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onChange(null)}
                        >
                            Remove
                        </Button>
                    </div>
                ) : (
                    <label className="space-y-2 cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                        <input
                            type="file"
                            className="hidden"
                            accept={accept || '.csv,.txt'}
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    onChange(e.target.files[0])
                                }
                            }}
                        />
                    </label>
                )}
            </div>
        </FieldContent>
    </Field>
)

interface AgeRangeRepeaterProps {
    rules: AgeRangeRule[]
    onAdd: () => void
    onUpdate: (id: string, field: 'logic' | 'value', value: string) => void
    onRemove: (id: string) => void
}

const AgeRangeRepeater = ({ rules, onAdd, onUpdate, onRemove }: AgeRangeRepeaterProps) => (
    <Field>
        <div className="flex items-center justify-between">
            <FieldLabel>Age Ranges</FieldLabel>
            <Button type="button" variant="outline" size="sm" onClick={onAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Add Rule
            </Button>
        </div>
        <FieldContent>
            {rules.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No age rules configured. Click "Add Rule" to create one.
                </p>
            ) : (
                <div className="space-y-2">
                    {rules.map((rule) => (
                        <div key={rule.id} className="flex items-center gap-2">
                            <Select
                                value={rule.logic}
                                onValueChange={(value) => onUpdate(rule.id, 'logic', value)}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ageLogicOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                min="0"
                                max="120"
                                placeholder="Age"
                                value={rule.value}
                                onChange={(e) => onUpdate(rule.id, 'value', e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => onRemove(rule.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </FieldContent>
    </Field>
)

export default function SponsoredAdDetailsPage() {
    const params = useParams()
    const adId = params.id as string

    const [formData, setFormData] = useState({
        name: mockAdData.name,
        partner: mockAdData.partnerId.toString(),
        title: mockAdData.title,
        placement: mockAdData.placement,
        nickname: mockAdData.nickname,
        country: mockAdData.country,
        status: mockAdData.status,
        dailyBudget: mockAdData.dailyBudget.toString(),
        description: mockAdData.description,
    })

    // Settings sections state
    const [settingsData, setSettingsData] = useState({
        // General
        adStatus: 'pending',
        trackingId: '',
        category: '',
        nickname: '',
        publicNickname: '',
        notes: '',
        // Clicks
        pricingType: 'cpc',
        noClickTcpaAlg: false,
        duplicateWindow: '24',
        // Details
        title: '',
        copy: '',
        companyName: '',
        adImage: null as File | null,
        imagePriority: 'medium',
        originalUrl: '',
        // Prepop Data
        appendHashedUserData: false,
        hashedKey: '',
        // Board Filters
        countrySpecific: 'US',
        selectedBoards: [] as string[],
        boardPlacement: 'top',
    })

    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Schedule state
    const [schedules, setSchedules] = useState<Record<number, Schedule>>(() => {
        const record: Record<number, Schedule> = {}
        defaultSchedulesData.forEach(s => record[s.id] = s)
        return record
    })
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
    const [scheduleForm, setScheduleForm] = useState({
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        days: [] as string[],
        status: 'active' as 'active' | 'paused',
        cpc: '0.50',
        spend: '0.00',
        balance: '0.00',
    })
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null)

    // ========== FILTERS STATE ==========
    const [filtersData, setFiltersData] = useState({
        // User Demographics
        userType: 'mixed',
        gender: 'any',
        ageRanges: [] as AgeRangeRule[],

        // Traffic Type
        prepop: 'no',

        // Keywords
        keywordsShow: '',
        keywordsHide: '',

        // Source
        sourceShow: '',
        sourceHide: '',
        sourceHideOwnSource: false,
        sourceWildcardShow: '',
        sourceWildcardHide: '',

        // Mediums
        mediumsShow: '',
        mediumsHide: '',

        // Companies
        companiesShow: '',
        companiesHide: '',

        // Location
        zipsShow: '',
        zipsHide: '',
        zipsShowFile: null as File | null,
        zipsHideFile: null as File | null,
        statesShow: '',
        statesHide: '',

        // User Attributes
        education: 'all',
        device: 'all',
        browserLanguage: 'all',
        employmentStatus: [] as string[],
        mobileOs: [] as string[],
    })

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [adId])

    const handleSave = async () => {
        setIsSaving(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsSaving(false)
    }

    // Schedule handlers
    const openAddSchedule = () => {
        setEditingSchedule(null)
        setScheduleForm({
            name: '',
            startTime: '09:00',
            endTime: '17:00',
            days: [],
            status: 'active',
            cpc: '0.50',
            spend: '0.00',
            balance: '0.00',
        })
        setScheduleDialogOpen(true)
    }

    const openEditSchedule = (schedule: Schedule) => {
        setEditingSchedule(schedule)
        setScheduleForm({
            name: schedule.name,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            days: [...schedule.days],
            status: schedule.status,
            cpc: schedule.cpc.toString(),
            spend: schedule.spend.toString(),
            balance: schedule.balance.toString(),
        })
        setScheduleDialogOpen(true)
    }

    const handleSaveSchedule = () => {
        if (editingSchedule) {
            // Update existing
            setSchedules(prev => ({
                ...prev,
                [editingSchedule.id]: {
                    ...editingSchedule,
                    name: scheduleForm.name,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    days: scheduleForm.days,
                    status: scheduleForm.status,
                    cpc: parseFloat(scheduleForm.cpc) || 0,
                    spend: parseFloat(scheduleForm.spend) || 0,
                    balance: parseFloat(scheduleForm.balance) || 0,
                },
            }))
        } else {
            // Add new
            const newId = Math.max(...Object.keys(schedules).map(Number), 0) + 1
            setSchedules(prev => ({
                ...prev,
                [newId]: {
                    id: newId,
                    name: scheduleForm.name,
                    startTime: scheduleForm.startTime,
                    endTime: scheduleForm.endTime,
                    days: scheduleForm.days,
                    status: scheduleForm.status,
                    cpc: parseFloat(scheduleForm.cpc) || 0,
                    spend: parseFloat(scheduleForm.spend) || 0,
                    balance: parseFloat(scheduleForm.balance) || 0,
                },
            }))
        }
        setScheduleDialogOpen(false)
        setEditingSchedule(null)
    }

    const openDeleteSchedule = (id: number) => {
        setScheduleToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteSchedule = () => {
        if (scheduleToDelete) {
            setSchedules(prev => {
                const newSchedules = { ...prev }
                delete newSchedules[scheduleToDelete]
                return newSchedules
            })
        }
        setDeleteDialogOpen(false)
        setScheduleToDelete(null)
    }

    const toggleScheduleStatus = (id: number) => {
        setSchedules(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                status: prev[id].status === 'active' ? 'paused' : 'active',
            },
        }))
    }

    const toggleDay = (dayValue: string) => {
        setScheduleForm(prev => ({
            ...prev,
            days: prev.days.includes(dayValue)
                ? prev.days.filter(d => d !== dayValue)
                : [...prev.days, dayValue],
        }))
    }

    // Toggle board selection
    const toggleBoard = (boardValue: string) => {
        setSettingsData(prev => {
            if (boardValue === 'ALL') {
                return { ...prev, selectedBoards: ['ALL'] }
            }
            const newBoards = prev.selectedBoards.includes(boardValue)
                ? prev.selectedBoards.filter(b => b !== boardValue)
                : [...prev.selectedBoards.filter(b => b !== 'ALL'), boardValue]
            return { ...prev, selectedBoards: newBoards }
        })
    }

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSettingsData(prev => ({ ...prev, adImage: e.target.files![0] }))
        }
    }

    // ========== FILTERS HELPER FUNCTIONS ==========

    // Update filter field
    const updateFilter = <K extends keyof typeof filtersData>(key: K, value: typeof filtersData[K]) => {
        setFiltersData(prev => ({ ...prev, [key]: value }))
    }

    // Toggle checkbox in filter array
    const toggleFilterCheckbox = (key: 'employmentStatus' | 'mobileOs', value: string) => {
        setFiltersData(prev => ({
            ...prev,
            [key]: prev[key].includes(value)
                ? prev[key].filter(v => v !== value)
                : [...prev[key], value],
        }))
    }

    // Add age range rule
    const addAgeRangeRule = () => {
        setFiltersData(prev => ({
            ...prev,
            ageRanges: [...prev.ageRanges, { id: Date.now().toString(), logic: '=', value: '' }],
        }))
    }

    // Update age range rule
    const updateAgeRangeRule = (id: string, field: 'logic' | 'value', value: string) => {
        setFiltersData(prev => ({
            ...prev,
            ageRanges: prev.ageRanges.map(rule =>
                rule.id === id ? { ...rule, [field]: value } : rule
            ),
        }))
    }

    // Remove age range rule
    const removeAgeRangeRule = (id: string) => {
        setFiltersData(prev => ({
            ...prev,
            ageRanges: prev.ageRanges.filter(rule => rule.id !== id),
        }))
    }

    // Handle file upload for filters
    const handleFilterFileUpload = (key: 'zipsShowFile' | 'zipsHideFile', file: File | null) => {
        setFiltersData(prev => ({ ...prev, [key]: file }))
    }

    // Variable syntax hint for display
    const varSyntax = '{{ variable_name }}'

    // All variables organized by category
    const allVariables = {
        general: [
            { name: '##COMPANY##', description: 'Company (if we have it, if not its the ##SEARCH##)' },
            { name: '##SEARCH##', description: 'Search' },
            { name: '##SEARCH_LOWER##', description: 'Search Lowercase' },
            { name: '##ZIP##', description: 'Zip' },
            { name: '##STATE##', description: 'State' },
            { name: '##BOARD##', description: 'Board' },
            { name: '##SID##', description: 'SID (Encoded Source)' },
            { name: '##ORIGIN##', description: 'ORIGIN (NOT Encoded Source)' },
            { name: '##CID##', description: 'CID (for CID campaigns)' },
            { name: '##SALARYRANGE_1##', description: 'Salary Range 0-10 - 12-15 $' },
            { name: '##SALARYRANGE_2##', description: 'Salary Range 10-20 - 22-25 $' },
            { name: '##SALARYRANGE_3##', description: 'Salary Range 20-30 - 32-45 $' },
            { name: '##MONEY_1##', description: 'Money 20-100' },
            { name: '##MONEY_2##', description: 'Money 100-200' },
            { name: '##MONEY_3##', description: 'Money 201-500' },
            { name: '##TRANSACTIONID##', description: 'Generated Transaction ID' },
            { name: '##TIMESTAMP##', description: 'Unix Timestamp' },
            { name: '##MONTH##', description: 'Month (format: 01-012)' },
            { name: '##LINK##', description: 'Embed link url' },
        ],
        prepop: [
            { name: '##FIRSTNAME##', description: 'First Name (if not available "Job seeker")' },
            { name: '##LASTNAME##', description: 'Last Name' },
            { name: '##PHONE##', description: 'Phone' },
            { name: '##EMAIL##', description: 'Email' },
            { name: '##DOB##', description: 'Date of birth' },
            { name: '##DOBYEAR##', description: 'Date of birth\'s year' },
            { name: '##DOBMONTH##', description: 'Date of birth\'s month' },
            { name: '##DOBDAY##', description: 'Date of birth\'s day' },
            { name: '##VOLCID##', description: 'VOLUUM CLICK ID' },
            { name: '##LISTICLEID##', description: 'Listicle ID' },
            { name: '##GENDER##', description: 'Gender' },
            { name: '##SSDI##', description: 'SSDI' },
            { name: '##HASHUSERDATA##', description: 'URL encoded Encrypted' },
            { name: '##USERDATA##', description: 'URL encoded NOT Encrypted' },
            { name: '##DYNHASHDATA##', description: 'OpenSSL Encrypted Data (MUST HAVE ##DYNHASHIV##)' },
            { name: '##DYNHASHIV##', description: 'OpenSSL IV salt (Requires OpenSSL secret key)' },
            { name: '##MJHENCRYPT##', description: 'OpenSSL Encrypt For My Job Helper' },
            { name: '##LISTICLEPIIHASH##', description: 'OpenSSL Encrypt LISTICLES' },
        ],
    }

    const [variableSearch, setVariableSearch] = useState('')
    const [variableCategory, setVariableCategory] = useState<'general' | 'prepop'>('general')
    const [copiedVariable, setCopiedVariable] = useState<string | null>(null)
    const [variablesModalOpen, setVariablesModalOpen] = useState(false)

    // Filter variables based on search
    const filteredVariables = Object.entries(allVariables).reduce((acc, [category, variables]) => {
        acc[category as keyof typeof allVariables] = variables.filter(v =>
            v.name.toLowerCase().includes(variableSearch.toLowerCase()) ||
            v.description.toLowerCase().includes(variableSearch.toLowerCase())
        )
        return acc
    }, {} as typeof allVariables)

    // Copy variable to clipboard
    const copyVariable = async (variableName: string) => {
        try {
            await navigator.clipboard.writeText(variableName)
            setCopiedVariable(variableName)
            setTimeout(() => setCopiedVariable(null), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Loading ad details...</div>
            </div>
        )
    }

    const scheduleList = Object.values(schedules)

    return (
        <div className="flex flex-col gap-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/ads/sponsored">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold">{mockAdData.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            ID: {mockAdData.uniqueId} • Partner: {mockAdData.partner}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant={mockAdData.status === 'active' ? 'default' : mockAdData.status === 'paused' ? 'destructive' : 'secondary'}
                    >
                        {mockAdData.status}
                    </Badge>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Tabbed Sections */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="stats" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="stats">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Stats
                            </TabsTrigger>
                            <TabsTrigger value="settings">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </TabsTrigger>
                            <TabsTrigger value="schedules">
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedules
                            </TabsTrigger>
                            <TabsTrigger value="filters">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </TabsTrigger>
                            <TabsTrigger value="audit-logs">
                                <FileText className="h-4 w-4 mr-2" />
                                Audit Logs
                            </TabsTrigger>
                        </TabsList>

                        {/* Stats Tab */}
                        <TabsContent value="stats">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Stats</CardTitle>
                                    <CardDescription>View your ad&apos;s performance metrics over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Impressions</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.impressions, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Clicks</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.clicks, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Avg CTR</div>
                                            <div className="text-2xl font-bold">
                                                {(mockStatsData.reduce((acc, row) => acc + row.ctr, 0) / mockStatsData.length).toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="border rounded-lg p-4">
                                            <div className="text-sm text-muted-foreground">Total Revenue</div>
                                            <div className="text-2xl font-bold">
                                                ${mockStatsData.reduce((acc, row) => acc + row.revenue, 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Impressions</TableHead>
                                                <TableHead>Clicks</TableHead>
                                                <TableHead>CTR</TableHead>
                                                <TableHead>Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockStatsData.map((stat, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{stat.date}</TableCell>
                                                    <TableCell>{stat.impressions.toLocaleString()}</TableCell>
                                                    <TableCell>{stat.clicks.toLocaleString()}</TableCell>
                                                    <TableCell>{stat.ctr}%</TableCell>
                                                    <TableCell>${stat.revenue.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Settings Tab */}
                        <TabsContent value="settings">
                            <div className="space-y-4">
                                {/* General Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>General</CardTitle>
                                        <CardDescription>Status, Tracking, Category, Notes</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Status</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={settingsData.adStatus}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, adStatus: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {adStatuses.map((status) => (
                                                                    <SelectItem key={status.value} value={status.value}>
                                                                        {status.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Tracking ID</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.trackingId}
                                                            onChange={(e) => setSettingsData({ ...settingsData, trackingId: e.target.value })}
                                                            placeholder="Enter tracking ID"
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Category</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.category}
                                                            onChange={(e) => setSettingsData({ ...settingsData, category: e.target.value })}
                                                            placeholder="Enter category"
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Nickname</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.nickname}
                                                            onChange={(e) => setSettingsData({ ...settingsData, nickname: e.target.value })}
                                                            placeholder="Enter internal nickname"
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Public Nickname</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.publicNickname}
                                                            onChange={(e) => setSettingsData({ ...settingsData, publicNickname: e.target.value })}
                                                            placeholder="Enter public nickname"
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Notes</FieldLabel>
                                                    <FieldContent>
                                                        <Textarea
                                                            value={settingsData.notes}
                                                            onChange={(e) => setSettingsData({ ...settingsData, notes: e.target.value })}
                                                            placeholder="Enter notes"
                                                            rows={3}
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Clicks Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clicks</CardTitle>
                                        <CardDescription>Pricing, TCPA Algorithm, Duplicate Window</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Pricing Type</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={settingsData.pricingType}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, pricingType: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {pricingTypes.map((type) => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Duplicate Window</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            value={settingsData.duplicateWindow}
                                                            onChange={(e) => setSettingsData({ ...settingsData, duplicateWindow: e.target.value })}
                                                            placeholder="24"
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1">Hours to consider clicks as duplicates</p>
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>No Click TCPA Algorithm</FieldLabel>
                                                    <FieldContent>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={settingsData.noClickTcpaAlg}
                                                                onCheckedChange={(checked) => setSettingsData({ ...settingsData, noClickTcpaAlg: checked })}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {settingsData.noClickTcpaAlg ? 'Active' : 'Not Active'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">Enable/disable TCPA algorithm for non-click conversions</p>
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Details Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Details</CardTitle>
                                        <CardDescription>Title, Copy, Image, URL</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <div className="flex items-center justify-between">
                                                        <FieldLabel>Title</FieldLabel>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setVariablesModalOpen(true)}
                                                            title="View available variables"
                                                            type="button"
                                                        >
                                                            <Variable className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.title}
                                                            onChange={(e) => setSettingsData({ ...settingsData, title: e.target.value })}
                                                            placeholder="Enter ad title"
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <div className="flex items-center justify-between">
                                                        <FieldLabel>Copy</FieldLabel>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setVariablesModalOpen(true)}
                                                            title="View available variables"
                                                            type="button"
                                                        >
                                                            <Variable className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <FieldContent>
                                                        <Textarea
                                                            value={settingsData.copy}
                                                            onChange={(e) => setSettingsData({ ...settingsData, copy: e.target.value })}
                                                            placeholder="Enter ad copy"
                                                            rows={3}
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Company Name</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.companyName}
                                                            onChange={(e) => setSettingsData({ ...settingsData, companyName: e.target.value })}
                                                            placeholder="Enter company name"
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <div className="flex items-center justify-between">
                                                        <FieldLabel>Original URL</FieldLabel>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setVariablesModalOpen(true)}
                                                            title="View available variables"
                                                            type="button"
                                                        >
                                                            <Variable className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.originalUrl}
                                                            onChange={(e) => setSettingsData({ ...settingsData, originalUrl: e.target.value })}
                                                            placeholder="https://example.com"
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Ad Image</FieldLabel>
                                                    <FieldContent>
                                                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                                                            {settingsData.adImage ? (
                                                                <div className="space-y-2">
                                                                    <p className="text-sm font-medium">{settingsData.adImage.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{(settingsData.adImage.size / 1024).toFixed(2)} KB</p>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setSettingsData({ ...settingsData, adImage: null })}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <label className="space-y-2 cursor-pointer">
                                                                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                                                                    <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                                                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        onChange={handleImageUpload}
                                                                    />
                                                                </label>
                                                            )}
                                                        </div>
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Image Priority</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={settingsData.imagePriority}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, imagePriority: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {imagePriorities.map((priority) => (
                                                                    <SelectItem key={priority.value} value={priority.value}>
                                                                        {priority.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Prepop Data Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Prepop Data</CardTitle>
                                        <CardDescription>Hashed User Data, OpenSSL</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Append Hashed User Data (OpenSSL)</FieldLabel>
                                                    <FieldContent>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={settingsData.appendHashedUserData}
                                                                onCheckedChange={(checked) => setSettingsData({ ...settingsData, appendHashedUserData: checked })}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {settingsData.appendHashedUserData ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">Automatically append hashed user data to URLs</p>
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Hashed Key</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.hashedKey}
                                                            onChange={(e) => setSettingsData({ ...settingsData, hashedKey: e.target.value })}
                                                            placeholder="Enter hashed key"
                                                            type="password"
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1">OpenSSL key for hashing user data</p>
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Board Filters Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Board Filters</CardTitle>
                                        <CardDescription>Country, Boards, Placement</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Country Specific</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={settingsData.countrySpecific}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, countrySpecific: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countries.map((country) => (
                                                                    <SelectItem key={country.value} value={country.value}>
                                                                        {country.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Board Placement</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={settingsData.boardPlacement}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, boardPlacement: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {boardPlacements.map((placement) => (
                                                                    <SelectItem key={placement.value} value={placement.value}>
                                                                        {placement.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Boards (Multi-select)</FieldLabel>
                                                    <FieldContent>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-between">
                                                                    <span>
                                                                        {settingsData.selectedBoards.length > 0
                                                                            ? `${settingsData.selectedBoards.length} board${settingsData.selectedBoards.length > 1 ? 's' : ''} selected`
                                                                            : 'Select boards'}
                                                                    </span>
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-full p-0" align="start">
                                                                <div className="max-h-60 overflow-y-auto p-2">
                                                                    {boardCodes.map((board) => (
                                                                        <div
                                                                            key={board.value}
                                                                            className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                                                                            onClick={() => toggleBoard(board.value)}
                                                                        >
                                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                                                                settingsData.selectedBoards.includes(board.value)
                                                                                    ? 'bg-primary border-primary'
                                                                                    : 'border-border'
                                                                            }`}>
                                                                                {settingsData.selectedBoards.includes(board.value) && (
                                                                                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                )}
                                                                            </div>
                                                                            <span className="flex-1 text-sm">
                                                                                {board.label}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Selected: {settingsData.selectedBoards.length > 0 ? settingsData.selectedBoards.join(', ') : 'None'}
                                                        </p>
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Variables Modal */}
                                <Dialog open={variablesModalOpen} onOpenChange={setVariablesModalOpen}>
                                    <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <Variable className="h-5 w-5" />
                                                Available Variables
                                            </DialogTitle>
                                            <DialogDescription>
                                                Click on any variable to copy it to your clipboard. Use these variables in title, copy, and URL fields.
                                            </DialogDescription>
                                        </DialogHeader>

                                        {/* Search */}
                                        <div className="mb-4">
                                            <Input
                                                placeholder="Search variables..."
                                                value={variableSearch}
                                                onChange={(e) => setVariableSearch(e.target.value)}
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Category Tabs */}
                                        <Tabs value={variableCategory} onValueChange={(v) => setVariableCategory(v as 'general' | 'prepop')} className="mb-4">
                                            <TabsList>
                                                <TabsTrigger value="general">General</TabsTrigger>
                                                <TabsTrigger value="prepop">PrePop Data</TabsTrigger>
                                            </TabsList>
                                        </Tabs>

                                        {/* Variables Table */}
                                        <div className="flex-1 overflow-y-auto border">
                                            <Table>
                                                <TableBody>
                                                    {filteredVariables[variableCategory].map((variable) => (
                                                        <TableRow
                                                            key={variable.name}
                                                            className="cursor-pointer hover:bg-muted/50"
                                                            onClick={() => copyVariable(variable.name)}
                                                        >
                                                            <TableCell className="py-3">
                                                                <div className="flex items-start gap-2">
                                                                    <code className="text-sm font-mono bg-muted px-2 py-1">
                                                                        {variable.name}
                                                                        {copiedVariable === variable.name && (
                                                                            <span className="ml-2 text-green-600 text-xs font-normal">
                                                                                ✓ Copied!
                                                                            </span>
                                                                        )}
                                                                    </code>
                                                                </div>
                                                                <p className="text-xs text-muted-foreground mt-1">{variable.description}</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {filteredVariables[variableCategory].length === 0 && (
                                                        <TableRow>
                                                            <TableCell className="text-center py-8 text-muted-foreground">
                                                                No variables found matching &quot;{variableSearch}&quot;
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Count Display */}
                                        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                Showing {filteredVariables[variableCategory].length} of {allVariables[variableCategory].length} {variableCategory} variables
                                            </span>
                                            {copiedVariable && (
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Copied {copiedVariable}
                                                </span>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </TabsContent>

                        {/* Schedules Tab */}
                        <TabsContent value="schedules">
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Ad Schedules</CardTitle>
                                            <CardDescription>Manage when your ads are displayed</CardDescription>
                                        </div>
                                        <Button onClick={openAddSchedule} size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Schedule
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {scheduleList.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No schedules configured. Click "Add Schedule" to create one.
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Start Time</TableHead>
                                                    <TableHead>End Time</TableHead>
                                                    <TableHead>Days</TableHead>
                                                    <TableHead>CPC</TableHead>
                                                    <TableHead>Spend</TableHead>
                                                    <TableHead>Balance</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {scheduleList.map((schedule) => (
                                                    <TableRow key={schedule.id}>
                                                        <TableCell className="font-medium">{schedule.name}</TableCell>
                                                        <TableCell>{schedule.startTime}</TableCell>
                                                        <TableCell>{schedule.endTime}</TableCell>
                                                        <TableCell>{schedule.days.join(', ')}</TableCell>
                                                        <TableCell>${schedule.cpc.toFixed(2)}</TableCell>
                                                        <TableCell>${schedule.spend.toFixed(2)}</TableCell>
                                                        <TableCell>${schedule.balance.toFixed(2)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                                                                {schedule.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => toggleScheduleStatus(schedule.id)}
                                                                    title={schedule.status === 'active' ? 'Pause' : 'Activate'}
                                                                >
                                                                    {schedule.status === 'active' ? (
                                                                        <Pause className="h-4 w-4" />
                                                                    ) : (
                                                                        <Play className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openEditSchedule(schedule)}
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => openDeleteSchedule(schedule.id)}
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Filters Tab */}
                        <TabsContent value="filters">
                            <div className="space-y-4">
                                {/* User Demographics */}
                                <FilterSection title="User Demographics" description="Target users by type, gender, and age">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <FilterRadio
                                            label="User Type"
                                            value={filtersData.userType}
                                            options={userTypeOptions}
                                            onChange={(v) => updateFilter('userType', v)}
                                        />
                                        <FilterRadio
                                            label="Gender"
                                            value={filtersData.gender}
                                            options={genderOptions}
                                            onChange={(v) => updateFilter('gender', v)}
                                        />
                                        <AgeRangeRepeater
                                            rules={filtersData.ageRanges}
                                            onAdd={addAgeRangeRule}
                                            onUpdate={updateAgeRangeRule}
                                            onRemove={removeAgeRangeRule}
                                        />
                                    </div>
                                </FilterSection>

                                {/* Traffic Type */}
                                <FilterSection title="Traffic Type" description="Filter based on prepop data availability">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <FilterRadio
                                            label="Prepop"
                                            value={filtersData.prepop}
                                            options={prepopOptions}
                                            onChange={(v) => updateFilter('prepop', v)}
                                        />
                                    </div>
                                </FilterSection>

                                {/* Keywords */}
                                <FilterSection title="Keywords" description="Filter by keyword matching">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FilterTextarea
                                            label="Keywords Show"
                                            value={filtersData.keywordsShow}
                                            onChange={(v) => updateFilter('keywordsShow', v)}
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                        <FilterTextarea
                                            label="Keywords Hide"
                                            value={filtersData.keywordsHide}
                                            onChange={(v) => updateFilter('keywordsHide', v)}
                                            placeholder="keyword1, keyword2, keyword3"
                                        />
                                    </div>
                                </FilterSection>

                                {/* Source */}
                                <FilterSection title="Source" description="Filter by traffic source">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FilterTextarea
                                            label="Source Show"
                                            value={filtersData.sourceShow}
                                            onChange={(v) => updateFilter('sourceShow', v)}
                                            placeholder="source1, source2, source3"
                                        />
                                        <div className="space-y-4">
                                            <FilterTextarea
                                                label="Source Hide"
                                                value={filtersData.sourceHide}
                                                onChange={(v) => updateFilter('sourceHide', v)}
                                                placeholder="source1, source2, source3"
                                            />
                                            <FilterSwitch
                                                label="Source Hide Own Source"
                                                value={filtersData.sourceHideOwnSource}
                                                onChange={(v) => updateFilter('sourceHideOwnSource', v)}
                                                description="Hide traffic from your own source"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                        <FilterTextarea
                                            label="Source Wildcard Show"
                                            value={filtersData.sourceWildcardShow}
                                            onChange={(v) => updateFilter('sourceWildcardShow', v)}
                                            placeholder="wildcard1, wildcard2, wildcard3"
                                        />
                                        <FilterTextarea
                                            label="Source Wildcard Hide"
                                            value={filtersData.sourceWildcardHide}
                                            onChange={(v) => updateFilter('sourceWildcardHide', v)}
                                            placeholder="wildcard1, wildcard2, wildcard3"
                                        />
                                    </div>
                                </FilterSection>

                                {/* Mediums */}
                                <FilterSection title="Mediums" description="Filter by traffic medium">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FilterTextarea
                                            label="Mediums Show"
                                            value={filtersData.mediumsShow}
                                            onChange={(v) => updateFilter('mediumsShow', v)}
                                            placeholder="medium1, medium2, medium3"
                                        />
                                        <FilterTextarea
                                            label="Mediums Hide"
                                            value={filtersData.mediumsHide}
                                            onChange={(v) => updateFilter('mediumsHide', v)}
                                            placeholder="medium1, medium2, medium3"
                                        />
                                    </div>
                                </FilterSection>

                                {/* Companies */}
                                <FilterSection title="Companies" description="Filter by company names">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FilterTextarea
                                            label="Companies Show"
                                            value={filtersData.companiesShow}
                                            onChange={(v) => updateFilter('companiesShow', v)}
                                            placeholder="company1, company2, company3"
                                        />
                                        <FilterTextarea
                                            label="Companies Hide"
                                            value={filtersData.companiesHide}
                                            onChange={(v) => updateFilter('companiesHide', v)}
                                            placeholder="company1, company2, company3"
                                        />
                                    </div>
                                </FilterSection>

                                {/* Location */}
                                <FilterSection title="Location" description="Filter by geographic location">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FilterTextarea
                                            label="Zips Show"
                                            value={filtersData.zipsShow}
                                            onChange={(v) => updateFilter('zipsShow', v)}
                                            placeholder="90210, 90211, 90212"
                                        />
                                        <FilterTextarea
                                            label="Zips Hide"
                                            value={filtersData.zipsHide}
                                            onChange={(v) => updateFilter('zipsHide', v)}
                                            placeholder="90210, 90211, 90212"
                                        />
                                        <FilterFile
                                            label="Zips Show File"
                                            file={filtersData.zipsShowFile}
                                            onChange={(f) => handleFilterFileUpload('zipsShowFile', f)}
                                            accept=".csv,.txt"
                                        />
                                        <FilterFile
                                            label="Zips Hide File"
                                            file={filtersData.zipsHideFile}
                                            onChange={(f) => handleFilterFileUpload('zipsHideFile', f)}
                                            accept=".csv,.txt"
                                        />
                                        <FilterTextarea
                                            label="States Show"
                                            value={filtersData.statesShow}
                                            onChange={(v) => updateFilter('statesShow', v)}
                                            placeholder="CA, NY, TX"
                                        />
                                        <FilterTextarea
                                            label="States Hide"
                                            value={filtersData.statesHide}
                                            onChange={(v) => updateFilter('statesHide', v)}
                                            placeholder="CA, NY, TX"
                                        />
                                    </div>
                                </FilterSection>

                                {/* User Attributes */}
                                <FilterSection title="User Attributes" description="Filter by user characteristics">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        <FilterRadio
                                            label="Education"
                                            value={filtersData.education}
                                            options={educationOptions}
                                            onChange={(v) => updateFilter('education', v)}
                                        />
                                        <FilterRadio
                                            label="Device"
                                            value={filtersData.device}
                                            options={deviceOptions}
                                            onChange={(v) => updateFilter('device', v)}
                                        />
                                        <FilterRadio
                                            label="Browser Language"
                                            value={filtersData.browserLanguage}
                                            options={browserLanguageOptions}
                                            onChange={(v) => updateFilter('browserLanguage', v)}
                                        />
                                        <FilterCheckboxGroup
                                            label="Employment Status"
                                            value={filtersData.employmentStatus}
                                            options={employmentStatusOptions}
                                            onChange={(v) => toggleFilterCheckbox('employmentStatus', v)}
                                        />
                                        <FilterCheckboxGroup
                                            label="Mobile OS"
                                            value={filtersData.mobileOs}
                                            options={mobileOsOptions}
                                            onChange={(v) => toggleFilterCheckbox('mobileOs', v)}
                                        />
                                    </div>
                                </FilterSection>
                            </div>
                        </TabsContent>

                        {/* Audit Logs Tab */}
                        <TabsContent value="audit-logs">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audit Logs</CardTitle>
                                    <CardDescription>Track all changes made to this ad</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Action</TableHead>
                                                <TableHead>Details</TableHead>
                                                <TableHead>User</TableHead>
                                                <TableHead>Timestamp</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {mockAuditLogsData.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-medium">{log.action}</TableCell>
                                                    <TableCell>{log.details}</TableCell>
                                                    <TableCell>{log.user}</TableCell>
                                                    <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column - Ad Preview (Fixed) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4">
                        {/* Ad Preview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Ad Preview
                                </CardTitle>
                                <CardDescription>See how your ad will appear</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-6 bg-muted/50 space-y-4">
                                    {settingsData.adImage && (
                                        <div className="aspect-video bg-background rounded-lg overflow-hidden flex items-center justify-center">
                                            <img
                                                src={URL.createObjectURL(settingsData.adImage)}
                                                alt="Ad preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    )}
                                    <div className="text-lg font-bold text-center">{settingsData.title || 'Ad Title'}</div>
                                    {settingsData.companyName && (
                                        <div className="text-sm text-center text-muted-foreground">{settingsData.companyName}</div>
                                    )}
                                    {settingsData.copy && (
                                        <div className="text-sm text-center text-muted-foreground">{settingsData.copy}</div>
                                    )}
                                    <Button className="w-full" size="sm">Click Here</Button>
                                    {settingsData.originalUrl && (
                                        <div className="pt-4 border-t">
                                            <div className="text-xs text-muted-foreground mb-1">Destination URL:</div>
                                            <div className="text-xs font-mono text-muted-foreground break-all">
                                                {settingsData.originalUrl}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Settings Overview Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings Overview</CardTitle>
                                <CardDescription>Quick summary of current configuration</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span className="font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                                            {formData.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Country:</span>
                                        <span className="font-medium">{countries.find(c => c.value === formData.country)?.label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Daily Budget:</span>
                                        <span className="font-medium">${formData.dailyBudget}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Placement:</span>
                                        <span className="font-medium">{formData.placement}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created:</span>
                                            <span className="font-medium">{format(new Date(mockAdData.createdAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-muted-foreground">Last Updated:</span>
                                            <span className="font-medium">{format(new Date(mockAdData.updatedAt), 'MMM dd, yyyy')}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Add/Edit Schedule Dialog */}
            <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
                        <DialogDescription>
                            {editingSchedule ? 'Update the schedule configuration' : 'Configure when your ads should be displayed'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Field>
                            <FieldLabel>Schedule Name *</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={scheduleForm.name}
                                    onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                                    placeholder="e.g., Morning Rush"
                                />
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Start Time *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="time"
                                        value={scheduleForm.startTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>End Time *</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="time"
                                        value={scheduleForm.endTime}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Days *</FieldLabel>
                            <FieldContent>
                                <div className="flex flex-wrap gap-2">
                                    {weekDays.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                                scheduleForm.days.includes(day.value)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted border-border'
                                            }`}
                                        >
                                            {day.label.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                                {scheduleForm.days.length === 0 && (
                                    <p className="text-sm text-destructive mt-1">Please select at least one day</p>
                                )}
                            </FieldContent>
                        </Field>

                        <div className="grid grid-cols-3 gap-4">
                            <Field>
                                <FieldLabel>CPC</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.cpc}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, cpc: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Spend</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.spend}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, spend: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>

                            <Field>
                                <FieldLabel>Balance</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={scheduleForm.balance}
                                        onChange={(e) => setScheduleForm({ ...scheduleForm, balance: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </FieldContent>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={scheduleForm.status}
                                    onValueChange={(value: 'active' | 'paused') => setScheduleForm({ ...scheduleForm, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="paused">Paused</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FieldContent>
                        </Field>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveSchedule}
                            disabled={!scheduleForm.name || scheduleForm.days.length === 0}
                        >
                            {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this schedule? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSchedule}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
