'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Frame, FramePanel, FrameHeader, FrameTitle, FrameDescription } from '@/components/ui/frame'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
import { ArrowLeft, ArrowRight, BarChart3, Settings, Calendar, FileText, Eye, Plus, Pencil, Trash2, Play, Pause, Code, RefreshCw, Globe, Clock, DollarSign, AlertCircle, Copy } from 'lucide-react'
import { format } from 'date-fns'

// Types
type XmlAdStatus = 'active' | 'inactive' | 'pending' | 'paused'
type ParsingStatus = 'success' | 'failed' | 'running' | 'pending'

interface XmlAdData {
    id: string
    partnerId: number
    partner: string
    title: string
    nickname: string
    uniqueId: string
    status: XmlAdStatus
    country: string
    dailyBudget: number
    monthlyBudget: number
    feedXmlUrl: string
    parsingStatus: ParsingStatus
    lastParsed: string
    nextParse: string
    totalJobs: number
    activeJobs: number
    createdAt: string
    updatedAt: string
    description?: string
    notes?: string
    downloadMethod?: 'url' | 'ftp' | 's3'
    xmlContentType?: 'mix' | 'direct_employer' | 'lead_generation' | 'gig' | 'job_board' | 'organic'
    currency?: string
    jobField?: string
    // New fields
    requiresDownload?: boolean
    xmlFeedName?: string
    partnerPassingLogo?: boolean
    assignZipCoordinates?: boolean
    partnerPassingCoordinates?: boolean
    latitudeField?: string
    longitudeField?: string
    partnerPassingCategory?: boolean
    overrideBlueCollarFlag?: boolean
    remoteJobDetection?: boolean
    logoField?: string
    runningFrequency?: number
    intervalWaitingTime?: string
    revenueType?: 'yes_paid' | 'no_paid'
    pricingType?: 'cpc' | 'cpa' | 'tcpa'
    flatCpcOverride?: number
    cpaTcpa?: number
    optimizationLogic?: null | 0 | 1 | 2
    cpcScrubPercent?: number
    agencyFeeScrubPercent?: number
    minimumCpc?: number
    allowInEmail?: boolean
    allowInSms?: boolean
    acr?: number
    xmlSplitCampaigns?: XmlSplitCampaign[]
    additionalUrlParams?: AdditionalUrlParam[]
    originsInclude?: string
    originsExclude?: string
    todayRevenue?: number
    yesterdayRevenue?: number
    sdlwRevenue?: number
}

interface XmlSplitCampaign {
    id: string
    nodeIdentifier: string
    logic: 'INLIST' | 'NOTINLIST' | 'CONTAINS' | 'NOTCONTAINS' | 'F4EQUALS'
    value: string
}

interface AdditionalUrlParam {
    id: string
    name: string
    value: string
}

interface FieldMapping {
    ourField: string
    partnerField: string
}

interface UrlVariableReplacement {
    id: string
    variable: string
    replacement: string
}

interface Schedule {
    id: number
    name: string
    startTime: string
    endTime: string
    days: string[]
    status: 'active' | 'paused'
}

interface ParsingLog {
    id: number
    startedAt: string
    finishedAt?: string
    duration: string
    status: ParsingStatus
    jobsCount: number
    bcJobsCount: number
    cpcFloorSkipCount: number
    locationSkipCount: number
    remoteFlagsCount: number
    locLookupsCount: number
    countryList: string
    errors?: string
    triggeredAs: string
}

interface AuditLog {
    id: number
    timestamp: string
    user: string
    action: string
    entity: string
    entityId: string
    changes: string
    ipAddress: string
}

// Mock data generator
const generateMockXmlAdData = (id: string): XmlAdData => {
    const statuses: XmlAdStatus[] = ['active', 'inactive', 'pending', 'paused']
    const parsingStatuses: ParsingStatus[] = ['success', 'failed', 'running', 'pending']
    const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN']

    const numId = parseInt(id) || 1

    return {
        id,
        partnerId: (numId % 10) + 1,
        partner: `Partner ${(numId % 10) + 1}`,
        title: `XML Campaign ${numId}`,
        nickname: `XML Feed ${numId}`,
        uniqueId: `ID-${Math.random().toString(36).substring(7).toUpperCase()}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        dailyBudget: Math.round((Math.random() * 500 + 50) * 100) / 100,
        monthlyBudget: Math.round((Math.random() * 10000 + 1000) * 100) / 100,
        feedXmlUrl: `https://example.com/feeds/xml-${numId}.xml`,
        parsingStatus: parsingStatuses[Math.floor(Math.random() * parsingStatuses.length)],
        lastParsed: format(new Date(Date.now() - Math.random() * 86400000), 'MM/dd/yyyy HH:mm'),
        nextParse: format(new Date(Date.now() + Math.random() * 3600000), 'MM/dd/yyyy HH:mm'),
        totalJobs: Math.floor(Math.random() * 5000) + 100,
        activeJobs: Math.floor(Math.random() * 1000) + 50,
        createdAt: format(new Date(2024, 0, numId), 'MM/dd/yyyy'),
        updatedAt: format(new Date(2024, 0, numId + 10), 'MM/dd/yyyy'),
        description: `XML feed for campaign ${numId} with automated job parsing and updates.`,
        notes: `Additional notes for XML feed ${numId}. Include special instructions or important information here.`,
        downloadMethod: ['url', 'ftp', 's3'][Math.floor(Math.random() * 3)] as 'url' | 'ftp' | 's3',
        xmlContentType: ['mix', 'direct_employer', 'lead_generation', 'gig', 'job_board', 'organic'][Math.floor(Math.random() * 6)] as any,
        currency: 'USD',
        jobField: 'technology',
        // New fields
        requiresDownload: Math.random() > 0.5,
        xmlFeedName: `feed_${numId}`,
        partnerPassingLogo: Math.random() > 0.5,
        assignZipCoordinates: Math.random() > 0.5,
        partnerPassingCoordinates: Math.random() > 0.5,
        latitudeField: 'lat',
        longitudeField: 'lon',
        partnerPassingCategory: Math.random() > 0.5,
        overrideBlueCollarFlag: Math.random() > 0.5,
        remoteJobDetection: Math.random() > 0.5,
        logoField: 'logo',
        runningFrequency: 2,
        intervalWaitingTime: '04:30:00',
        revenueType: 'yes_paid',
        pricingType: 'cpc',
        flatCpcOverride: 0.5,
        cpaTcpa: 0,
        optimizationLogic: null,
        cpcScrubPercent: 0.15,
        agencyFeeScrubPercent: 0.2,
        minimumCpc: 0.1,
        allowInEmail: Math.random() > 0.5,
        allowInSms: Math.random() > 0.5,
        acr: 0.5,
        xmlSplitCampaigns: [
            { id: '1', nodeIdentifier: 'job_type', logic: 'INLIST', value: 'full-time,part-time' },
            { id: '2', nodeIdentifier: 'category', logic: 'CONTAINS', value: 'technology' },
        ],
        additionalUrlParams: [
            { id: '1', name: 'source', value: 'api' },
            { id: '2', name: 'utm_medium', value: 'xml_feed' },
        ],
        originsInclude: '',
        originsExclude: '',
        todayRevenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
        yesterdayRevenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
        sdlwRevenue: Math.round((Math.random() * 5000 + 500) * 100) / 100,
    }
}

