type PartnerStatus = 'active' | 'inactive' | 'pending' | 'suspended'
type PartnerType = 'internal' | 'external'
type ProductType = 'sponsored-ads' | 'xml-direct-listing' | 'publisher' | 'syndication'
type UserRole = 'main_user' | 'manager'

type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

type Partner = {
  id: string
  name: string
  type: PartnerType
  status: PartnerStatus
  email: string
  phone: string
  created_at: string
  users: User[]
  products: ProductType[]
}

// Predefined list of users available to be assigned to partners
export const availableUsers: User[] = [
  { id: 'u1', name: 'John Smith', email: 'john@company.com', role: 'main_user' },
  { id: 'u2', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'main_user' },
  { id: 'u3', name: 'Mike Chen', email: 'mike@company.com', role: 'main_user' },
  { id: 'u4', name: 'Lisa Park', email: 'lisa@company.com', role: 'main_user' },
  { id: 'u5', name: 'Tom Wilson', email: 'tom@company.com', role: 'main_user' },
  { id: 'u6', name: 'Emily Davis', email: 'emily@company.com', role: 'manager' },
  { id: 'u7', name: 'Alex Brown', email: 'alex@company.com', role: 'manager' },
  { id: 'u8', name: 'Jessica Lee', email: 'jessica@company.com', role: 'manager' },
  { id: 'u9', name: 'David Kim', email: 'david@company.com', role: 'manager' },
  { id: 'u10', name: 'Rachel Green', email: 'rachel@company.com', role: 'manager' },
]

// Helper function to generate a random date within the last 2 years
function randomDate(): string {
  const start = new Date(2022, 0, 1)
  const end = new Date(2024, 11, 31)
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

// Helper function to format phone number
function randomPhone(): string {
  const areaCode = Math.floor(200 + Math.random() * 800)
  const num1 = Math.floor(100 + Math.random() * 900)
  const num2 = Math.floor(1000 + Math.random() * 9000)
  return `+1 (${areaCode}) ${num1}-${num2}`
}

// Helper function to get random status
function randomStatus(): PartnerStatus {
  const statuses: PartnerStatus[] = ['active', 'active', 'active', 'inactive', 'pending', 'suspended']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Helper function to get random products
function randomProducts(): ProductType[] {
  const allProducts: ProductType[] = ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication']
  const count = Math.floor(Math.random() * 4) + 1
  const shuffled = allProducts.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to get random users
function randomUsers(): User[] {
  const userCount = Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0
  if (userCount === 0) return []

  const users: User[] = []
  const usedUserIndices = new Set<number>()

  // Always add a main user if there are users
  let mainUserIndex = Math.floor(Math.random() * availableUsers.length)
  while (usedUserIndices.has(mainUserIndex)) {
    mainUserIndex = (mainUserIndex + 1) % availableUsers.length
  }
  usedUserIndices.add(mainUserIndex)
  users.push({ ...availableUsers[mainUserIndex], role: 'main_user' })

  // Add managers
  for (let i = 1; i < userCount; i++) {
    let userIndex = Math.floor(Math.random() * availableUsers.length)
    while (usedUserIndices.has(userIndex)) {
      userIndex = (userIndex + 1) % availableUsers.length
    }
    usedUserIndices.add(userIndex)
    users.push({ ...availableUsers[userIndex], role: 'manager' })
  }

  return users
}

// Company name parts for generating realistic names
const companyPrefixes = ['Tech', 'Digital', 'Global', 'Media', 'Ad', 'Content', 'Data', 'Cloud', 'Smart', 'Prime', 'Alpha', 'Beta', 'Elite', 'Premium', 'Rapid', 'Swift', 'Bright', 'Clear', 'Blue', 'Green', 'Net', 'Web', 'Cyber', 'Hyper', 'Ultra', 'Mega', 'Super', 'Pro', 'Plus', 'Max', 'Peak', 'Top', 'Best', 'Star', 'Core', 'Key', 'Main', 'Lead', 'Head', 'First', 'Future', 'Next', 'Sky', 'Sun', 'Moon', 'Wave', 'Stream', 'Flow', 'Path', 'Way', 'Zone', 'Hub', 'Port', 'Gate', 'Link', 'Bridge', 'Connect']

const companySuffixes = ['Solutions', 'Systems', 'Technologies', 'Partners', 'Network', 'Media', 'Digital', 'Interactive', 'Dynamics', 'Works', 'Labs', 'Studios', 'Group', 'Associates', 'Collective', 'Alliance', 'Ventures', 'Enterprise', 'Industries', 'Corporation', 'Inc', 'LLC', 'Co', 'Agency', 'Bureau', 'Services', 'Consulting', 'Analytics', 'Intelligence', 'Data', 'Cloud', 'Soft', 'Ware', 'Tech', 'Net', 'Online', 'World', 'Wide', 'Direct', 'Express', 'Communications', 'Broadcasting', 'Publishing', 'Syndicate']

function generateCompanyName(index: number): string {
  if (index === 0) return 'Internal Media Team'

  const prefix = companyPrefixes[index % companyPrefixes.length]
  const suffix = companySuffixes[Math.floor(index / companyPrefixes.length) % companySuffixes.length]
  const suffix2 = Math.random() > 0.7 ? ' ' + ['Group', 'Inc', 'LLC', 'Partners'][Math.floor(Math.random() * 4)] : ''

  return `${prefix}${suffix}${suffix2}`
}

function generateEmail(name: string, index: number): string {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)
  const domains = ['com', 'io', 'co', 'net', 'tech', 'ai', 'digital', 'media', 'partners', 'solutions']
  const prefixes = ['contact', 'info', 'hello', 'team', 'business', 'admin', 'support', 'mail']
  const prefix = prefixes[index % prefixes.length]
  const domain = domains[Math.floor(index / prefixes.length) % domains.length]
  return `${prefix}@${cleanName}.${domain}`
}

// Generate 150 partners
export const initialPartners: Partner[] = Array.from({ length: 150 }, (_, i) => {
  const name = generateCompanyName(i)
  const status = i === 0 ? 'active' : randomStatus()
  const type: PartnerType = i < 10 ? (i % 3 === 0 ? 'internal' : 'external') : 'external'

  // First partner always has all products
  const products = i === 0
    ? ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication'] as ProductType[]
    : randomProducts()

  return {
    id: (i + 1).toString(),
    name,
    type,
    status,
    email: generateEmail(name, i),
    phone: randomPhone(),
    created_at: randomDate(),
    users: randomUsers(),
    products,
  }
})

// Partners data as a record for easy lookup by ID
export const partnersData: Record<string, Partner> = initialPartners.reduce(
  (acc, partner) => {
    acc[partner.id] = partner
    return acc
  },
  {} as Record<string, Partner>
)

// Export types
export type { Partner, User, PartnerStatus, PartnerType, ProductType, UserRole }