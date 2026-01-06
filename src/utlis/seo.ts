import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
    metadataBase: new URL('https://dahua-dubai.com/'),
    title: {
        default: 'Dahua Technology Dubai - CCTV & Security Solutions UAE',
        template: '%s | Dahua Technology Dubai',
    },
    description:
        'Dahua Technology Dubai - Leading provider of CCTV cameras, security systems, and surveillance solutions in UAE. Professional installation and support.',
    keywords: [
        'Dahua Technology Dubai',
        'CCTV cameras UAE',
        'security systems Dubai',
        'surveillance solutions',
        'IP cameras UAE',
        'video surveillance',
        'security cameras installation',
        'Dahua Dubai',
        'CCTV installation Dubai',
        'access control systems',
        'network video recorders',
        'security equipment UAE',
        'home security systems',
        'commercial CCTV Dubai',
        'video security solutions',
        'Dahua authorized dealer UAE',
        'Dahua',
        'Dahua Dubai',
        'Dahua Technology',
        'CCTV',
        'Security Systems',
        'Surveillance Solutions',
        'IP Cameras',
        'Video Surveillance',
        'Access Control',
        'NVR',
        'Security Equipment',
        'Home Security',
        'Commercial Security',
        'Dahua Dealer',
        'Dahua Distributor',
        'Dahua Partner',
        'Dahua Authorized Reseller',
        'Dahua CCTV',
        'Dahua Security Cameras',
        'Dahua Surveillance',
        'Dahua Solutions',
        'Dahua UAE',
        'Dahua Middle East',

    ],
    authors: [{ name: 'Dahua Technology Dubai' }],
    creator: 'Dahua Technology Dubai',
    publisher: 'Dahua Technology Dubai',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: './favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
        other: {
            rel: 'mask-icon',
            url: '/safari-pinned-tab.svg',
            color: '#0052FF',
        },
    },
    openGraph: {
        type: 'website',
        siteName: 'Dahua Technology Dubai',
        locale: 'en_US',
        url: 'https://dahua-dubai.com',
        title: 'Dahua Technology Dubai - CCTV & Security Solutions UAE',
        description:
            'Leading provider of CCTV cameras, security systems, and surveillance solutions in UAE. Professional installation and support.',
        images: [
            {
                url: '/logo/dahua-dubai-logo.png',
                width: 1200,
                height: 630,
                alt: 'Dahua Technology Dubai',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@dahuadubai',
        creator: '@dahuadubai',
        title: 'Dahua Technology Dubai - CCTV & Security Solutions UAE',
        description:
            'Leading provider of CCTV cameras, security systems, and surveillance solutions in UAE. Professional installation and support.',
        images: ['/images/dahualogo-removebg-preview.png'],
    },
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
    alternates: {
        canonical: 'https://dahua-dubai.com',
        languages: {
            'en-US': 'https://dahua-dubai.com/',
            'ar-AE': 'https://dahua-dubai.com/ar/',
        },
    },
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    other: {
        'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    generator: 'Dahua Technology Dubai Website',
    applicationName: 'Dahua Technology Dubai',
    referrer: 'origin-when-cross-origin',
    manifest: '/site.webmanifest',
};

// ✅ Organization Schema (JSON-LD)
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dahua Technology Dubai',
    description:
        'Leading provider of CCTV cameras, security systems, and surveillance solutions in UAE. Professional installation and support.',
    url: 'https://dahua-dubai.com',
    logo: '/images/dahualogo-removebg-preview.png',
    foundingDate: '2015-01-01',
    founder: [
        { '@type': 'Person', name: 'Founder Name' },
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+971 55 2929644',
        contactType: 'customer service',
        email: 'sales@dahua-dubai.com',
        areaServed: 'AE',
        availableLanguage: ['English', 'Arabic'],
    },
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Deira - Dubai - United Arab Emirates',
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        postalCode: 'XXXXX',
        addressCountry: 'AE',
    },
    sameAs: [
        'https://www.instagram.com/dahuadubai',
        'https://www.facebook.com/dahuadubai',
        'https://www.linkedin.com/company/dahua-technology-dubai',
        'https://twitter.com/dahuadubai',
        'https://dahua-dubai.com/'
    ],
    areaServed: {
        '@type': 'Country',
        name: 'United Arab Emirates',
        alternateName: 'UAE',
    },
    knowsAbout: [
        'CCTV Systems',
        'Security Cameras',
        'Video Surveillance',
        'Access Control Systems',
        'Network Video Recorders',
        'Security Solutions',
        'IP Cameras'
    ]
};

// ✅ Dynamic Content Schema (JSON-LD)
export const dynamicContentSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            item: {
                '@type': 'WebPage',
                '@id': 'https://dahua-dubai.com/products',
                name: 'Product Categories',
                description: 'Browse our CCTV and security product categories',
                url: 'https://dahua-dubai.com/products',
            },
        },
        {
            '@type': 'ListItem',
            position: 2,
            item: {
                '@type': 'Solution',
                '@id': 'https://dahua-dubai.com/solutions',
                name: 'Solutions',
                description: 'Our complete range of CCTV cameras and surveillance equipment',
                url: 'https://dahua-dubai.com/solutions',
            },
        },
        {
            '@type': 'Technologies',
            position: 3,
            item: {
                '@type': 'CollectionPage',
                '@id': 'https://dahua-dubai.com/technologies',
                name: 'technologies',
                description: 'Complete security system solutions for home and business',
                url: 'https://dahua-dubai.com/technologies',
            },
        },
        {
            '@type': 'ListItem',
            position: 4,
            item: {
                '@type': 'AboutPage',
                '@id': 'https://dahua-dubai.com/about-us',
                name: 'Installation Services',
                description: 'Professional CCTV and security system installation services',
                url: 'https://dahua-dubai.com/about-us',
            },
        },
        {
            '@type': 'ListItem',
            position: 5,
            item: {
                '@type': 'Sira',
                '@id': 'https://dahua-dubai.com/sira',
                name: 'Sira',
                description: '24/7 technical support and maintenance services',
                url: 'https://dahua-dubai.com/sira',
            },
        },
    ],
};

// Helper function to generate dynamic metadata
export interface DynamicMetaData {
    title: string;
    description?: string;
    images?: string[];
    slug: string;
}

export const generateDynamicMetadata = (
    type: 'product' | 'about' | 'sira',
    data: DynamicMetaData
): Metadata => {
    return {
        title: data.title,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            images: data.images && data.images.length > 0 ? data.images : ['/images/dahualogo-removebg-preview.png'],
            url: `https://dahua-dubai.com/${type}/${data.slug}`,
        },
        alternates: {
            canonical: `https://dahua-dubai.com/${type}/${data.slug}`,
        },
    };
};