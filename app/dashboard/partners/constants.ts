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

// Seeded random number generator for consistent data between server and client
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  // Returns a random number between 0 and 1
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  // Returns a random integer between min and max (inclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }
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
function randomDate(rng: SeededRandom): string {
  const start = new Date(2022, 0, 1).getTime()
  const end = new Date(2024, 11, 31).getTime()
  const date = new Date(start + rng.next() * (end - start))
  return date.toISOString().split('T')[0]
}

// Helper function to format phone number
function randomPhone(rng: SeededRandom): string {
  const areaCode = rng.nextInt(200, 999)
  const num1 = rng.nextInt(100, 999)
  const num2 = rng.nextInt(1000, 9999)
  return `+1 (${areaCode}) ${num1}-${num2}`
}

// Helper function to get random status
function randomStatus(rng: SeededRandom): PartnerStatus {
  const statuses: PartnerStatus[] = ['active', 'active', 'active', 'inactive', 'pending', 'suspended']
  return statuses[rng.nextInt(0, statuses.length - 1)]
}

// Helper function to get random products
function randomProducts(rng: SeededRandom): ProductType[] {
  const allProducts: ProductType[] = ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication']
  const count = rng.nextInt(1, 4)
  const shuffled = [...allProducts].sort(() => rng.next() - 0.5)
  return shuffled.slice(0, count)
}

// Helper function to get random users
function randomUsers(rng: SeededRandom): User[] {
  const userCount = rng.next() > 0.6 ? rng.nextInt(1, 3) : 0
  if (userCount === 0) return []

  const users: User[] = []
  const usedUserIndices = new Set<number>()

  // Always add a main user if there are users
  let mainUserIndex = rng.nextInt(0, availableUsers.length - 1)
  while (usedUserIndices.has(mainUserIndex)) {
    mainUserIndex = (mainUserIndex + 1) % availableUsers.length
  }
  usedUserIndices.add(mainUserIndex)
  users.push({ ...availableUsers[mainUserIndex], role: 'main_user' })

  // Add managers
  for (let i = 1; i < userCount; i++) {
    let userIndex = rng.nextInt(0, availableUsers.length - 1)
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

function generateCompanyName(index: number, rng: SeededRandom): string {
  if (index === 0) return 'Internal Media Team'

  const prefix = companyPrefixes[index % companyPrefixes.length]
  const suffix = companySuffixes[Math.floor(index / companyPrefixes.length) % companySuffixes.length]
  const suffix2 = rng.next() > 0.7 ? ' ' + ['Group', 'Inc', 'LLC', 'Partners'][rng.nextInt(0, 3)] : ''

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

// Generate 150 partners with a fixed seed for consistency
// Use a function to generate partners to ensure consistency
function generatePartners(): Partner[] {
  const rng = new SeededRandom(12345) // Fixed seed for consistency
  return Array.from({ length: 150 }, (_, i) => {
    const name = generateCompanyName(i, rng)
    const status = i === 0 ? 'active' : randomStatus(rng)
    const type: PartnerType = i < 10 ? (i % 3 === 0 ? 'internal' : 'external') : 'external'

    // First partner always has all products
    const products = i === 0
      ? ['sponsored-ads', 'xml-direct-listing', 'publisher', 'syndication'] as ProductType[]
      : randomProducts(rng)

    return {
      id: (i + 1).toString(),
      name,
      type,
      status,
      email: generateEmail(name, i),
      phone: randomPhone(rng),
      created_at: randomDate(rng),
      users: randomUsers(rng),
      products,
    }
  })
}

// Cache the generated partners to ensure consistency
let cachedPartners: Partner[] | null = null
export const initialPartners: Partner[] = (() => {
  if (!cachedPartners) {
    cachedPartners = generatePartners()
  }
  return cachedPartners
})()

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