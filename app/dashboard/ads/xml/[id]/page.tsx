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
import { ArrowLeft, BarChart3, Settings, Calendar, FileText, Eye, Plus, Pencil, Trash2, Play, Pause, Code, RefreshCw, Globe, Clock, DollarSign, AlertCircle, Copy } from 'lucide-react'
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
    cpcScrubPercent?: number
    agencyFeeScrubPercent?: number
    minimumCpc?: number
    allowInEmail?: boolean
    allowInSms?: boolean
    acr?: number
    xmlSplitCampaigns?: XmlSplitCampaign[]
    additionalUrlParams?: AdditionalUrlParam[]
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

interface ParsingLog {
    id: number
    timestamp: string
    status: ParsingStatus
    jobsProcessed: number
    duration: string
    errorMessage?: string
}

interface PerformanceMetric {
    date: string
    impressions: number
    clicks: number
    ctr: number
    revenue: number
    jobs: number
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
    }
}

const generateMockParsingLogs = (): ParsingLog[] => {
    const statuses: ParsingStatus[] = ['success', 'failed', 'running', 'pending']
    return [...Array(10)].map((_, idx) => {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        return {
            id: idx + 1,
            timestamp: format(new Date(Date.now() - idx * 3600000), 'MM/dd/yyyy HH:mm:ss'),
            status,
            jobsProcessed: Math.floor(Math.random() * 1000) + 100,
            duration: `${Math.floor(Math.random() * 60)}s`,
            errorMessage: status === 'failed' ? 'Connection timeout or invalid XML format' : undefined,
        }
    })
}

