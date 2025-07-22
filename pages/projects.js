import siteMetadata from '@/data/siteMetadata'
import { PageSEO } from '@/components/SEO'
import Link from '@/components/Link'

const companyProjects = [
  {
    title: 'Zalo Notification Service (ZNS)',
    description:
      'Enterprise notification service for customer care messages delivered to phone numbers on Zalo platform. Built with server-to-server API architecture for Official Account solutions.',
    longDescription:
      'ZNS is a comprehensive notification service that enables businesses to send professional customer care messages through Zalo. The service features diverse notification templates with logos, images, parameters, and interactive elements like call buttons, website links, star ratings, and quick payment options. All templates undergo approval processes to ensure professional quality and platform integrity.',
    technologies: [
      'API Integration',
      'Notification Systems',
      'Enterprise Solutions',
      'Customer Care',
    ],
    link: 'https://zalo.cloud/zns/guidelines/intro',
    category: 'Enterprise Platform',
    status: 'Production',
    role: 'Frontend Developer',
    highlights: [
      'Server-to-server API architecture',
      'Template approval system with 2-3 day review cycle',
      'Interactive notification elements (call, payment, rating)',
      'Quality scoring system with rewards/penalties',
      'Enterprise dashboard for spending and operations management',
    ],
  },
  {
    title: 'Binance Pay',
    description:
      'Cryptocurrency payment solution enabling seamless digital asset transactions. A comprehensive payment gateway supporting multiple cryptocurrencies with enterprise-grade security.',
    longDescription:
      'Binance Pay is a contactless, borderless, and secure cryptocurrency payment technology designed by Binance. It allows users to send and receive crypto payments instantly with zero fees, supporting multiple cryptocurrencies and providing a seamless payment experience for both merchants and consumers.',
    technologies: ['Cryptocurrency', 'Payment Gateway', 'Blockchain', 'Financial Technology'],
    link: 'https://pay.binance.com/en',
    category: 'FinTech',
    status: 'Production',
    role: 'Frontend Developer',
    highlights: [
      'Zero-fee cryptocurrency transactions',
      'Multi-currency support',
      'Enterprise-grade security protocols',
      'Instant payment processing',
      'Global merchant integration',
    ],
  },
  {
    title: 'Binance KYC/KYB',
    description:
      'Know Your Customer and Know Your Business verification system for regulatory compliance. Automated identity verification with document processing and risk assessment.',
    longDescription:
      'Comprehensive identity verification system handling both individual (KYC) and business (KYB) verification processes. Features automated document verification, biometric authentication, risk scoring, and regulatory compliance across multiple jurisdictions.',
    technologies: [
      'Identity Verification',
      'Document Processing',
      'Compliance',
      'Machine Learning',
    ],
    link: 'https://www.binance.com/en/support/faq/detail/360015552032',
    category: 'Compliance & Security',
    status: 'Production',
    role: 'Frontend Developer',
    highlights: [
      'Automated document verification',
      'Biometric authentication integration',
      'Multi-jurisdiction compliance',
      'Risk assessment algorithms',
      'Real-time verification processing',
    ],
  },
]

