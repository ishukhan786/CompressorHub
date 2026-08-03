import { useEffect } from 'react';

export function SEOMeta() {
  useEffect(() => {
    // Inject JSON-LD Schema
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'CompressHub AI',
      operatingSystem: 'All',
      applicationCategory: 'MultimediaApplication',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      description:
        'Free online AI file compressor for images, PDFs, videos, audio, ZIP archives, and Microsoft Office documents.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '12850',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = 'compresshub-schema';

    const existing = document.getElementById('compresshub-schema');
    if (existing) {
      existing.remove();
    }
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('compresshub-schema');
      if (el) el.remove();
    };
  }, []);

  return null;
}
