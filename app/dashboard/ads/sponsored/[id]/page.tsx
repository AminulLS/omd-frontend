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
import { PLACEMENTS } from '@/lib/constants/placements'

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

const categoryOptions = [
    { value: 'employment', label: 'Employment' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'health', label: 'Health' },
    { value: 'technology', label: 'Technology' },
    { value: 'travel', label: 'Travel' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'retail', label: 'Retail' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' },
]

const imagePriorities = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
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

// ========== INDEPENDENT FILTER COMPONENTS ==========

// User Type Filter Component
const UserTypeFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="User Type"
        value={value}
        options={userTypeOptions}
        onChange={onChange}
    />
)

// Gender Filter Component
const GenderFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="Gender"
        value={value}
        options={genderOptions}
        onChange={onChange}
    />
)

// Age Ranges Filter Component
const AgeRangesFilter = ({
    rules,
    onAdd,
    onUpdate,
    onRemove
}: {
    rules: AgeRangeRule[]
    onAdd: () => void
    onUpdate: (id: string, field: 'logic' | 'value', value: string) => void
    onRemove: (id: string) => void
}) => (
    <AgeRangeRepeater
        rules={rules}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onRemove={onRemove}
    />
)

// Prepop Filter Component
const PrepopFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="Prepop"
        value={value}
        options={prepopOptions}
        onChange={onChange}
    />
)