const generateMockParsingLogs = (): ParsingLog[] => {
    const statuses: ParsingStatus[] = ['success', 'failed', 'running', 'pending']
    const triggerTypes = ['scheduled', 'manual', 'api', 'webhook']
    const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'IN', 'BR', 'MX']

    return [...Array(10)].map((_, idx) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const startTime = new Date(Date.now() - idx * 3600000)
        const endTime = status === 'running' || status === 'pending' ? undefined : new Date(startTime.getTime() + Math.random() * 300000)
        const duration = endTime ? `${Math.round((endTime.getTime() - startTime.getTime()) / 1000)}s` : '-'
        const numCountries = Math.floor(Math.random() * 5) + 1
        const countryList = countries.sort(() => 0.5 - Math.random()).slice(0, numCountries).join(', ')

        return {
            id: idx + 1,
            startedAt: format(startTime, 'MM/dd/yyyy HH:mm:ss'),
            finishedAt: endTime ? format(endTime, 'MM/dd/yyyy HH:mm:ss') : undefined,
            duration,
            status,
            jobsCount: Math.floor(Math.random() * 1000) + 100,
            bcJobsCount: Math.floor(Math.random() * 200) + 20,
            cpcFloorSkipCount: Math.floor(Math.random() * 50),
            locationSkipCount: Math.floor(Math.random() * 100),
            remoteFlagsCount: Math.floor(Math.random() * 30),
            locLookupsCount: Math.floor(Math.random() * 500) + 50,
            countryList,
            errors: status === 'failed' ? 'Connection timeout or invalid XML format' : undefined,
            triggeredAs: triggerTypes[Math.floor(Math.random() * triggerTypes.length)],
        }
    })
}

const generateMockAuditLogs = (): AuditLog[] => {
    const actions = [
        'Created', 'Updated', 'Deleted', 'Paused', 'Activated',
        'Modified Configuration', 'Changed Status', 'Added Schedule',
        'Removed Schedule', 'Updated Budget'
    ]
    const entities = ['XML Feed', 'Schedule', 'Budget', 'Field Mapping', 'URL Parameter']
    const users = ['admin@example.com', 'john.doe@example.com', 'jane.smith@example.com', 'system']

    return [...Array(20)].map((_, idx) => {
        const action = actions[Math.floor(Math.random() * actions.length)]
        const entity = entities[Math.floor(Math.random() * entities.length)]
        const user = users[Math.floor(Math.random() * users.length)]

        return {
            id: idx + 1,
            timestamp: format(new Date(Date.now() - idx * 7200000), 'MM/dd/yyyy HH:mm:ss'),
            user,
            action,
            entity,
            entityId: Math.floor(Math.random() * 1000).toString(),
            changes: `${action} ${entity} - ${idx % 3 === 0 ? 'Field value changed' : 'Configuration updated'}`,
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        }
    })
}

const generateMockSchedules = (): Record<number, Schedule> => {
    return {
        1: {
            id: 1,
            name: 'Business Hours',
            startTime: '09:00',
            endTime: '17:00',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            status: 'active',
        },
        2: {
            id: 2,
            name: 'Weekend Shift',
            startTime: '10:00',
            endTime: '14:00',
            days: ['Sat', 'Sun'],
            status: 'active',
        },
        3: {
            id: 3,
            name: 'Evening Peak',
            startTime: '18:00',
            endTime: '22:00',
            days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            status: 'paused',
        },
    }
}

// Constants
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

const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'INR', label: 'INR - Indian Rupee' },
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

const downloadMethods = [
    { value: 'url', label: 'URL' },
    { value: 'ftp', label: 'FTP' },
    { value: 's3', label: 'S3' },
]

const xmlContentTypes = [
    { value: 'mix', label: 'Mix' },
    { value: 'direct_employer', label: 'Direct Employer' },
    { value: 'lead_generation', label: 'Lead Generation' },
    { value: 'gig', label: 'Gig' },
    { value: 'job_board', label: 'Job Board' },
    { value: 'organic', label: 'Organic' },
]

const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'paused', label: 'Paused' },
]

const revenueTypes = [
    { value: 'yes_paid', label: 'Yes Paid' },
    { value: 'no_paid', label: 'No Paid' },
]

const pricingTypes = [
    { value: 'cpc', label: 'CPC' },
    { value: 'cpa', label: 'CPA' },
    { value: 'tcpa', label: 'TCPA' },
]

const optimizationLogicOptions = [
    { value: 'null', label: 'Global Job ID' },
    { value: '0', label: 'Job ID Origin Only' },
    { value: '1', label: 'Job ID Origin + ApiKey' },
    { value: '2', label: 'Job ID ApiKey Only' },
]

const xmlSplitLogics = [
    { value: 'INLIST', label: 'INLIST' },
    { value: 'NOTINLIST', label: 'NOTINLIST' },
    { value: 'CONTAINS', label: 'CONTAINS' },
    { value: 'NOTCONTAINS', label: 'NOTCONTAINS' },
    { value: 'F4EQUALS', label: 'F4EQUALS (First 4 Equals)' },
]