const personalProjects = [
  {
    title: 'Magic Console Logger',
    description:
      'A powerful VSCode extension that supercharges debugging workflows with intelligent console.log generation, context-aware variable logging, and seamless developer productivity features.',
    longDescription:
      'Magic Console Logger is a VSCode extension designed to streamline the debugging process by automatically generating contextual console.log statements. It intelligently detects function context, variable names, and provides customizable logging templates with keyboard shortcuts for maximum developer efficiency.',
    technologies: ['VSCode Extension', 'TypeScript', 'JavaScript', 'Developer Tools'],
    link: 'https://marketplace.visualstudio.com/items?itemName=trunglq.magic-console-logger',
    category: 'Developer Tools',
    status: 'Completed',
    role: 'Solo Developer',
    highlights: [
      'Context-aware console.log generation with function detection',
      'Keyboard shortcuts for rapid log insertion and management',
      'Bulk operations: comment, uncomment, and delete all logs',
      'Smart variable name and value logging format',
      'Support for JavaScript, TypeScript, and React (JSX/TSX)',
    ],
  },
  {
    title: 'Any-2-QR',
    description:
      'Privacy-focused QR code generator that converts any link, text, or contact information into customizable QR codes with personal branding options.',
    longDescription:
      'A client-side QR code generator that prioritizes user privacy by processing all data locally without server-side storage. Users can customize QR codes with custom colors and logos, making it perfect for business cards, event sharing, and secure information transfer.',
    technologies: ['JavaScript', 'QR Code Generation', 'Client-Side Processing', 'Privacy'],
    link: 'https://any-2-qr.vercel.app/',
    category: 'Utility',
    status: 'Completed',
    role: 'Solo Developer',
    highlights: [
      'Zero server-side data storage for maximum privacy',
      'Custom color and logo integration',
      'Support for links, text, and contact information',
      'Instant generation and sharing capabilities',
      'Responsive design for all devices',
    ],
  },
  {
    title: 'Emoji Charades',
    description:
      'Interactive word game that challenges players to decode emoji clues and discover hidden English idioms and common sayings.',
    longDescription:
      'An educational game designed to make learning English idioms and sayings fun and engaging. Players decode emoji sequences to reveal popular expressions, improving their understanding of English language nuances while having fun.',
    technologies: ['Game Development', 'Educational Technology', 'React', 'Interactive UI'],
    link: 'https://emoji-charades.vercel.app/',
    category: 'Education & Gaming',
    status: 'Completed',
    role: 'Solo Developer',
    highlights: [
      'Extensive library of English idioms and sayings',
      'Progressive difficulty levels',
      'Hint system for learning assistance',
      'Score tracking and achievements',
      'Mobile-responsive gameplay',
    ],
  },
  {
    title: 'Tarot Insight',
    description:
      'AI-powered tarot reading application that provides personalized interpretations using OpenAI API for meaningful and contextual card readings.',
    longDescription:
      'A modern take on traditional tarot reading, combining ancient wisdom with artificial intelligence. The app provides detailed, contextual interpretations of tarot spreads, helping users gain insights and reflection through AI-enhanced readings.',
    technologies: ['OpenAI API', 'AI Integration', 'Tarot Systems', 'Natural Language Processing'],
    link: null,
    category: 'AI & Lifestyle',
    status: 'In Progress',
    role: 'Solo Developer',
    highlights: [
      'OpenAI GPT integration for intelligent interpretations',
      'Multiple tarot spread layouts',
      'Personalized reading contexts',
      'Beautiful card animations and UI',
      'Reading history and insights tracking',
    ],
  },
  {
    title: 'Shot Mate',
    description:
      'Mobile photography assistant app that guides users through poses and compositions to capture stunning photos with professional-quality results.',
    longDescription:
      'A comprehensive mobile photography tool that helps users take better photos by providing guided poses, composition tips, and real-time feedback. Perfect for social media content creation, portrait photography, and improving overall photography skills.',
    technologies: ['Mobile Development', 'Computer Vision', 'Photography', 'React Native'],
    link: null,
    category: 'Mobile & Photography',
    status: 'In Progress',
    role: 'Solo Developer',
    highlights: [
      'Real-time pose guidance and suggestions',
      'Composition rule overlays and tips',
      'Photo quality analysis and feedback',
      'Social media optimization features',
      'Cross-platform mobile compatibility',
    ],
  },
]

const ProjectCard = ({ project, isPersonal = false }) => (
  <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
    {/* Category Header */}
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-white">{project.category}</div>
          <div className="text-xs text-white opacity-80">{project.role}</div>
        </div>
        <span
          className={`ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            project.status === 'Production'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : project.status === 'Completed'
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
          }`}
        >
          {project.status}
        </span>
      </div>
    </div>

    <div className="p-6">
      {/* Project Title */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400">
          {project.link ? (
            <Link href={project.link} className="hover:underline">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
      </div>

      {/* Short Description */}
      <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-400">{project.description}</p>

      {/* Technologies */}
      <div className="mb-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Key Highlights */}
      <div className="mb-4">
        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          Key Features:
        </h4>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {project.highlights.slice(0, 3).map((highlight, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2 mt-1 flex-shrink-0 text-primary-500">•</span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {/* Project Link */}
      {project.link && (
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Link
            href={project.link}
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View Project
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </div>
)

const ProjectSection = ({ title, description, projects, isPersonal = false }) => (
  <div className="mb-16">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">{description}</p>
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.title} project={project} isPersonal={isPersonal} />
      ))}
    </div>
  </div>
)

export default function Projects() {
  return (
    <>
      <PageSEO
        title={`Projects - ${siteMetadata.author}`}
        description="Showcase of professional and personal projects including enterprise platforms, fintech solutions, and innovative applications."
      />

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* Hero Section */}
        <div className="space-y-6 pb-8 pt-6 md:space-y-8 md:pb-12 md:pt-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
              Projects
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-gray-600 dark:text-gray-400">
              A collection of professional enterprise solutions and innovative personal projects
              showcasing expertise in full-stack development, fintech, AI integration, and user
              experience design.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-3 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">8+</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">3</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Enterprise
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">5</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Personal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Projects Section */}
        <div className="py-12">
          <ProjectSection
            title="Enterprise Projects"
            description="Large-scale production systems serving millions of users across fintech, messaging platforms, and compliance solutions. Built with enterprise-grade architecture and security standards."
            projects={companyProjects}
            isPersonal={false}
          />
        </div>

        {/* Personal Projects Section */}
        <div className="py-12">
          <ProjectSection
            title="Personal Projects"
            description="Innovative applications exploring emerging technologies, user experience design, and creative solutions to everyday problems. Showcasing versatility across mobile, web, and AI domains."
            projects={personalProjects}
            isPersonal={true}
          />
        </div>

        {/* Contact CTA */}
        <div className="py-12">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Interested in Collaboration?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-gray-600 dark:text-gray-400">
              I'm always open to discussing new opportunities, innovative projects, and technical
              challenges. Let's build something amazing together.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Get in Touch
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
