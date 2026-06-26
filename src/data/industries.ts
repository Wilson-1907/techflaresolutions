export interface Industry {
  slug: string;
  title: string;
  icon: string;
  description: string;
  image: string;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

export const industries: Industry[] = [
  // Technology & digital
  {
    slug: "technology",
    title: "Technology",
    icon: "💻",
    description: "Enterprise software, digital platforms, and IT modernization for technology-driven organizations.",
    image: img("photo-1518770660439-4636190af475"),
  },
  {
    slug: "software-saas",
    title: "Software & SaaS",
    icon: "☁️",
    description: "Product engineering, multi-tenant SaaS, APIs, and scalable cloud-native applications.",
    image: img("photo-1555066931-4365d14bab8c"),
  },
  {
    slug: "ecommerce-retail",
    title: "E-Commerce & Retail",
    icon: "🛒",
    description: "Online stores, marketplaces, inventory systems, payments, and omnichannel retail technology.",
    image: img("photo-1556742049-0cfed4f6a45d"),
  },
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence",
    icon: "🤖",
    description: "Machine learning, LLM integration, intelligent automation, and AI-powered decision systems.",
    image: img("photo-1677442136019-21780ecad995"),
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    icon: "🔐",
    description: "Security architecture, identity management, threat monitoring, and compliance-ready systems.",
    image: img("photo-1550751827-4bd374c3f58b"),
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    icon: "🌐",
    description: "Cloud migration, DevOps, serverless architecture, and resilient infrastructure design.",
    image: img("photo-1451187580459-43490279c0fa"),
  },
  {
    slug: "internet-of-things",
    title: "Internet of Things (IoT)",
    icon: "📟",
    description: "Smart sensors, connected devices, edge computing, telemetry dashboards, and industrial IoT platforms.",
    image: img("photo-1558618666-fcd25c85cd64"),
  },
  {
    slug: "telecommunications",
    title: "Telecommunications",
    icon: "📡",
    description: "Network services, customer platforms, billing integration, and connectivity solutions.",
    image: img("photo-1558618666-fcd25c85cd64"),
  },
  {
    slug: "blockchain-web3",
    title: "Blockchain & Web3",
    icon: "⛓️",
    description: "Distributed ledgers, smart contracts, tokenization, and decentralized application development.",
    image: img("photo-1639762681485-074b7f938e0e"),
  },
  // Finance & business
  {
    slug: "fintech",
    title: "Fintech & Banking",
    icon: "🏦",
    description: "Digital banking, payment gateways, lending platforms, and regulatory-compliant fintech products.",
    image: img("photo-1554224155-6726b3ff858f"),
  },
  {
    slug: "insurance",
    title: "Insurance",
    icon: "🛡️",
    description: "Policy management, claims automation, underwriting tools, and customer self-service portals.",
    image: img("photo-1450101499163-c8848c66ca85"),
  },
  {
    slug: "legal",
    title: "Legal & Compliance",
    icon: "⚖️",
    description: "Case management, document workflows, e-discovery, and governance technology.",
    image: img("photo-1589829545855-d10d557cf95f"),
  },
  {
    slug: "marketing-advertising",
    title: "Marketing & Advertising",
    icon: "📣",
    description: "Campaign platforms, analytics dashboards, CRM integrations, and growth technology stacks.",
    image: img("photo-1460925895917-afdab827c52f"),
  },
  {
    slug: "human-resources",
    title: "Human Resources",
    icon: "👥",
    description: "Recruitment systems, payroll integration, performance management, and workforce platforms.",
    image: img("photo-1521737711867-e3b97375f902"),
  },
  // Core sectors
  {
    slug: "education",
    title: "Education",
    icon: "🎓",
    description: "Digital learning platforms, examination security, campus management, and EdTech products.",
    image: img("photo-1523050854058-8df90110c9f1"),
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    icon: "🏥",
    description: "Patient management, telemedicine, electronic health records, and clinical data analytics.",
    image: img("photo-1576091160399-112ba8d25d1f"),
  },
  {
    slug: "pharmaceuticals",
    title: "Pharmaceuticals",
    icon: "💊",
    description: "Research data systems, regulatory tracking, supply chain visibility, and patient programs.",
    image: img("photo-1582719471384-894fbb16e074"),
  },
  {
    slug: "biotechnology",
    title: "Biotechnology & Life Sciences",
    icon: "🧬",
    description: "Lab informatics, research collaboration platforms, and bio-data analysis tools.",
    image: img("photo-1532187863486-abf9dbad1b69"),
  },
  {
    slug: "agriculture",
    title: "Agriculture",
    icon: "🌾",
    description: "Smart farming, crop monitoring, agri-marketplaces, and supply chain optimization.",
    image: img("photo-1625246333195-78d9c38ad449"),
  },
  {
    slug: "government",
    title: "Government & Public Sector",
    icon: "🏛️",
    description: "E-governance, secure voting, citizen service portals, and public-sector digital transformation.",
    image: img("photo-1557804506-669a67965ba0"),
  },
  {
    slug: "nonprofit",
    title: "Nonprofit & NGOs",
    icon: "🤝",
    description: "Donor management, program tracking, volunteer platforms, and impact reporting systems.",
    image: img("photo-1559027615-cd4628902d4a"),
  },
  // Industrial & infrastructure
  {
    slug: "manufacturing",
    title: "Manufacturing",
    icon: "🏭",
    description: "IoT integration, predictive maintenance, quality control, and production analytics.",
    image: img("photo-1581091226825-a6a2a5aee158"),
  },
  {
    slug: "logistics",
    title: "Logistics & Supply Chain",
    icon: "🚚",
    description: "Fleet management, route optimization, warehouse automation, and last-mile delivery tech.",
    image: img("photo-1586528116311-ad8dd3c8310d"),
  },
  {
    slug: "transportation",
    title: "Transportation & Mobility",
    icon: "🚌",
    description: "Transit systems, ride platforms, fleet operations, and mobility-as-a-service solutions.",
    image: img("photo-1544620347-c4fd4a3d5957"),
  },
  {
    slug: "construction",
    title: "Construction & Engineering",
    icon: "🏗️",
    description: "Project management, BIM workflows, site monitoring, and contractor collaboration tools.",
    image: img("photo-1504307651254-35680f356dfd"),
  },
  {
    slug: "energy-utilities",
    title: "Energy & Utilities",
    icon: "⚡",
    description: "Smart grid systems, metering platforms, renewable energy monitoring, and utility billing.",
    image: img("photo-1473341303090-613d88fbdf21"),
  },
  {
    slug: "mining",
    title: "Mining & Natural Resources",
    icon: "⛏️",
    description: "Operations tracking, safety systems, resource planning, and field data collection.",
    image: img("photo-1516936851732-20b714eab4de"),
  },
  {
    slug: "environmental",
    title: "Environmental & Sustainability",
    icon: "🌱",
    description: "Carbon tracking, ESG reporting, environmental monitoring, and sustainability dashboards.",
    image: img("photo-1470071459604-3b5ec3a7fe05"),
  },
  // Consumer & lifestyle
  {
    slug: "hospitality",
    title: "Hospitality & Tourism",
    icon: "🏨",
    description: "Booking engines, property management, guest experience apps, and travel platforms.",
    image: img("photo-1566073771259-6a8506099945"),
  },
  {
    slug: "real-estate",
    title: "Real Estate & PropTech",
    icon: "🏠",
    description: "Property listings, tenant management, smart building systems, and transaction platforms.",
    image: img("photo-1560518883-ce09059eeffa"),
  },
  {
    slug: "media-entertainment",
    title: "Media & Entertainment",
    icon: "🎬",
    description: "Streaming platforms, content management, audience analytics, and digital publishing.",
    image: img("photo-1493225457124-a3eb161ffa5f"),
  },
  {
    slug: "sports",
    title: "Sports & Recreation",
    icon: "⚽",
    description: "League management, fan engagement apps, performance analytics, and event ticketing.",
    image: img("photo-1461896836934-ffe607ba7931"),
  },
  {
    slug: "food-beverage",
    title: "Food & Beverage",
    icon: "🍽️",
    description: "Restaurant tech, order management, kitchen systems, and food supply chain platforms.",
    image: img("photo-1414235077428-338989a2e8c0"),
  },
  {
    slug: "fashion",
    title: "Fashion & Apparel",
    icon: "👗",
    description: "E-commerce storefronts, inventory planning, brand portals, and retail experience apps.",
    image: img("photo-1445205170230-053b83016050"),
  },
  {
    slug: "automotive",
    title: "Automotive & Mobility Tech",
    icon: "🚗",
    description: "Dealer systems, connected vehicle platforms, fleet tech, and automotive marketplaces.",
    image: img("photo-1492144534655-ae79c964c9d7"),
  },
  {
    slug: "aerospace-defense",
    title: "Aerospace & Defense",
    icon: "✈️",
    description: "Mission systems, secure communications, simulation tools, and defense-grade software.",
    image: img("photo-1436491865339-9a61a109fc05"),
  },
];

export const industrySlugs = industries.map((i) => i.slug);

export function getIndustryBySlug(slug: string) {
  return industries.find((i) => i.slug === slug);
}
