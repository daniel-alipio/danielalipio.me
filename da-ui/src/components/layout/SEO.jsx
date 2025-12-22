import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({

  title = "Daniel Alípio - Desenvolvedor Full Stack",
  description = "Desenvolvedor Full Stack especializado em criar soluções web eficientes e escaláveis.",
  keywords = "desenvolvedor web, full stack, javascript, react, node.js, portfolio, soluções web, programação, daniel alipio, alipio dev, dev batatais, desenvolvimento de software, desenvolvedor front-end, desenvolvedor back-end, desenvolvedor ribeirão preto, desenvolvedor sp, desenvolvedor brasil",

  type = "website",
  image = "https://danielalipio.me/assets/og-image.jpg",
  imageAlt = "Daniel Alípio - Desenvolvedor Full Stack",

  twitterCard = "summary_large_image",
  twitterSite = "@danielalipio",

  author = "Daniel Alípio - Desenvolvedor Full Stack",
  publisher = "Daniel Alípio - Desenvolvedor Full Stack",

  businessName = "Daniel Alípio - Desenvolvedor Full Stack",
  addressLocality = "Batatais",
  addressRegion = "SP",
  addressCountry = "BR",

  article = null,

  canonical = null,

  language = "pt-BR",

  robots = "index, follow",

  schema = null,
}) => {
  const location = useLocation();
  const currentUrl = `https://danielalipio.me${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    
    document.title = title;

    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'author', author);
    updateMetaTag('name', 'robots', robots);
    updateMetaTag('name', 'language', language);
    updateMetaTag('http-equiv', 'content-language', language);

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('property', 'og:image:alt', imageAlt);
    updateMetaTag('property', 'og:image:width', '1200');
    updateMetaTag('property', 'og:image:height', '630');
    updateMetaTag('property', 'og:site_name', 'Daniel Alípio - Desenvolvedor Full Stack');
    updateMetaTag('property', 'og:locale', 'pt_BR');

    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);
    updateMetaTag('name', 'twitter:image:alt', imageAlt);
    updateMetaTag('name', 'twitter:site', twitterSite);
    updateMetaTag('name', 'twitter:creator', twitterSite);

    if (article) {
      updateMetaTag('property', 'article:published_time', article.publishedTime);
      updateMetaTag('property', 'article:modified_time', article.modifiedTime);
      updateMetaTag('property', 'article:author', article.author || author);
      updateMetaTag('property', 'article:section', article.section);
      if (article.tags) {
        article.tags.forEach(tag => {
          updateMetaTag('property', 'article:tag', tag);
        });
      }
    }

    updateLinkTag('canonical', canonicalUrl);

    updateLinkTag('alternate', currentUrl, { hreflang: 'pt-BR' });
    updateLinkTag('alternate', currentUrl, { hreflang: 'x-default' });

    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
    updateMetaTag('name', 'theme-color', '#000000');
    updateMetaTag('name', 'mobile-web-app-capable', 'yes');
    updateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
    updateMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'black');
    updateMetaTag('name', 'apple-mobile-web-app-title', 'Daniel Alípio - Desenvolvedor Full Stack');

    updateMetaTag('name', 'generator', 'Vite + React');
    updateMetaTag('name', 'rating', 'general');
    updateMetaTag('name', 'referrer', 'origin-when-cross-origin');

    updateJsonLd(schema || getDefaultSchema());

  }, [title, description, keywords, type, image, currentUrl, article, canonical, language, robots]);

  function updateMetaTag(attribute, key, content) {
    if (!content) return;

    let element = document.querySelector(`meta[${attribute}="${key}"]`);

    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, key);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  }

  function updateLinkTag(rel, href, attributes = {}) {
    if (!href) return;

    let selector = `link[rel="${rel}"]`;
    if (attributes.hreflang) {
      selector = `link[rel="${rel}"][hreflang="${attributes.hreflang}"]`;
    }

    let element = document.querySelector(selector);

    if (element) {
      element.setAttribute('href', href);
    } else {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      element.setAttribute('href', href);
      Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key]);
      });
      document.head.appendChild(element);
    }
  }

  function updateJsonLd(schemaData) {
    
    const oldScript = document.querySelector('script[type="application/ld+json"]');
    if (oldScript) {
      oldScript.remove();
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }

  function getDefaultSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://danielalipio.me",
      "name": businessName,
      "image": image,
      "description": description,
      "url": "https://danielalipio.me",
      "telephone": "+55-16-99335-5404",
      "email": "contato@danielalipio.me",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": addressLocality,
        "addressRegion": addressRegion,
        "addressCountry": addressCountry,
        "postalCode": "14300-000" 
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-20.8912", 
        "longitude": "-47.5863"
      },
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/danielhs",
        "https://www.facebook.com/profile.php?id=61585096831137",
      ],
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "-20.8912",
          "longitude": "-47.5863"
        },
        "geoRadius": "50000" 
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Software e Apps",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Software e Apps",
              "description": "Desenvolvimento Full Stack de Software e Aplicativos Web"
            }
          }
        ]
      }
    };
  }

  return null;
};

export default SEO;