// Keywords Filter Component
const KeywordsFilter = ({
    show,
    hide,
    onShowChange,
    onHideChange
}: {
    show: string
    hide: string
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Show Keywords
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="sales, marketing, manager"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Hide Keywords
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="competitor, spam"
            />
        </div>
    </div>
)

// Source Filter Component
const SourceFilter = ({
    show,
    hide,
    hideOwnSource,
    onShowChange,
    onHideChange,
    onHideOwnSourceChange
}: {
    show: string
    hide: string
    hideOwnSource: boolean
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
    onHideOwnSourceChange: (v: boolean) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include Sources
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="google, facebook, newsletter"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude Sources
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="competitor, low-quality"
            />
        </div>
        <FilterSwitch
            label="Hide Own Source Traffic"
            value={hideOwnSource}
            onChange={onHideOwnSourceChange}
            description="Automatically exclude traffic from your own sources to prevent self-referrals"
        />
    </div>
)

// Source Wildcard Filter Component
const SourceWildcardFilter = ({
    show,
    hide,
    onShowChange,
    onHideChange
}: {
    show: string
    hide: string
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include Wildcards
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="*.google.com, mail.*"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude Wildcards
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="spam.*, ?-tracker.com"
            />
        </div>
    </div>
)

// Mediums Filter Component
const MediumsFilter = ({
    show,
    hide,
    onShowChange,
    onHideChange
}: {
    show: string
    hide: string
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include Mediums
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="cpc, organic, referral"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude Mediums
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="email, direct"
            />
        </div>
    </div>
)

// Companies Filter Component
const CompaniesFilter = ({
    show,
    hide,
    onShowChange,
    onHideChange
}: {
    show: string
    hide: string
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include Companies
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="Google, Microsoft, Amazon"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude Companies
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="Competitors, agencies"
            />
        </div>
    </div>
)

// Location Filter Component
const LocationFilter = ({
    zipsShow,
    zipsHide,
    zipsShowFile,
    zipsHideFile,
    onZipsShowChange,
    onZipsHideChange,
    onZipsShowFileChange,
    onZipsHideFileChange
}: {
    zipsShow: string
    zipsHide: string
    zipsShowFile: File | null
    zipsHideFile: File | null
    onZipsShowChange: (v: string) => void
    onZipsHideChange: (v: string) => void
    onZipsShowFileChange: (f: File | null) => void
    onZipsHideFileChange: (f: File | null) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include ZIPs
            </label>
            <FilterTextarea
                label=""
                value={zipsShow}
                onChange={onZipsShowChange}
                placeholder="90210, 10001, 60601"
            />
            <div className="mt-2">
                <FilterFile
                    label="Upload ZIP Include File"
                    file={zipsShowFile}
                    onChange={onZipsShowFileChange}
                    accept=".csv,.txt"
                />
            </div>
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude ZIPs
            </label>
            <FilterTextarea
                label=""
                value={zipsHide}
                onChange={onZipsHideChange}
                placeholder="90210, 10001, 60601"
            />
            <div className="mt-2">
                <FilterFile
                    label="Upload ZIP Exclude File"
                    file={zipsHideFile}
                    onChange={onZipsHideFileChange}
                    accept=".csv,.txt"
                />
            </div>
        </div>
    </div>
)

// States Filter Component
const StatesFilter = ({
    show,
    hide,
    onShowChange,
    onHideChange
}: {
    show: string
    hide: string
    onShowChange: (v: string) => void
    onHideChange: (v: string) => void
}) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500"></span>
                Include States
            </label>
            <FilterTextarea
                label=""
                value={show}
                onChange={onShowChange}
                placeholder="CA, NY, TX, FL"
            />
        </div>
        <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500"></span>
                Exclude States
            </label>
            <FilterTextarea
                label=""
                value={hide}
                onChange={onHideChange}
                placeholder="CA, NY, TX, FL"
            />
        </div>
    </div>
)

// Education Filter Component
const EducationFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="Education"
        value={value}
        options={educationOptions}
        onChange={onChange}
    />
)

// Device Filter Component
const DeviceFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="Device"
        value={value}
        options={deviceOptions}
        onChange={onChange}
    />
)

// Browser Language Filter Component
const BrowserLanguageFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <FilterRadio
        label="Browser Language"
        value={value}
        options={browserLanguageOptions}
        onChange={onChange}
    />
)

// Employment Status Filter Component
const EmploymentStatusFilter = ({
    value,
    onChange
}: {
    value: string[]
    onChange: (v: string) => void
}) => (
    <FilterCheckboxGroup
        label="Employment Status"
        value={value}
        options={employmentStatusOptions}
        onChange={onChange}
    />
)

// Mobile OS Filter Component
const MobileOsFilter = ({
    value,
    onChange
}: {
    value: string[]
    onChange: (v: string) => void
}) => (
    <FilterCheckboxGroup
        label="Mobile OS"
        value={value}
        options={mobileOsOptions}
        onChange={onChange}
    />
)

// ========== REUSABLE FILTER COMPONENTS ==========

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
                            className="w-4 h-4 text-primary border-border"
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
            <div className="border-2 border-dashed p-4 text-center hover:bg-muted/50 transition-colors">
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
        // Buttons
        progressButtonPrimary: '',
        progressButtonSecondary: '',
        skipButton: '',
        // Display Settings
        adDisclaimer: '',
        showImageOnOffer: false,
        showAdDescription: true,
        // Prepop Data
        appendHashedUserData: false,
        appendHashedUserDataFluent: false,
        hashedKey: '',
        hashedKeyFluent: '',
        // Board Filters
        countrySpecific: 'US',
        selectedBoards: [] as string[],
        boardPlacement: 'serp-top',
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

    // Available filter types
    const availableFilterTypes = [
        { id: 'userType', label: 'User Type', category: 'User Demographics' },
        { id: 'gender', label: 'Gender', category: 'User Demographics' },
        { id: 'ageRanges', label: 'Age Ranges', category: 'User Demographics' },
        { id: 'prepop', label: 'Prepop', category: 'Traffic Type' },
        { id: 'keywords', label: 'Keywords', category: 'Keywords' },
        { id: 'source', label: 'Source', category: 'Source' },
        { id: 'sourceWildcard', label: 'Source Wildcard', category: 'Source' },
        { id: 'mediums', label: 'Mediums', category: 'Mediums' },
        { id: 'companies', label: 'Companies', category: 'Companies' },
        { id: 'location', label: 'ZIP Codes', category: 'Location' },
        { id: 'states', label: 'States', category: 'Location' },
        { id: 'education', label: 'Education', category: 'User Attributes' },
        { id: 'device', label: 'Device', category: 'User Attributes' },
        { id: 'browserLanguage', label: 'Browser Language', category: 'User Attributes' },
        { id: 'employmentStatus', label: 'Employment Status', category: 'User Attributes' },
        { id: 'mobileOs', label: 'Mobile OS', category: 'User Attributes' },
    ] as const

    type ActiveFilterId = typeof availableFilterTypes[number]['id']

    const [activeFilters, setActiveFilters] = useState<ActiveFilterId[]>([])
    const [addFilterOpen, setAddFilterOpen] = useState(false)
    const [editingFilterId, setEditingFilterId] = useState<ActiveFilterId | null>(null)
    const [filterModalOpen, setFilterModalOpen] = useState(false)

    // Filter management handlers
    const addFilter = (filterId: ActiveFilterId) => {
        if (!activeFilters.includes(filterId)) {
            setActiveFilters([...activeFilters, filterId])
        }
        setAddFilterOpen(false)
        // Open modal for editing
        setEditingFilterId(filterId)
        setFilterModalOpen(true)
    }

    const editFilter = (filterId: ActiveFilterId) => {
        setEditingFilterId(filterId)
        setFilterModalOpen(true)
    }

    const removeFilter = (filterId: ActiveFilterId) => {
        setActiveFilters(activeFilters.filter(f => f !== filterId))
    }

    // Get available filters (not currently active)
    const getAvailableFilters = () => {
        return availableFilterTypes.filter(f => !activeFilters.includes(f.id))
    }

    // Group filters by category
    const groupFiltersByCategory = (filters: (typeof availableFilterTypes)[number][]) => {
        const grouped: Record<string, (typeof availableFilterTypes)[number][]> = {}
        filters.forEach(filter => {
            if (!grouped[filter.category]) {
                grouped[filter.category] = []
            }
            grouped[filter.category].push(filter)
        })
        return grouped
    }

    // Get display value for a filter
    const getFilterDisplayValue = (filterId: ActiveFilterId): string => {
        switch (filterId) {
            case 'userType':
                return userTypeOptions.find(o => o.value === filtersData.userType)?.label || filtersData.userType
            case 'gender':
                return genderOptions.find(o => o.value === filtersData.gender)?.label || filtersData.gender
            case 'ageRanges':
                return filtersData.ageRanges.length > 0
                    ? `${filtersData.ageRanges.length} rule${filtersData.ageRanges.length > 1 ? 's' : ''}`
                    : 'No rules'
            case 'prepop':
                return prepopOptions.find(o => o.value === filtersData.prepop)?.label || filtersData.prepop
            case 'keywords':
                const keywords = []
                if (filtersData.keywordsShow) keywords.push(`Show: ${filtersData.keywordsShow}`)
                if (filtersData.keywordsHide) keywords.push(`Hide: ${filtersData.keywordsHide}`)
                return keywords.length > 0 ? keywords.join(' | ') : 'Not set'
            case 'source':
                const source = []
                if (filtersData.sourceShow) source.push(`Include: ${filtersData.sourceShow}`)
                if (filtersData.sourceHide) source.push(`Exclude: ${filtersData.sourceHide}`)
                if (filtersData.sourceHideOwnSource) source.push('Hide Own Source')
                return source.length > 0 ? source.join(' | ') : 'Not set'
            case 'sourceWildcard':
                const wildcard = []
                if (filtersData.sourceWildcardShow) wildcard.push(`Include: ${filtersData.sourceWildcardShow}`)
                if (filtersData.sourceWildcardHide) wildcard.push(`Exclude: ${filtersData.sourceWildcardHide}`)
                return wildcard.length > 0 ? wildcard.join(' | ') : 'Not set'
            case 'mediums':
                const mediums = []
                if (filtersData.mediumsShow) mediums.push(`Include: ${filtersData.mediumsShow}`)
                if (filtersData.mediumsHide) mediums.push(`Exclude: ${filtersData.mediumsHide}`)
                return mediums.length > 0 ? mediums.join(' | ') : 'Not set'
            case 'companies':
                const companies = []
                if (filtersData.companiesShow) companies.push(`Include: ${filtersData.companiesShow}`)
                if (filtersData.companiesHide) companies.push(`Exclude: ${filtersData.companiesHide}`)
                return companies.length > 0 ? companies.join(' | ') : 'Not set'
            case 'location':
                const location = []
                if (filtersData.zipsShow) location.push(`Include: ${filtersData.zipsShow}`)
                if (filtersData.zipsHide) location.push(`Exclude: ${filtersData.zipsHide}`)
                return location.length > 0 ? location.join(' | ') : 'Not set'
            case 'states':
                const states = []
                if (filtersData.statesShow) states.push(`Include: ${filtersData.statesShow}`)
                if (filtersData.statesHide) states.push(`Exclude: ${filtersData.statesHide}`)
                return states.length > 0 ? states.join(' | ') : 'Not set'
            case 'education':
                return educationOptions.find(o => o.value === filtersData.education)?.label || filtersData.education
            case 'device':
                return deviceOptions.find(o => o.value === filtersData.device)?.label || filtersData.device
            case 'browserLanguage':
                return browserLanguageOptions.find(o => o.value === filtersData.browserLanguage)?.label || filtersData.browserLanguage
            case 'employmentStatus':
                return filtersData.employmentStatus.length > 0
                    ? employmentStatusOptions
                        .filter(o => filtersData.employmentStatus.includes(o.value))
                        .map(o => o.label)
                        .join(', ')
                    : 'All'
            case 'mobileOs':
                return filtersData.mobileOs.length > 0
                    ? mobileOsOptions
                        .filter(o => filtersData.mobileOs.includes(o.value))
                        .map(o => o.label)
                        .join(', ')
                    : 'All'
            default:
                return 'Not set'
        }
    }

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
                                        <div className="border p-4">
                                            <div className="text-sm text-muted-foreground">Total Impressions</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.impressions, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border p-4">
                                            <div className="text-sm text-muted-foreground">Total Clicks</div>
                                            <div className="text-2xl font-bold">
                                                {mockStatsData.reduce((acc, row) => acc + row.clicks, 0).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="border p-4">
                                            <div className="text-sm text-muted-foreground">Avg CTR</div>
                                            <div className="text-2xl font-bold">
                                                {(mockStatsData.reduce((acc, row) => acc + row.ctr, 0) / mockStatsData.length).toFixed(2)}%
                                            </div>
                                        </div>
                                        <div className="border p-4">
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
                                                        <Select
                                                            value={settingsData.category}
                                                            onValueChange={(value) => setSettingsData({ ...settingsData, category: value })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {categoryOptions.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
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
                                            </div>
                                        </div>

                                        <div className="mt-6">
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
                                                        <div className="border-2 border-dashed p-6 text-center hover:bg-muted/50 transition-colors">
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

                                {/* Buttons Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Buttons</CardTitle>
                                        <CardDescription>Custom button labels for your ad</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            <Field>
                                                <FieldLabel>Progress Button (Primary)</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={settingsData.progressButtonPrimary}
                                                        onChange={(e) => setSettingsData({ ...settingsData, progressButtonPrimary: e.target.value })}
                                                        placeholder="e.g., Continue"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Progress Button (Secondary)</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={settingsData.progressButtonSecondary}
                                                        onChange={(e) => setSettingsData({ ...settingsData, progressButtonSecondary: e.target.value })}
                                                        placeholder="e.g., Next Step"
                                                    />
                                                </FieldContent>
                                            </Field>

                                            <Field>
                                                <FieldLabel>Skip Button</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={settingsData.skipButton}
                                                        onChange={(e) => setSettingsData({ ...settingsData, skipButton: e.target.value })}
                                                        placeholder="e.g., Skip"
                                                    />
                                                </FieldContent>
                                            </Field>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Display Settings Section */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Display Settings</CardTitle>
                                        <CardDescription>Control how your ad is displayed</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Ad Disclaimer</FieldLabel>
                                                    <FieldContent>
                                                        <Textarea
                                                            value={settingsData.adDisclaimer}
                                                            onChange={(e) => setSettingsData({ ...settingsData, adDisclaimer: e.target.value })}
                                                            placeholder="Enter disclaimer text"
                                                            rows={3}
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </div>

                                            <div className="space-y-4">
                                                <Field>
                                                    <FieldLabel>Show Image on Offer</FieldLabel>
                                                    <FieldContent>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={settingsData.showImageOnOffer}
                                                                onCheckedChange={(checked) => setSettingsData({ ...settingsData, showImageOnOffer: checked })}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {settingsData.showImageOnOffer ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">Display ad image on the offer page</p>
                                                    </FieldContent>
                                                </Field>

                                                <Field>
                                                    <FieldLabel>Show Ad Description/Copy</FieldLabel>
                                                    <FieldContent>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={settingsData.showAdDescription}
                                                                onCheckedChange={(checked) => setSettingsData({ ...settingsData, showAdDescription: checked })}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {settingsData.showAdDescription ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">Show ad copy in the listing</p>
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
                                                <Field>
                                                    <FieldLabel>Append Hashed User Data (FLUENT only)</FieldLabel>
                                                    <FieldContent>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={settingsData.appendHashedUserDataFluent}
                                                                onCheckedChange={(checked) => setSettingsData({ ...settingsData, appendHashedUserDataFluent: checked })}
                                                            />
                                                            <span className="text-sm text-muted-foreground">
                                                                {settingsData.appendHashedUserDataFluent ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">FLUENT data hashing for user data</p>
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
                                                <Field>
                                                    <FieldLabel>Hashed Key (FLUENT)</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsData.hashedKeyFluent}
                                                            onChange={(e) => setSettingsData({ ...settingsData, hashedKeyFluent: e.target.value })}
                                                            placeholder="Enter FLUENT hashed key"
                                                            type="password"
                                                        />
                                                        <p className="text-xs text-muted-foreground mt-1">FLUENT key for hashing user data</p>
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
                                                                <SelectValue placeholder="Select placement" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {PLACEMENTS.map((placement) => (
                                                                    <SelectItem key={placement.slug} value={placement.slug}>
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
                                                                            className="flex items-center space-x-2 p-2 hover:bg-muted cursor-pointer"
                                                                            onClick={() => toggleBoard(board.value)}
                                                                        >
                                                                            <div className={`w-4 h-4 border flex items-center justify-center ${
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
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle>Filters</CardTitle>
                                            <CardDescription>Manage your targeting filters ({activeFilters.length} active)</CardDescription>
                                        </div>
                                        <Popover open={addFilterOpen} onOpenChange={setAddFilterOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Filter
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-0" align="end">
                                                <div className="max-h-96 overflow-y-auto">
                                                    {Object.entries(groupFiltersByCategory(getAvailableFilters())).map(([category, filters]) => (
                                                        <div key={category}>
                                                            <div className="px-3 py-2 text-sm font-semibold text-muted-foreground bg-muted/50">
                                                                {category}
                                                            </div>
                                                            {filters.map((filter) => (
                                                                <button
                                                                    key={filter.id}
                                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                                                                    onClick={() => addFilter(filter.id)}
                                                                >
                                                                    {filter.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ))}
                                                    {getAvailableFilters().length === 0 && (
                                                        <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                                            All filters are active
                                                        </div>
                                                    )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {activeFilters.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                            <h4 className="text-lg font-semibold mb-2">No Active Filters</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Add filters to customize your targeting settings
                                            </p>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Filter Name</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead>Current Value</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {activeFilters.map((filterId) => {
                                                    const filter = availableFilterTypes.find(f => f.id === filterId)
                                                    if (!filter) return null

                                                    return (
                                                        <TableRow key={filter.id}>
                                                            <TableCell className="font-medium">{filter.label}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="outline" className="text-xs">
                                                                    {filter.category}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-muted-foreground max-w-md truncate">
                                                                {getFilterDisplayValue(filter.id)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => editFilter(filter.id)}
                                                                        title="Edit filter"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => removeFilter(filter.id)}
                                                                        title="Remove filter"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Filter Edit Modal */}
                        <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingFilterId && availableFilterTypes.find(f => f.id === editingFilterId)?.label}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingFilterId && availableFilterTypes.find(f => f.id === editingFilterId)?.category}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    {editingFilterId === 'userType' && (
                                        <UserTypeFilter
                                            value={filtersData.userType}
                                            onChange={(v) => updateFilter('userType', v)}
                                        />
                                    )}
                                    {editingFilterId === 'gender' && (
                                        <GenderFilter
                                            value={filtersData.gender}
                                            onChange={(v) => updateFilter('gender', v)}
                                        />
                                    )}
                                    {editingFilterId === 'ageRanges' && (
                                        <AgeRangesFilter
                                            rules={filtersData.ageRanges}
                                            onAdd={addAgeRangeRule}
                                            onUpdate={updateAgeRangeRule}
                                            onRemove={removeAgeRangeRule}
                                        />
                                    )}
                                    {editingFilterId === 'prepop' && (
                                        <PrepopFilter
                                            value={filtersData.prepop}
                                            onChange={(v) => updateFilter('prepop', v)}
                                        />
                                    )}
                                    {editingFilterId === 'keywords' && (
                                        <KeywordsFilter
                                            show={filtersData.keywordsShow}
                                            hide={filtersData.keywordsHide}
                                            onShowChange={(v) => updateFilter('keywordsShow', v)}
                                            onHideChange={(v) => updateFilter('keywordsHide', v)}
                                        />
                                    )}
                                    {editingFilterId === 'source' && (
                                        <SourceFilter
                                            show={filtersData.sourceShow}
                                            hide={filtersData.sourceHide}
                                            hideOwnSource={filtersData.sourceHideOwnSource}
                                            onShowChange={(v) => updateFilter('sourceShow', v)}
                                            onHideChange={(v) => updateFilter('sourceHide', v)}
                                            onHideOwnSourceChange={(v) => updateFilter('sourceHideOwnSource', v)}
                                        />
                                    )}
                                    {editingFilterId === 'sourceWildcard' && (
                                        <SourceWildcardFilter
                                            show={filtersData.sourceWildcardShow}
                                            hide={filtersData.sourceWildcardHide}
                                            onShowChange={(v) => updateFilter('sourceWildcardShow', v)}
                                            onHideChange={(v) => updateFilter('sourceWildcardHide', v)}
                                        />
                                    )}
                                    {editingFilterId === 'mediums' && (
                                        <MediumsFilter
                                            show={filtersData.mediumsShow}
                                            hide={filtersData.mediumsHide}
                                            onShowChange={(v) => updateFilter('mediumsShow', v)}
                                            onHideChange={(v) => updateFilter('mediumsHide', v)}
                                        />
                                    )}
                                    {editingFilterId === 'companies' && (
                                        <CompaniesFilter
                                            show={filtersData.companiesShow}
                                            hide={filtersData.companiesHide}
                                            onShowChange={(v) => updateFilter('companiesShow', v)}
                                            onHideChange={(v) => updateFilter('companiesHide', v)}
                                        />
                                    )}
                                    {editingFilterId === 'location' && (
                                        <LocationFilter
                                            zipsShow={filtersData.zipsShow}
                                            zipsHide={filtersData.zipsHide}
                                            zipsShowFile={filtersData.zipsShowFile}
                                            zipsHideFile={filtersData.zipsHideFile}
                                            onZipsShowChange={(v) => updateFilter('zipsShow', v)}
                                            onZipsHideChange={(v) => updateFilter('zipsHide', v)}
                                            onZipsShowFileChange={(f) => handleFilterFileUpload('zipsShowFile', f)}
                                            onZipsHideFileChange={(f) => handleFilterFileUpload('zipsHideFile', f)}
                                        />
                                    )}
                                    {editingFilterId === 'states' && (
                                        <StatesFilter
                                            show={filtersData.statesShow}
                                            hide={filtersData.statesHide}
                                            onShowChange={(v) => updateFilter('statesShow', v)}
                                            onHideChange={(v) => updateFilter('statesHide', v)}
                                        />
                                    )}
                                    {editingFilterId === 'education' && (
                                        <EducationFilter
                                            value={filtersData.education}
                                            onChange={(v) => updateFilter('education', v)}
                                        />
                                    )}
                                    {editingFilterId === 'device' && (
                                        <DeviceFilter
                                            value={filtersData.device}
                                            onChange={(v) => updateFilter('device', v)}
                                        />
                                    )}
                                    {editingFilterId === 'browserLanguage' && (
                                        <BrowserLanguageFilter
                                            value={filtersData.browserLanguage}
                                            onChange={(v) => updateFilter('browserLanguage', v)}
                                        />
                                    )}
                                    {editingFilterId === 'employmentStatus' && (
                                        <EmploymentStatusFilter
                                            value={filtersData.employmentStatus}
                                            onChange={(v) => toggleFilterCheckbox('employmentStatus', v)}
                                        />
                                    )}
                                    {editingFilterId === 'mobileOs' && (
                                        <MobileOsFilter
                                            value={filtersData.mobileOs}
                                            onChange={(v) => toggleFilterCheckbox('mobileOs', v)}
                                        />
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setFilterModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={() => setFilterModalOpen(false)}>
                                        Done
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


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
                                <div className="border p-6 bg-muted/50 space-y-4">
                                    {settingsData.adImage && (
                                        <div className="aspect-video bg-background overflow-hidden flex items-center justify-center">
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
                                            className={`px-3 py-1.5 text-sm border transition-colors ${
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