export default function XmlDetailsPage() {
    const params = useParams()
    const id = params.id as string

    const [xmlData, setXmlData] = useState<XmlAdData | null>(null)
    const [parsingLogs, setParsingLogs] = useState<ParsingLog[]>([])
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fieldMapping, setFieldMapping] = useState<FieldMapping[]>([
        { ourField: 'job_id', partnerField: 'job_id' },
        { ourField: 'company', partnerField: 'company_name' },
        { ourField: 'title', partnerField: 'job_title' },
        { ourField: 'description', partnerField: 'job_description' },
        { ourField: 'location', partnerField: 'location' },
        { ourField: 'city', partnerField: 'city' },
        { ourField: 'state', partnerField: 'state' },
        { ourField: 'zip', partnerField: 'postal_code' },
        { ourField: 'country', partnerField: 'country_code' },
        { ourField: 'url', partnerField: 'job_url' },
        { ourField: 'cpc', partnerField: 'cost_per_click' },
        { ourField: 'partner_category', partnerField: 'category' },
        { ourField: 'created_at', partnerField: 'date_posted' },
        { ourField: 'expired_at', partnerField: 'expiry_date' },
        { ourField: 'cpa', partnerField: 'cost_per_action' },
        { ourField: 'risk', partnerField: 'risk_level' },
        { ourField: 'job_type', partnerField: 'employment_type' },
        { ourField: 'compensation', partnerField: 'salary' },
    ])
    const [urlVariableReplacements, setUrlVariableReplacements] = useState<UrlVariableReplacement[]>([
        { id: '1', variable: '{job_id}', replacement: '' },
        { id: '2', variable: '{company}', replacement: '' },
    ])

    // Schedule state
    const [schedules, setSchedules] = useState<Record<number, Schedule>>({})
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
    const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
    const [duplicateCampaignName, setDuplicateCampaignName] = useState('')
    const [scheduleForm, setScheduleForm] = useState({
        name: '',
        startTime: '09:00',
        endTime: '17:00',
        days: [] as string[],
        status: 'active' as 'active' | 'paused',
    })

    const [settingsForm, setSettingsForm] = useState<{
        name: string
        dailyBudget: number
        monthlyBudget: number
        status: XmlAdStatus
        notes: string
        downloadMethod: 'url' | 'ftp' | 's3'
        xmlContentType: 'mix' | 'direct_employer' | 'lead_generation' | 'gig' | 'job_board' | 'organic'
        country: string
        currency: string
        xmlUrl: string
        jobField: string
        // New fields
        requiresDownload: boolean
        xmlFeedName: string
        partnerPassingLogo: boolean
        assignZipCoordinates: boolean
        partnerPassingCoordinates: boolean
        latitudeField: string
        longitudeField: string
        partnerPassingCategory: boolean
        overrideBlueCollarFlag: boolean
        remoteJobDetection: boolean
        logoField?: string
        runningFrequency?: number
        intervalWaitingTime?: string
        revenueType?: 'yes_paid' | 'no_paid'
        pricingType?: 'cpc' | 'cpa' | 'tcpa'
        flatCpcOverride?: number
        cpaTcpa?: number
        optimizationLogic?: null | 0 | 1 | 2
        cpcScrubPercent?: number
        agencyFeeScrubPercent?: number
        minimumCpc?: number
        allowInEmail?: boolean
        allowInSms?: boolean
        acr?: number
        xmlSplitCampaigns?: XmlSplitCampaign[]
        additionalUrlParams?: AdditionalUrlParam[]
        originsInclude?: string
        originsExclude?: string
        // FTP/S3 fields
        ftpProtocol?: 'FTP' | 'SFTP'
        ftpHost?: string
        ftpUsername?: string
        ftpPassword?: string
        ftpPort?: number
        ftpFilePath?: string
        s3Bucket?: string
        s3Key?: string
    }>({
        name: '',
        dailyBudget: 0,
        monthlyBudget: 0,
        status: 'active',
        notes: '',
        downloadMethod: 'url',
        xmlContentType: 'mix',
        country: 'US',
        currency: 'USD',
        xmlUrl: '',
        jobField: '',
        // New fields
        requiresDownload: false,
        xmlFeedName: '',
        partnerPassingLogo: false,
        assignZipCoordinates: false,
        partnerPassingCoordinates: false,
        latitudeField: '',
        longitudeField: '',
        partnerPassingCategory: false,
        overrideBlueCollarFlag: false,
        remoteJobDetection: false,
        logoField: '',
        runningFrequency: 2,
        intervalWaitingTime: '04:30:00',
        revenueType: 'yes_paid',
        pricingType: 'cpc',
        flatCpcOverride: 0,
        cpaTcpa: 0,
        optimizationLogic: null,
        cpcScrubPercent: 0,
        agencyFeeScrubPercent: 0,
        minimumCpc: 0,
        allowInEmail: false,
        allowInSms: false,
        acr: 0,
        additionalUrlParams: [],
        xmlSplitCampaigns: [],
        originsInclude: '',
        originsExclude: '',
        // FTP/S3 fields
        ftpProtocol: 'FTP',
        ftpHost: '',
        ftpUsername: '',
        ftpPassword: '',
        ftpPort: 21,
        ftpFilePath: '',
        s3Bucket: '',
        s3Key: '',
    })

    // Load data on mount
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setXmlData(generateMockXmlAdData(id))
            setParsingLogs(generateMockParsingLogs())
            setAuditLogs(generateMockAuditLogs())
            setSchedules(generateMockSchedules())
            setIsLoading(false)
        }, 500)
    }, [id])

    // Update settings form when xmlData changes
    useEffect(() => {
        if (xmlData) {
            setSettingsForm({
                name: xmlData.title,
                dailyBudget: xmlData.dailyBudget,
                monthlyBudget: xmlData.monthlyBudget,
                status: xmlData.status,
                notes: xmlData.notes || '',
                downloadMethod: xmlData.downloadMethod || 'url',
                xmlContentType: xmlData.xmlContentType || 'mix',
                country: xmlData.country,
                currency: xmlData.currency || 'USD',
                xmlUrl: xmlData.feedXmlUrl,
                jobField: xmlData.jobField || '',
                // New fields
                requiresDownload: xmlData.requiresDownload || false,
                xmlFeedName: xmlData.xmlFeedName || '',
                partnerPassingLogo: xmlData.partnerPassingLogo || false,
                assignZipCoordinates: xmlData.assignZipCoordinates || false,
                partnerPassingCoordinates: xmlData.partnerPassingCoordinates || false,
                latitudeField: xmlData.latitudeField || '',
                longitudeField: xmlData.longitudeField || '',
                partnerPassingCategory: xmlData.partnerPassingCategory || false,
                overrideBlueCollarFlag: xmlData.overrideBlueCollarFlag || false,
                remoteJobDetection: xmlData.remoteJobDetection || false,
                logoField: xmlData.logoField || '',
                runningFrequency: xmlData.runningFrequency || 2,
                intervalWaitingTime: xmlData.intervalWaitingTime || '04:30:00',
                revenueType: xmlData.revenueType || 'yes_paid',
                pricingType: xmlData.pricingType || 'cpc',
                flatCpcOverride: xmlData.flatCpcOverride || 0,
                cpaTcpa: xmlData.cpaTcpa ?? 0,
                optimizationLogic: xmlData.optimizationLogic ?? null,
                cpcScrubPercent: xmlData.cpcScrubPercent || 0,
                agencyFeeScrubPercent: xmlData.agencyFeeScrubPercent || 0,
                minimumCpc: xmlData.minimumCpc || 0,
                allowInEmail: xmlData.allowInEmail || false,
                allowInSms: xmlData.allowInSms || false,
                additionalUrlParams: xmlData.additionalUrlParams || [],
                acr: xmlData.acr || 0,
                xmlSplitCampaigns: xmlData.xmlSplitCampaigns || [],
                originsInclude: xmlData.originsInclude || '',
                originsExclude: xmlData.originsExclude || '',
            })
        }
    }, [xmlData])

    const handleTriggerParse = () => {
        // Simulate triggering a parse
        alert('Index triggered successfully!')
    }

    const handleDuplicate = () => {
        // Show dialog to ask for campaign name
        setDuplicateCampaignName(`${xmlData?.nickname || xmlData?.title || 'Campaign'} (Copy)`)
        setShowDuplicateDialog(true)
    }

    const handleConfirmDuplicate = () => {
        // Simulate duplicating the XML feed with the new name
        const newId = Date.now().toString()
        // TODO: In real implementation, you would pass the duplicateCampaignName to the API
        window.location.href = `/dashboard/ads/xml/${newId}`
    }

    const handleSaveSettings = () => {
        if (xmlData && settingsForm) {
            // Simulate API call to save settings
            setXmlData({
                ...xmlData,
                title: settingsForm.name,
                dailyBudget: settingsForm.dailyBudget,
                monthlyBudget: settingsForm.monthlyBudget,
                status: settingsForm.status,
                notes: settingsForm.notes,
                downloadMethod: settingsForm.downloadMethod,
                xmlContentType: settingsForm.xmlContentType,
                country: settingsForm.country,
                currency: settingsForm.currency,
                feedXmlUrl: settingsForm.xmlUrl,
                jobField: settingsForm.jobField,
                // New fields
                requiresDownload: settingsForm.requiresDownload,
                xmlFeedName: settingsForm.xmlFeedName,
                partnerPassingLogo: settingsForm.partnerPassingLogo,
                assignZipCoordinates: settingsForm.assignZipCoordinates,
                partnerPassingCoordinates: settingsForm.partnerPassingCoordinates,
                latitudeField: settingsForm.latitudeField,
                longitudeField: settingsForm.longitudeField,
                partnerPassingCategory: settingsForm.partnerPassingCategory,
                overrideBlueCollarFlag: settingsForm.overrideBlueCollarFlag,
                remoteJobDetection: settingsForm.remoteJobDetection,
                logoField: settingsForm.logoField,
                runningFrequency: settingsForm.runningFrequency,
                intervalWaitingTime: settingsForm.intervalWaitingTime,
                revenueType: settingsForm.revenueType,
                pricingType: settingsForm.pricingType,
                flatCpcOverride: settingsForm.flatCpcOverride,
                cpaTcpa: settingsForm.cpaTcpa,
                optimizationLogic: settingsForm.optimizationLogic,
                cpcScrubPercent: settingsForm.cpcScrubPercent,
                agencyFeeScrubPercent: settingsForm.agencyFeeScrubPercent,
                minimumCpc: settingsForm.minimumCpc,
                allowInEmail: settingsForm.allowInEmail,
                allowInSms: settingsForm.allowInSms,
                acr: settingsForm.acr,
                xmlSplitCampaigns: settingsForm.xmlSplitCampaigns,
                additionalUrlParams: settingsForm.additionalUrlParams,
            })
            alert('Settings saved successfully!')
        }
    }

    const handleResetSettings = () => {
        if (xmlData) {
            setSettingsForm({
                name: xmlData.title,
                dailyBudget: xmlData.dailyBudget,
                monthlyBudget: xmlData.monthlyBudget,
                status: xmlData.status,
                notes: xmlData.notes || '',
                downloadMethod: xmlData.downloadMethod || 'url',
                xmlContentType: xmlData.xmlContentType || 'mix',
                country: xmlData.country,
                currency: xmlData.currency || 'USD',
                xmlUrl: xmlData.feedXmlUrl,
                jobField: xmlData.jobField || '',
                // New fields
                requiresDownload: xmlData.requiresDownload || false,
                xmlFeedName: xmlData.xmlFeedName || '',
                partnerPassingLogo: xmlData.partnerPassingLogo || false,
                assignZipCoordinates: xmlData.assignZipCoordinates || false,
                partnerPassingCoordinates: xmlData.partnerPassingCoordinates || false,
                latitudeField: xmlData.latitudeField || '',
                longitudeField: xmlData.longitudeField || '',
                partnerPassingCategory: xmlData.partnerPassingCategory || false,
                overrideBlueCollarFlag: xmlData.overrideBlueCollarFlag || false,
                remoteJobDetection: xmlData.remoteJobDetection || false,
                logoField: xmlData.logoField || '',
                runningFrequency: xmlData.runningFrequency || 2,
                intervalWaitingTime: xmlData.intervalWaitingTime || '04:30:00',
                revenueType: xmlData.revenueType || 'yes_paid',
                pricingType: xmlData.pricingType || 'cpc',
                flatCpcOverride: xmlData.flatCpcOverride || 0,
                cpaTcpa: xmlData.cpaTcpa ?? 0,
                optimizationLogic: xmlData.optimizationLogic ?? null,
                cpcScrubPercent: xmlData.cpcScrubPercent || 0,
                agencyFeeScrubPercent: xmlData.agencyFeeScrubPercent || 0,
                minimumCpc: xmlData.minimumCpc || 0,
                allowInEmail: xmlData.allowInEmail || false,
                allowInSms: xmlData.allowInSms || false,
                acr: xmlData.acr || 0,
                xmlSplitCampaigns: xmlData.xmlSplitCampaigns || [],
                additionalUrlParams: xmlData.additionalUrlParams || [],
            })
        }
    }

    const handleAddXmlSplitCampaign = () => {
        const newCampaign: XmlSplitCampaign = {
            id: Date.now().toString(),
            nodeIdentifier: '',
            logic: 'INLIST',
            value: '',
        }
        setSettingsForm({
            ...settingsForm,
            xmlSplitCampaigns: [...(settingsForm.xmlSplitCampaigns || []), newCampaign],
        })
    }

    const handleRemoveXmlSplitCampaign = (id: string) => {
        setSettingsForm({
            ...settingsForm,
            xmlSplitCampaigns: (settingsForm.xmlSplitCampaigns || []).filter(c => c.id !== id),
        })
    }

    const handleUpdateXmlSplitCampaign = (id: string, field: keyof XmlSplitCampaign, value: string) => {
        setSettingsForm({
            ...settingsForm,
            xmlSplitCampaigns: (settingsForm.xmlSplitCampaigns || []).map(c =>
                c.id === id ? { ...c, [field]: value } : c
            ),
        })
    }

    const handleAddAdditionalUrlParam = () => {
        const newParam: AdditionalUrlParam = {
            id: Date.now().toString(),
            name: '',
            value: '',
        }
        setSettingsForm({
            ...settingsForm,
            additionalUrlParams: [...(settingsForm.additionalUrlParams || []), newParam],
        })
    }

    const handleRemoveAdditionalUrlParam = (id: string) => {
        setSettingsForm({
            ...settingsForm,
            additionalUrlParams: (settingsForm.additionalUrlParams || []).filter(p => p.id !== id),
        })
    }

    const handleUpdateAdditionalUrlParam = (id: string, field: keyof AdditionalUrlParam, value: string) => {
        setSettingsForm({
            ...settingsForm,
            additionalUrlParams: (settingsForm.additionalUrlParams || []).map(p =>
                p.id === id ? { ...p, [field]: value } : p
            ),
        })
    }

    const handleUpdateFieldMapping = (index: number, value: string) => {
        const updatedMapping = [...fieldMapping]
        updatedMapping[index].partnerField = value
        setFieldMapping(updatedMapping)
    }

    const handleAddUrlVariableReplacement = () => {
        const newReplacement: UrlVariableReplacement = {
            id: Date.now().toString(),
            variable: '',
            replacement: '',
        }
        setUrlVariableReplacements([...urlVariableReplacements, newReplacement])
    }

    const handleRemoveUrlVariableReplacement = (id: string) => {
        setUrlVariableReplacements(urlVariableReplacements.filter(r => r.id !== id))
    }

    const handleUpdateUrlVariableReplacement = (id: string, field: keyof UrlVariableReplacement, value: string) => {
        setUrlVariableReplacements(
            urlVariableReplacements.map(r =>
                r.id === id ? { ...r, [field]: value } : r
            )
        )
    }

    const getStatusVariant = (status: XmlAdStatus | ParsingStatus) => {
        switch (status) {
            case 'active':
            case 'success':
                return 'default'
            case 'paused':
            case 'pending':
                return 'secondary'
            case 'failed':
            case 'inactive':
                return 'destructive'
            case 'running':
                return 'default'
            default:
                return 'secondary'
        }
    }

    // Schedule handlers
    const scheduleList = Object.values(schedules)

    const openAddSchedule = () => {
        setEditingSchedule(null)
        setScheduleForm({
            name: '',
            startTime: '09:00',
            endTime: '17:00',
            days: [],
            status: 'active',
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!xmlData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">XML feed not found</div>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard/ads/xml">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to XMLs
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{xmlData.title}</h1>
                        <p className="text-muted-foreground">{xmlData.uniqueId}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleTriggerParse}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Index Now
                        </Button>
                        <Button variant="outline" onClick={handleDuplicate}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/audit-logs">
                                <FileText className="h-4 w-4 mr-2" />
                                View Audit Logs
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList variant="line">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="parsing-logs">Parsing Logs</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="schedules">Schedules</TabsTrigger>
                    <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Status Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Campaign Status</span>
                                        <Badge variant={getStatusVariant(xmlData.status)}>
                                            {xmlData.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Parsing Status</span>
                                        <Badge variant={getStatusVariant(xmlData.parsingStatus)}>
                                            {xmlData.parsingStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Jobs Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Total Jobs</span>
                                        <span className="text-sm font-semibold">{xmlData.totalJobs.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Active Jobs</span>
                                        <span className="text-sm font-semibold">{xmlData.activeJobs.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Today</span>
                                        <span className="text-sm font-semibold">${xmlData.todayRevenue?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Yesterday</span>
                                        <span className="text-sm font-semibold">${xmlData.yesterdayRevenue?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">SDLW</span>
                                        <span className="text-sm font-semibold">${xmlData.sdlwRevenue?.toFixed(2) || '0.00'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Title</p>
                                        <p className="font-medium">{settingsForm.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Nickname</p>
                                        <p className="font-medium">{xmlData.nickname}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Description</p>
                                        <p className="text-sm">{xmlData.description || 'No description'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Partner</p>
                                        <Link
                                            href={`/dashboard/partners/${xmlData.partnerId}/xml`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {xmlData.partner}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Created At</p>
                                        <p className="text-sm">{xmlData.createdAt}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Updated At</p>
                                        <p className="text-sm">{xmlData.updatedAt}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* XML Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>XML Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Feed XML URL</p>
                                        <div className="flex items-center gap-2">
                                            <Code className="h-4 w-4 text-muted-foreground" />
                                            <a
                                                href={settingsForm.xmlUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline text-sm break-all"
                                            >
                                                {settingsForm.xmlUrl}
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge variant={getStatusVariant(settingsForm.status)}>
                                            {settingsForm.status}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Country</p>
                                        <p className="text-sm">{settingsForm.country}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Daily Budget</p>
                                        <p className="text-sm">${settingsForm.dailyBudget.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Monthly Budget</p>
                                        <p className="text-sm">${settingsForm.monthlyBudget.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Last Parsed</p>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{xmlData.lastParsed}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Next Parse</p>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{xmlData.nextParse}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={settingsForm.notes}
                                onChange={(e) => setSettingsForm({ ...settingsForm, notes: e.target.value })}
                                placeholder="Add notes, special instructions, or important information..."
                                rows={4}
                                className="resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (xmlData && settingsForm) {
                                            setXmlData({
                                                ...xmlData,
                                                notes: settingsForm.notes
                                            })
                                            alert('Notes saved successfully!')
                                        }
                                    }}
                                >
                                    Save Notes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Parsing Logs Tab */}
                <TabsContent value="parsing-logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Parsing Logs</CardTitle>
                            <CardDescription>Recent parsing activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Started At</TableHead>
                                            <TableHead>Finished At</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Jobs</TableHead>
                                            <TableHead className="text-right">BC Jobs</TableHead>
                                            <TableHead className="text-right">CPC Floor Skip</TableHead>
                                            <TableHead className="text-right">Location Skip</TableHead>
                                            <TableHead className="text-right">Remote Flags</TableHead>
                                            <TableHead className="text-right">Loc Lookups</TableHead>
                                            <TableHead>Countries</TableHead>
                                            <TableHead>Triggered As</TableHead>
                                            <TableHead>Errors</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parsingLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-sm">{log.startedAt}</TableCell>
                                                <TableCell className="text-sm">{log.finishedAt || '-'}</TableCell>
                                                <TableCell className="text-sm">{log.duration}</TableCell>
                                                <TableCell>
                                                    {log.status === 'success' && (
                                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                                            {log.status}
                                                        </Badge>
                                                    )}
                                                    {log.status === 'failed' && (
                                                        <Badge variant="destructive">
                                                            {log.status}
                                                        </Badge>
                                                    )}
                                                    {log.status === 'running' && (
                                                        <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                                                            {log.status}
                                                        </Badge>
                                                    )}
                                                    {log.status === 'pending' && (
                                                        <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                                            {log.status}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-right">{log.jobsCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-right">{log.bcJobsCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-right">{log.cpcFloorSkipCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-right">{log.locationSkipCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-right">{log.remoteFlagsCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm text-right">{log.locLookupsCount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm">{log.countryList}</TableCell>
                                                <TableCell className="text-sm">
                                                    <Badge variant="outline" className="text-xs">
                                                        {log.triggeredAs}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {log.errors ? (
                                                        <div className="flex items-center gap-1 text-red-600">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span className="text-xs">{log.errors}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">-</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                    {/* 1. General Settings */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">General</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Basic configuration settings</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Name</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    value={settingsForm.name}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                                    placeholder="XML feed name"
                                                />
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <FieldContent>
                                                <Select
                                                    value={settingsForm.status}
                                                    onValueChange={(value) => setSettingsForm({ ...settingsForm, status: value as XmlAdStatus })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statuses.map((status) => (
                                                            <SelectItem key={status.value} value={status.value}>
                                                                {status.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Daily Budget</FieldLabel>
                                                <FieldContent>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.dailyBudget}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, dailyBudget: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="pl-7"
                                                        />
                                                    </div>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Monthly Budget</FieldLabel>
                                                <FieldContent>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.monthlyBudget}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, monthlyBudget: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="pl-7"
                                                        />
                                                    </div>
                                                </FieldContent>
                                            </Field>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Country</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.country}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, country: value })}
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
                                                <FieldLabel>Currency</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.currency}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, currency: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {currencies.map((currency) => (
                                                                <SelectItem key={currency.value} value={currency.value}>
                                                                    {currency.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>
                                        </div>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Additional Notes */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Additional Notes</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Add any extra information or instructions</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <Field>
                                            <FieldContent>
                                                <Textarea
                                                    value={settingsForm.notes}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, notes: e.target.value })}
                                                    placeholder="Add notes, special instructions, or important information..."
                                                    rows={4}
                                                />
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Feed Configuration */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Feed Configuration</h4>
                                    <p className="text-xs text-muted-foreground mt-1">XML feed source and download settings</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>XML URL</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="url"
                                                    value={settingsForm.xmlUrl}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, xmlUrl: e.target.value })}
                                                    placeholder="https://example.com/feed.xml"
                                                />
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Job Field</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    value={settingsForm.jobField}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, jobField: e.target.value })}
                                                    placeholder="e.g., technology, healthcare, finance"
                                                />
                                            </FieldContent>
                                        </Field>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Does the feed requires to be downloaded?</FieldLabel>
                                                <p className="text-xs text-muted-foreground">
                                                    Note: If "No" its selected the system will parse the feed using the direct link. e.g: https://example.com/feed.xml or https://example.com/feed.xml.gz
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settingsForm.requiresDownload}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, requiresDownload: checked })}
                                            />
                                        </div>
                                        {settingsForm.requiresDownload && (
                                            <Field>
                                                <FieldLabel>XML Feed Name</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={settingsForm.xmlFeedName}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, xmlFeedName: e.target.value })}
                                                        placeholder="feed_name"
                                                    />
                                                </FieldContent>
                                            </Field>
                                        )}
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Download Method</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.downloadMethod}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, downloadMethod: value as 'url' | 'ftp' | 's3' })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {downloadMethods.map((method) => (
                                                                <SelectItem key={method.value} value={method.value}>
                                                                    {method.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>XML Content Type</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.xmlContentType}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, xmlContentType: value as any })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {xmlContentTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FieldContent>
                                            </Field>
                                        </div>

                                        {/* FTP Configuration */}
                                        {settingsForm.downloadMethod === 'ftp' && (
                                            <>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field>
                                                        <FieldLabel>Protocol</FieldLabel>
                                                        <FieldContent>
                                                            <Select
                                                                value={settingsForm.ftpProtocol}
                                                                onValueChange={(value) => setSettingsForm({ ...settingsForm, ftpProtocol: value as 'FTP' | 'SFTP' })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="FTP">FTP</SelectItem>
                                                                    <SelectItem value="SFTP">SFTP</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FieldContent>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Port</FieldLabel>
                                                        <FieldContent>
                                                            <Input
                                                                type="number"
                                                                value={settingsForm.ftpPort || 21}
                                                                onChange={(e) => setSettingsForm({ ...settingsForm, ftpPort: parseInt(e.target.value) || 21 })}
                                                                placeholder="21"
                                                                required
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                </div>
                                                <Field>
                                                    <FieldLabel>Host</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.ftpHost || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, ftpHost: e.target.value })}
                                                            placeholder="ftp.example.com"
                                                            required
                                                        />
                                                    </FieldContent>
                                                </Field>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field>
                                                        <FieldLabel>Username</FieldLabel>
                                                        <FieldContent>
                                                            <Input
                                                                value={settingsForm.ftpUsername || ''}
                                                                onChange={(e) => setSettingsForm({ ...settingsForm, ftpUsername: e.target.value })}
                                                                placeholder="username"
                                                                required
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Password</FieldLabel>
                                                        <FieldContent>
                                                            <Input
                                                                type="password"
                                                                value={settingsForm.ftpPassword || ''}
                                                                onChange={(e) => setSettingsForm({ ...settingsForm, ftpPassword: e.target.value })}
                                                                placeholder="••••••••"
                                                                required
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                </div>
                                                <Field>
                                                    <FieldLabel>Full File Path & Name</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.ftpFilePath || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, ftpFilePath: e.target.value })}
                                                            placeholder="/path/to/jobs.xml"
                                                            required
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </>
                                        )}

                                        {/* S3 Configuration */}
                                        {settingsForm.downloadMethod === 's3' && (
                                            <>
                                                <Field>
                                                    <FieldLabel>S3 Bucket</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.s3Bucket || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, s3Bucket: e.target.value })}
                                                            placeholder="my-bucket-name"
                                                            required
                                                        />
                                                    </FieldContent>
                                                </Field>
                                                <Field>
                                                    <FieldLabel>S3 Key</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.s3Key || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, s3Key: e.target.value })}
                                                            placeholder="path/to/jobs.xml"
                                                            required
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </>
                                        )}
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Content & Branding */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Content & Branding</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure content fields and branding options</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>It's the partner passing the company's logo?</FieldLabel>
                                                <p className="text-xs text-muted-foreground">
                                                    Note: If "No" its selected the system will get the logo from our DB or will set a default one.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settingsForm.partnerPassingLogo}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, partnerPassingLogo: checked })}
                                            />
                                        </div>
                                        {settingsForm.partnerPassingLogo && (
                                            <Field>
                                                <FieldLabel>Logo Field</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        value={settingsForm.logoField || ''}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, logoField: e.target.value })}
                                                        placeholder="e.g., logo, company_logo, image_url"
                                                    />
                                                </FieldContent>
                                            </Field>
                                        )}
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>It's the partner passing the category field?</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.partnerPassingCategory}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, partnerPassingCategory: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Override BlueCollar Flag Logic?</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.overrideBlueCollarFlag}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, overrideBlueCollarFlag: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Remote Job Detection & Expansion</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.remoteJobDetection}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, remoteJobDetection: checked })}
                                            />
                                        </div>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Location Settings */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Location Settings</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure location and coordinate handling</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Would you like the system to assign the zip code and coordinates (lat/lon) based on raw location? (city/state)</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.assignZipCoordinates}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, assignZipCoordinates: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>It's the partner passing (coordinates) lat/lon?</FieldLabel>
                                                <p className="text-xs text-muted-foreground">
                                                    Note: If "No" its selected the system will get the coordinates based on the zip code.
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settingsForm.partnerPassingCoordinates}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, partnerPassingCoordinates: checked })}
                                            />
                                        </div>
                                        {settingsForm.partnerPassingCoordinates && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field>
                                                    <FieldLabel>Latitude Field</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.latitudeField}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, latitudeField: e.target.value })}
                                                            placeholder="lat"
                                                        />
                                                    </FieldContent>
                                                </Field>
                                                <Field>
                                                    <FieldLabel>Longitude Field</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            value={settingsForm.longitudeField}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, longitudeField: e.target.value })}
                                                            placeholder="lon"
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            </div>
                                        )}
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 6. Feed Adjustments */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Feed Adjustments</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure CPC scrubbing and minimum values</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Field>
                                                <FieldLabel>CPC Scrub %</FieldLabel>
                                                <FieldContent>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.cpcScrubPercent || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, cpcScrubPercent: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="pl-7"
                                                        />
                                                    </div>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Agency Fee Scrub %</FieldLabel>
                                                <FieldContent>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.agencyFeeScrubPercent || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, agencyFeeScrubPercent: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="pl-7"
                                                        />
                                                    </div>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Minimum CPC</FieldLabel>
                                                <FieldContent>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.minimumCpc || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, minimumCpc: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                            className="pl-7"
                                                        />
                                                    </div>
                                                </FieldContent>
                                            </Field>
                                        </div>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 7. Content Access */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Content Access</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure content distribution channels</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Allow In Email</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.allowInEmail}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, allowInEmail: checked })}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between space-y-0">
                                            <div className="space-y-0.5">
                                                <FieldLabel>Allow in SMS</FieldLabel>
                                            </div>
                                            <Switch
                                                checked={settingsForm.allowInSms}
                                                onCheckedChange={(checked) => setSettingsForm({ ...settingsForm, allowInSms: checked })}
                                            />
                                        </div>
                                        <Field>
                                            <FieldLabel>ACR</FieldLabel>
                                            <FieldContent>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={settingsForm.acr || ''}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, acr: parseFloat(e.target.value) || 0 })}
                                                        placeholder="0.00"
                                                        className="pl-7"
                                                    />
                                                </div>
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 8. Pricing */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Pricing</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure revenue and pricing models</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Field>
                                                <FieldLabel>Revenue Type</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.revenueType}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, revenueType: value as 'yes_paid' | 'no_paid' })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {revenueTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <p className="text-xs text-muted-foreground mt-1.5">Flag For Organic Jobs. These are accessable via a param on request.</p>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Pricing Type</FieldLabel>
                                                <FieldContent>
                                                    <Select
                                                        value={settingsForm.pricingType}
                                                        onValueChange={(value) => setSettingsForm({ ...settingsForm, pricingType: value as 'cpc' | 'cpa' | 'tcpa' })}
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
                                            {settingsForm.pricingType === 'cpc' ? (
                                                <Field>
                                                    <FieldLabel>Flat CPC Override</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={settingsForm.flatCpcOverride || ''}
                                                            onChange={(e) => setSettingsForm({ ...settingsForm, flatCpcOverride: parseFloat(e.target.value) || 0 })}
                                                            placeholder="0.00"
                                                        />
                                                    </FieldContent>
                                                </Field>
                                            ) : (
                                                <>
                                                    <Field>
                                                        <FieldLabel>CPA/TCPA</FieldLabel>
                                                        <FieldContent>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                value={settingsForm.cpaTcpa || ''}
                                                                onChange={(e) => setSettingsForm({ ...settingsForm, cpaTcpa: parseFloat(e.target.value) || 0 })}
                                                                placeholder="0.00"
                                                            />
                                                        </FieldContent>
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel>Optimization Logic</FieldLabel>
                                                        <FieldContent>
                                                            <Select
                                                                value={settingsForm.optimizationLogic === null ? 'null' : String(settingsForm.optimizationLogic)}
                                                                onValueChange={(value) => setSettingsForm({
                                                                    ...settingsForm,
                                                                    optimizationLogic: value === 'null' ? null : (parseInt(value) as 0 | 1 | 2)
                                                                })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {optimizationLogicOptions.map((option) => (
                                                                        <SelectItem key={option.value} value={option.value}>
                                                                            {option.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <p className="text-xs text-muted-foreground mt-1.5">All optimizations are Job ID level (currently)</p>
                                                        </FieldContent>
                                                    </Field>
                                                </>
                                            )}
                                        </div>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 9. Crawl Frequency */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Crawl Frequency</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure crawling and waiting time intervals</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Running Frequency</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        type="number"
                                                        value={settingsForm.runningFrequency || ''}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, runningFrequency: parseInt(e.target.value) || 2 })}
                                                        placeholder="2"
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-1.5">Default Frequency : 2</p>
                                                </FieldContent>
                                            </Field>
                                            <Field>
                                                <FieldLabel>Interval Waiting time</FieldLabel>
                                                <FieldContent>
                                                    <Input
                                                        type="time"
                                                        step="1"
                                                        value={settingsForm.intervalWaitingTime || ''}
                                                        onChange={(e) => setSettingsForm({ ...settingsForm, intervalWaitingTime: e.target.value })}
                                                        placeholder="04:30:00"
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-1.5">Default waiting time(HH:mm:ss) 04:30:00. Should follow this format HH:mm:ss</p>
                                                </FieldContent>
                                            </Field>
                                        </div>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 10. Origins Filters */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Origins Filters</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure origin inclusion and exclusion filters</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Origins Include</FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    value={settingsForm.originsInclude || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, originsInclude: e.target.value })}
                                                    placeholder="Enter origins to include, one per line..."
                                                    rows={4}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1.5">
                                                    Enter one origin per line to include only these origins
                                                </p>
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Origins Exclude</FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    value={settingsForm.originsExclude || ''}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, originsExclude: e.target.value })}
                                                    placeholder="Enter origins to exclude, one per line..."
                                                    rows={4}
                                                />
                                                <p className="text-xs text-muted-foreground mt-1.5">
                                                    Enter one origin per line to exclude these origins
                                                </p>
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 11. XML Split Campaigns by Value */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">XML Split Campaigns by Value</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure XML node detection and splitting rules</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <div className="space-y-4">
                                        <div className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[30%]">Node Identifier To Detect</TableHead>
                                                        <TableHead className="w-[25%]">Logic</TableHead>
                                                        <TableHead className="w-[35%]">Value</TableHead>
                                                        <TableHead className="w-[10%]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(settingsForm.xmlSplitCampaigns || []).map((campaign) => (
                                                        <TableRow key={campaign.id}>
                                                            <TableCell>
                                                                <Input
                                                                    value={campaign.nodeIdentifier}
                                                                    onChange={(e) => handleUpdateXmlSplitCampaign(campaign.id, 'nodeIdentifier', e.target.value)}
                                                                    placeholder="e.g., job_type"
                                                                    className="h-8"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Select
                                                                    value={campaign.logic}
                                                                    onValueChange={(value) => handleUpdateXmlSplitCampaign(campaign.id, 'logic', value)}
                                                                >
                                                                    <SelectTrigger className="h-8">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {xmlSplitLogics.map((logic) => (
                                                                            <SelectItem key={logic.value} value={logic.value}>
                                                                                {logic.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    value={campaign.value}
                                                                    onChange={(e) => handleUpdateXmlSplitCampaign(campaign.id, 'value', e.target.value)}
                                                                    placeholder="e.g., full-time"
                                                                    className="h-8"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveXmlSplitCampaign(campaign.id)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {(settingsForm.xmlSplitCampaigns || []).length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-4">
                                                                No campaign rules added yet
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddXmlSplitCampaign}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Campaign Rule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 11. Additional URL Params */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Additional URL Params</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure extra URL parameters for the feed</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <div className="space-y-4">
                                        <div className="border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[42%]">Param Name</TableHead>
                                                        <TableHead className="w-[8%] text-center"></TableHead>
                                                        <TableHead className="w-[42%]">Param Value</TableHead>
                                                        <TableHead className="w-[8%]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(settingsForm.additionalUrlParams || []).map((param) => (
                                                        <TableRow key={param.id}>
                                                            <TableCell>
                                                                <Input
                                                                    value={param.name}
                                                                    onChange={(e) => handleUpdateAdditionalUrlParam(param.id, 'name', e.target.value)}
                                                                    placeholder="e.g., source"
                                                                    className="h-7 text-sm"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    value={param.value}
                                                                    onChange={(e) => handleUpdateAdditionalUrlParam(param.id, 'value', e.target.value)}
                                                                    placeholder="e.g., api"
                                                                    className="h-7 text-sm"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveAdditionalUrlParam(param.id)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {(settingsForm.additionalUrlParams || []).length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-4">
                                                                No URL parameters added yet
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddAdditionalUrlParam}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add URL Parameter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 12. Field Mapping */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Field Mapping</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Map your partner's XML fields to our system fields</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <div className="border overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[45%]">Our Fields</TableHead>
                                                    <TableHead className="w-[10%] text-center"></TableHead>
                                                    <TableHead className="w-[45%]">Partner Fields</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fieldMapping.map((field, index) => (
                                                    <TableRow key={field.ourField}>
                                                        <TableCell>
                                                            <Input
                                                                value={field.ourField}
                                                                disabled
                                                                className="h-7 text-sm bg-muted/30"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                value={field.partnerField}
                                                                onChange={(e) => handleUpdateFieldMapping(index, e.target.value)}
                                                                placeholder="Partner field"
                                                                className="h-7 text-sm"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 13. URL Variable Replacement */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">URL Variable Replacement</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure variable replacements for URLs</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <div className="space-y-4">
                                        <div className="border overflow-hidden">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[42%]">Variable</TableHead>
                                                        <TableHead className="w-[8%] text-center"></TableHead>
                                                        <TableHead className="w-[42%]">Replacement</TableHead>
                                                        <TableHead className="w-[8%]"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {urlVariableReplacements.map((replacement) => (
                                                        <TableRow key={replacement.id}>
                                                            <TableCell>
                                                                <Input
                                                                    value={replacement.variable}
                                                                    onChange={(e) => handleUpdateUrlVariableReplacement(replacement.id, 'variable', e.target.value)}
                                                                    placeholder="e.g., {job_id}"
                                                                    className="h-7 text-sm"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    value={replacement.replacement}
                                                                    onChange={(e) => handleUpdateUrlVariableReplacement(replacement.id, 'replacement', e.target.value)}
                                                                    placeholder="e.g., id"
                                                                    className="h-7 text-sm"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveUrlVariableReplacement(replacement.id)}
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    {urlVariableReplacements.length === 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} className="text-center text-muted-foreground text-sm py-4">
                                                                No variable replacements added yet
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddUrlVariableReplacement}
                                            className="w-full"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Variable Replacement
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="sticky bottom-0 bg-background border-t p-4 -mx-4">
                        <div className="flex gap-2 justify-end">
                            <Button onClick={handleSaveSettings}>Save Settings</Button>
                            <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
                        </div>
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

                {/* Audit Logs Tab */}
                <TabsContent value="audit-logs" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                            <CardDescription>Track all changes and activities related to this XML feed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {auditLogs.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No audit logs available</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Timestamp</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Entity</TableHead>
                                            <TableHead>Changes</TableHead>
                                            <TableHead>IP Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {auditLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                                                <TableCell>{log.user}</TableCell>
                                                <TableCell>
                                                    <Badge variant={log.action === 'Deleted' ? 'destructive' : 'secondary'}>
                                                        {log.action}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{log.entity} (ID: {log.entityId})</TableCell>
                                                <TableCell className="max-w-md truncate">{log.changes}</TableCell>
                                                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

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

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <FieldContent>
                                <Select
                                    value={scheduleForm.status}
                                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, status: value as 'active' | 'paused' })}
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

            {/* Duplicate Campaign Dialog */}
            <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Duplicate Campaign</DialogTitle>
                        <DialogDescription>
                            Enter a name for the duplicated campaign
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Field>
                            <FieldLabel>Campaign Name *</FieldLabel>
                            <FieldContent>
                                <Input
                                    value={duplicateCampaignName}
                                    onChange={(e) => setDuplicateCampaignName(e.target.value)}
                                    placeholder="e.g., My Campaign (Copy)"
                                    autoFocus
                                />
                            </FieldContent>
                        </Field>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDuplicate}
                            disabled={!duplicateCampaignName.trim()}
                        >
                            Duplicate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