const generateMockPerformanceData = (): PerformanceMetric[] => {
    return [...Array(7)].map((_, idx) => ({
        date: format(new Date(Date.now() - idx * 86400000), 'MM/dd/yyyy'),
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 1000) + 100,
        ctr: Math.round((Math.random() * 5 + 1) * 100) / 100,
        revenue: Math.round((Math.random() * 500 + 50) * 100) / 100,
        jobs: Math.floor(Math.random() * 1000) + 100,
    }))
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
    const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [editForm, setEditForm] = useState<Partial<XmlAdData>>({})
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
        cpcScrubPercent?: number
        agencyFeeScrubPercent?: number
        minimumCpc?: number
        allowInEmail?: boolean
        allowInSms?: boolean
        acr?: number
        xmlSplitCampaigns?: XmlSplitCampaign[]
        additionalUrlParams?: AdditionalUrlParam[]
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
        cpcScrubPercent: 0,
        agencyFeeScrubPercent: 0,
        minimumCpc: 0,
        allowInEmail: false,
        allowInSms: false,
        acr: 0,
        additionalUrlParams: [],
        xmlSplitCampaigns: [],
    })

    // Load data on mount
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setXmlData(generateMockXmlAdData(id))
            setParsingLogs(generateMockParsingLogs())
            setPerformanceData(generateMockPerformanceData())
            setIsLoading(false)
        }, 500)
    }, [id])

    // Update edit form when xmlData changes
    useEffect(() => {
        if (xmlData) {
            setEditForm(xmlData)
        }
    }, [xmlData])

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
                cpcScrubPercent: xmlData.cpcScrubPercent || 0,
                agencyFeeScrubPercent: xmlData.agencyFeeScrubPercent || 0,
                minimumCpc: xmlData.minimumCpc || 0,
                allowInEmail: xmlData.allowInEmail || false,
                allowInSms: xmlData.allowInSms || false,
                additionalUrlParams: xmlData.additionalUrlParams || [],
                acr: xmlData.acr || 0,
                xmlSplitCampaigns: xmlData.xmlSplitCampaigns || [],
            })
        }
    }, [xmlData])

    const handleSave = () => {
        if (xmlData && editForm) {
            // Simulate API call to save
            setXmlData({ ...xmlData, ...editForm } as XmlAdData)
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        if (xmlData) {
            setEditForm(xmlData)
        }
        setIsEditing(false)
    }

    const handleTriggerParse = () => {
        // Simulate triggering a parse
        alert('Index triggered successfully!')
    }

    const handleDuplicate = () => {
        // Simulate duplicating the XML feed
        const newId = Date.now().toString()
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

    const getStatusColor = (status: ParsingStatus) => {
        switch (status) {
            case 'success':
                return 'text-green-600'
            case 'failed':
                return 'text-red-600'
            case 'running':
                return 'text-blue-600'
            case 'pending':
                return 'text-yellow-600'
            default:
                return 'text-gray-600'
        }
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
                        <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="parsing-logs">Parsing Logs</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
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

                        {/* Budget Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Daily Budget</span>
                                        <span className="text-sm font-semibold">${xmlData.dailyBudget.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Country</span>
                                        <span className="text-sm font-semibold">{xmlData.country}</span>
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
                                {isEditing ? (
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Title</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    value={editForm.title || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                />
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Nickname</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    value={editForm.nickname || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                                                />
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Description</FieldLabel>
                                            <FieldContent>
                                                <Textarea
                                                    value={editForm.description || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    rows={3}
                                                />
                                            </FieldContent>
                                        </Field>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={handleSave}>Save</Button>
                                            <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
                                        </div>
                                    </FieldGroup>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Title</p>
                                            <p className="font-medium">{xmlData.title}</p>
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
                                )}
                            </CardContent>
                        </Card>

                        {/* XML Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>XML Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isEditing ? (
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Feed XML URL</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="url"
                                                    value={editForm.feedXmlUrl || ''}
                                                    onChange={(e) => setEditForm({ ...editForm, feedXmlUrl: e.target.value })}
                                                />
                                            </FieldContent>
                                        </Field>
                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <FieldContent>
                                                <Select
                                                    value={editForm.status || xmlData.status}
                                                    onValueChange={(value) => setEditForm({ ...editForm, status: value as XmlAdStatus })}
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
                                        <Field>
                                            <FieldLabel>Country</FieldLabel>
                                            <FieldContent>
                                                <Select
                                                    value={editForm.country || xmlData.country}
                                                    onValueChange={(value) => setEditForm({ ...editForm, country: value })}
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
                                            <FieldLabel>Daily Budget</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.dailyBudget || xmlData.dailyBudget}
                                                    onChange={(e) => setEditForm({ ...editForm, dailyBudget: parseFloat(e.target.value) })}
                                                />
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Feed XML URL</p>
                                            <div className="flex items-center gap-2">
                                                <Code className="h-4 w-4 text-muted-foreground" />
                                                <a
                                                    href={xmlData.feedXmlUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline text-sm break-all"
                                                >
                                                    {xmlData.feedXmlUrl}
                                                </a>
                                            </div>
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
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Impressions</TableHead>
                                        <TableHead>Clicks</TableHead>
                                        <TableHead>CTR</TableHead>
                                        <TableHead>Jobs</TableHead>
                                        <TableHead>Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {performanceData.map((metric, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{metric.date}</TableCell>
                                            <TableCell>{metric.impressions.toLocaleString()}</TableCell>
                                            <TableCell>{metric.clicks.toLocaleString()}</TableCell>
                                            <TableCell>{metric.ctr}%</TableCell>
                                            <TableCell>{metric.jobs.toLocaleString()}</TableCell>
                                            <TableCell>${metric.revenue.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Jobs Processed</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Error Message</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsingLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.timestamp}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(log.status)} className={getStatusColor(log.status)}>
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{log.jobsProcessed.toLocaleString()}</TableCell>
                                            <TableCell>{log.duration}</TableCell>
                                            <TableCell>
                                                {log.errorMessage ? (
                                                    <div className="flex items-center gap-1 text-red-600">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <span className="text-sm">{log.errorMessage}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-4">
                    {/* General Settings */}
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
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feed Configuration Settings */}
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
                                            <FieldLabel>XML Feed Name</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    value={settingsForm.xmlFeedName}
                                                    onChange={(e) => setSettingsForm({ ...settingsForm, xmlFeedName: e.target.value })}
                                                    placeholder="feed_name"
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
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Crawl Frequency Settings */}
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

                    {/* Pricing Settings */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Pricing</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure revenue and pricing models</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
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
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feed Adjustments Settings */}
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

                    {/* Content Access Settings */}
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

                    {/* XML Split Campaigns by Value Settings */}
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

                    {/* Additional URL Params Settings */}
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
                                                        <TableHead className="w-[45%]">Param Name</TableHead>
                                                        <TableHead className="w-[45%]">Param Value</TableHead>
                                                        <TableHead className="w-[10%]"></TableHead>
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
                                                                    className="h-8"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Input
                                                                    value={param.value}
                                                                    onChange={(e) => handleUpdateAdditionalUrlParam(param.id, 'value', e.target.value)}
                                                                    placeholder="e.g., api"
                                                                    className="h-8"
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
                                                            <TableCell colSpan={3} className="text-center text-muted-foreground text-sm py-4">
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

                    {/* Location Settings */}
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
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content & Branding Settings */}
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
                                    </FieldGroup>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Regional Settings */}
                    <Card className='p-0'>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3">
                                <div className="p-6 border-b lg:border-b-0 lg:border-r bg-muted/50">
                                    <h4 className="font-medium text-sm">Regional Settings</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Configure country and currency options</p>
                                </div>
                                <div className="lg:col-span-2 p-6">
                                    <FieldGroup>
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

                    {/* Additional Notes */}
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

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button onClick={handleSaveSettings}>Save Settings</Button>
                        <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
