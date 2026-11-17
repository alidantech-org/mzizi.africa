import type { Metadata, MetadataRoute } from 'next';

// Base site configuration
export const siteConfig = {
  name: 'Katiba Book - Polifin',
  description: 'Kenya Political Finance Platform - Monitor, analyze, and assess political finance risks and transparency',
  url: 'https://katiba.co.ke',
  ogImage: 'https://katiba.co.ke/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/katibapolifin',
    github: 'https://github.com/katibapolifin',
    linkedin: 'https://linkedin.com/company/katibapolifin',
  },
  author: 'Katiba BookTeam',
  email: 'info@katiba.co.ke',
  phone: '+254 7XX XXX XXX',
  address: 'Nairobi, Kenya',
  foundingYear: '2024',
};

// Comprehensive SEO metadata
export const baseMetadata: Metadata = {
  // Basic metadata
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  // Keywords for search engines
  keywords: [
    'political finance',
    'Kenya politics',
    'campaign finance',
    'transparency',
    'accountability',
    'risk intelligence',
    'political risk',
    'election monitoring',
    'campaign funding',
    'political donations',
    'financial transparency',
    'anti-corruption',
    'governance',
    'public finance',
    'political accountability',
    'Kenya elections',
    'campaign finance reform',
    'political spending',
    'donor transparency',
    'political ethics',
    'campaign compliance',
    'financial disclosure',
    'political monitoring',
    'election finance',
    'campaign reporting',
    'political analysis',
    'finance tracking',
    'transparency platform',
    'Kenya governance',
    'political integrity',
    'campaign finance monitoring',
    'political finance analysis',
    'election transparency',
    'campaign finance transparency',
    'political risk assessment',
    'Kenya political finance',
    'campaign finance Kenya',
    'political donations Kenya',
    'election monitoring Kenya',
    'political transparency Kenya',
    'campaign finance reporting',
    'political finance tracking',
    'campaign finance compliance',
    'political finance risk',
    'election finance transparency',
    'campaign finance accountability',
    'political finance oversight',
    'Kenya election finance',
    'campaign finance regulation',
    'political finance governance',
    'campaign finance ethics',
    'political finance disclosure',
    'campaign finance monitoring platform',
    'political finance transparency platform',
    'Kenya political finance platform',
  ].join(', '),

  // Author and publisher information
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,

  // Open Graph metadata for social media
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Political Finance Transparency Platform`,
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@katibapolifin',
    site: '@katibapolifin',
  },

  // App metadata
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',

  // Verification and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Geographic and language targeting
  other: {
    'geo.region': 'KE',
    'geo.placename': 'Kenya',
    'geo.position': '1.2921;36.8219',
    ICBM: '1.2921,36.8219',
    language: 'en',
    country: 'Kenya',
    'content-language': 'en',
    'target-country': 'KE',
    'business.contact.street_address': siteConfig.address,
    'business.contact.locality': 'Nairobi',
    'business.contact.country': 'Kenya',
    'business.contact.email': siteConfig.email,
    'business.contact.phone': siteConfig.phone,
  },

  // Content classification
  category: 'Government',
  classification: 'Political Finance Transparency Platform',
};

// Page-specific metadata generators
export function generatePageMetadata({
  title,
  description,
  path = '',
  keywords = [],
  image = siteConfig.ogImage,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = `${title} | ${siteConfig.name}`;
  const baseKeywords = Array.isArray(baseMetadata.keywords) ? baseMetadata.keywords.join(', ') : baseMetadata.keywords || '';
  const allKeywords = [...keywords, ...baseKeywords.split(', ')].join(', ');

  return {
    ...baseMetadata,
    title: fullTitle,
    description,
    keywords: allKeywords,
    openGraph: {
      ...baseMetadata.openGraph,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: fullTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Sitemap configuration
export function generateSitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/admin`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/files`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/scraper`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
}

// Robots.txt configuration
export function generateRobots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/static/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

// Structured data for organization
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      email: siteConfig.email,
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Kenya',
      addressLocality: 'Nairobi',
      addressRegion: 'Nairobi',
      streetAddress: siteConfig.address,
    },
    sameAs: [siteConfig.links.twitter, siteConfig.links.github, siteConfig.links.linkedin],
    foundingDate: `${siteConfig.foundingYear}-01-01`,
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    knowsAbout: [
      'Political Finance',
      'Campaign Finance',
      'Political Transparency',
      'Anti-Corruption',
      'Governance',
      'Election Monitoring',
      'Financial Accountability',
    ],
    serviceType: 'Political Finance Transparency Platform',
  };
}

// Structured data for website
export function generateWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Political Finance',
        description: 'Monitoring and analysis of political campaign finances and donations',
      },
      {
        '@type': 'Thing',
        name: 'Political Transparency',
        description: 'Increasing transparency in political financing and campaign spending',
      },
      {
        '@type': 'Thing',
        name: 'Campaign Finance',
        description: 'Tracking and reporting of political campaign financial activities',
      },
    ],
  };
}

// Structured data for service
export function generateServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Political Finance Transparency Platform',
    description: 'Comprehensive platform for monitoring, analyzing, and assessing political finance risks and transparency',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    serviceType: 'Political Finance Monitoring',
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Political Finance Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Campaign Finance Monitoring',
            description: 'Real-time monitoring of political campaign finances',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Risk Assessment',
            description: 'Political finance risk analysis and assessment',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Transparency Reporting',
            description: 'Comprehensive transparency and accountability reporting',
          },
        },
      ],
    },
  };
}

// FAQ structured data
export function generateFAQJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Katiba Book?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Katiba Book is a comprehensive political finance transparency platform designed to monitor, analyze, and assess political finance risks in Kenya.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does the platform monitor political finance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our platform uses advanced data collection, analysis tools, and real-time monitoring to track political donations, campaign spending, and financial disclosures.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the platform free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Katiba Book provides free access to basic political finance data and reports. Premium features are available for advanced analysis and monitoring.',
        },
      },
      {
        '@type': 'Question',
        name: 'How current is the financial data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We update our political finance data in real-time as new information becomes available from official sources and public disclosures.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I report suspicious financial activity?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, users can submit reports of suspicious political finance activities through our secure reporting system for investigation and verification.',
        },
      },
    ],
  };
}

// Breadcrumb structured data helper
export function generateBreadcrumbJsonLd(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

// Article structured data helper
export function generateArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author,
  image,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      ...{
        '@id': url,
      },
    },
  };
}
