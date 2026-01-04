"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeftIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  ImageIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type ListicleAd = {
  id: string
  name: string
  description?: string
  image?: string
}

type ListicleFormData = {
  title: string
  url: string
  listicleDesignStyle: string
  articleStyle: string
  showSmsForm: boolean
  description: string
  image: string
  alt: string
  caption: string
  leftListicleAds: ListicleAd[]
  rightListicleAds: ListicleAd[]
}

// Mock data for available ads
const availableAds: ListicleAd[] = [
  { id: '1', name: 'Remote Job Board', description: 'Find remote opportunities', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop' },
  { id: '2', name: 'Career Coaching', description: 'Professional guidance', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop' },
  { id: '3', name: 'Resume Builder', description: 'Create perfect resumes', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop' },
  { id: '4', name: 'Interview Prep', description: 'Ace your interviews', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop' },
  { id: '5', name: 'Skill Development', description: 'Learn new skills', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
]

// Mock listicle data
const mockListicleData: Record<string, ListicleFormData> = {
  '1': {
    title: 'Top 10 Remote Work Tools',
    url: 'top-10-remote-work-tools',
    listicleDesignStyle: 'modern',
    articleStyle: 'narrative',
    showSmsForm: true,
    description: 'Discover the best tools for remote work productivity and collaboration in this comprehensive guide.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    alt: 'Remote work setup with laptop and coffee',
    caption: 'The perfect remote workspace setup',
    leftListicleAds: [
      { id: '1', name: 'Remote Job Board', description: 'Find remote opportunities' },
      { id: '3', name: 'Resume Builder', description: 'Create perfect resumes' },
    ],
    rightListicleAds: [
      { id: '2', name: 'Career Coaching', description: 'Professional guidance', image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop' },
    ],
  },
}

const designStyleOptions = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
]

const articleStyleOptions = [
  { value: 'narrative', label: 'Narrative' },
  { value: 'list', label: 'List Format' },
  { value: 'comparison', label: 'Comparison' },
  { value: 'tutorial', label: 'Tutorial' },
]

export default function EditListiclePage() {
  const router = useRouter()
  const params = useParams()
  const listicleId = params.id as string

  const [formData, setFormData] = useState<ListicleFormData>({
    title: '',
    url: '',
    listicleDesignStyle: 'modern',
    articleStyle: 'narrative',
    showSmsForm: false,
    description: '',
    image: '',
    alt: '',
    caption: '',
    leftListicleAds: [],
    rightListicleAds: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteAdId, setDeleteAdId] = useState<{ side: 'left' | 'right', id: string } | null>(null)

  useEffect(() => {
    loadListicle()
  }, [listicleId])

  const loadListicle = () => {
    const data = mockListicleData[listicleId]
    if (data) {
      setFormData(data)
    }
    setIsLoading(false)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title || formData.title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters'
    }

    if (!formData.url || formData.url.length < 2) {
      newErrors.url = 'URL is required'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.image) {
      newErrors.image = 'Image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push('/dashboard/ads/listicles')
  }

  const handleAddLeftAd = (adId: string) => {
    const ad = availableAds.find(a => a.id === adId)
    if (ad && !formData.leftListicleAds.find(a => a.id === adId)) {
      setFormData(prev => ({
        ...prev,
        leftListicleAds: [...prev.leftListicleAds, { id: ad.id, name: ad.name, description: ad.description }],
      }))
    }
  }

  const handleAddRightAd = (adId: string) => {
    const ad = availableAds.find(a => a.id === adId)
    if (ad && !formData.rightListicleAds.find(a => a.id === adId)) {
      setFormData(prev => ({
        ...prev,
        rightListicleAds: [...prev.rightListicleAds, { id: ad.id, name: ad.name, image: ad.image }],
      }))
    }
  }

  const handleDeleteAd = (side: 'left' | 'right', adId: string) => {
    if (side === 'left') {
      setFormData(prev => ({
        ...prev,
        leftListicleAds: prev.leftListicleAds.filter(ad => ad.id !== adId),
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        rightListicleAds: prev.rightListicleAds.filter(ad => ad.id !== adId),
      }))
    }
    setDeleteAdId(null)
  }

  const getAvailableAdsForLeft = () => {
    return availableAds.filter(ad => !formData.leftListicleAds.find(a => a.id === ad.id))
  }

  const getAvailableAdsForRight = () => {
    return availableAds.filter(ad => !formData.rightListicleAds.find(a => a.id === ad.id))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading listicle...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/ads/listicles">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Edit Listicle</h1>
            <p className="text-sm text-muted-foreground">
              Update listicle details and content
            </p>
          </div>
        </div>
      </div>

      {/* General Card */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic information and media for the listicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Form Fields */}
            <div className="flex-1 space-y-4">
              <Field>
                <FieldLabel>Title *</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter listicle title"
                  />
                  {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>URL *</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.url}
                    onChange={e => setFormData({ ...formData, url: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="listicle-url-slug"
                    className="font-mono"
                  />
                  {errors.url && <p className="text-sm text-destructive mt-1">{errors.url}</p>}
                </FieldContent>
              </Field>

              <div className="flex gap-4">
                <Field className="flex-1">
                  <FieldLabel>Listicle Design Style</FieldLabel>
                  <FieldContent>
                    <Select
                      value={formData.listicleDesignStyle}
                      onValueChange={(value) => setFormData({ ...formData, listicleDesignStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {designStyleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Article Style</FieldLabel>
                  <FieldContent>
                    <Select
                      value={formData.articleStyle}
                      onValueChange={(value) => setFormData({ ...formData, articleStyle: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {articleStyleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Show SMS Form</FieldLabel>
                  <FieldContent>
                    <div className="flex items-center gap-2">
                      <input
                          type="checkbox"
                          id="showSmsForm"
                          checked={formData.showSmsForm}
                          onChange={(e) => setFormData({ ...formData, showSmsForm: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="showSmsForm" className="text-sm text-muted-foreground">
                        Enable SMS subscription form
                      </label>
                    </div>
                  </FieldContent>
                </Field>
              </div>

              <Field>
                <FieldLabel>Description *</FieldLabel>
                <FieldContent>
                  <Textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter listicle description..."
                    rows={4}
                  />
                  {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                </FieldContent>
              </Field>
            </div>

            {/* Right Column - Image */}
            <div className="w-full lg:w-80 space-y-4">
              <Field>
                <FieldLabel>Image *</FieldLabel>
                <FieldContent>
                  <div className="space-y-3">
                    {formData.image ? (
                      <div className="relative aspect-video overflow-hidden border bg-muted">
                        <img
                          src={formData.image}
                          alt={formData.alt || formData.title}
                          className="size-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground">
                        <ImageIcon className="size-8 mb-2" />
                        <span className="text-sm">No image selected</span>
                      </div>
                    )}
                    <Input
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="font-mono text-xs"
                    />
                    {errors.image && <p className="text-sm text-destructive mt-1">{errors.image}</p>}
                  </div>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Alt Text</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.alt}
                    onChange={e => setFormData({ ...formData, alt: e.target.value })}
                    placeholder="Image alt text for accessibility"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Caption</FieldLabel>
                <FieldContent>
                  <Input
                    value={formData.caption}
                    onChange={e => setFormData({ ...formData, caption: e.target.value })}
                    placeholder="Image caption"
                  />
                </FieldContent>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Manage ads displayed in this listicle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Text Ads */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Text Ads</h3>
                <Select onValueChange={handleAddLeftAd} value="">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add ad" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAdsForLeft().map((ad) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.leftListicleAds.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border">
                  No ads added yet
                </div>
              ) : (
                <div className="border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.leftListicleAds.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell className="font-medium">{ad.name}</TableCell>
                          <TableCell className="text-muted-foreground">{ad.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon-xs" asChild>
                                <Link href={`/dashboard/ads/${ad.id}`}>
                                  <EyeIcon className="size-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => setDeleteAdId({ side: 'left', id: ad.id })}
                                  >
                                    <TrashIcon className="size-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Ad</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove "{ad.name}" from text ads?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteAdId(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAd('left', ad.id)}>
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Right Column - Image Ads */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Image Ads</h3>
                <Select onValueChange={handleAddRightAd} value="">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Add ad" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAdsForRight().map((ad) => (
                      <SelectItem key={ad.id} value={ad.id}>
                        {ad.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.rightListicleAds.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border">
                  No ads added yet
                </div>
              ) : (
                <div className="border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead className="w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.rightListicleAds.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell className="font-medium">{ad.name}</TableCell>
                          <TableCell>
                            {ad.image && (
                              <div className="size-12 rounded overflow-hidden bg-muted">
                                <img
                                  src={ad.image}
                                  alt={ad.name}
                                  className="size-full object-cover"
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon-xs" asChild>
                                <Link href={`/dashboard/ads/${ad.id}`}>
                                  <EyeIcon className="size-4" />
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => setDeleteAdId({ side: 'right', id: ad.id })}
                                  >
                                    <TrashIcon className="size-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Ad</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove "{ad.name}" from image ads?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteAdId(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAd('right', ad.id)}>
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ads/listicles">
          <Button variant="outline" disabled={isSaving}>
            Cancel
          </Button>
        </Link>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
