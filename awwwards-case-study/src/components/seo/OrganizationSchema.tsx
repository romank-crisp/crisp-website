export function OrganizationSchema() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Crisp Studio',
        url: 'https://crisp-studio.com/',
        logo: 'https://crisp-studio.com/favicon.png', // Or path to official logo
        sameAs: [
            // Note: Update following links with correct social accounts if necessary
            'https://dribbble.com/crisp-studio',
            'https://twitter.com/crispstudio',
            'https://www.linkedin.com/company/crispstudio'
        ],
        description: 'Award-winning creative studio specialising in brand identity, web design and product visualisation.',
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
