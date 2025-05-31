import { Metadata } from "next";

const TITLE = "core-crm";
const DESCRIPTION = "CoreCRM helps businesses deliver highly personalized campaigns using dynamic audience segmentation, real-time delivery tracking, and AI-powered insights.";
const PREVIEW_IMAGE_URL = ""; //TODO: add open graph image  
const ALT_TITLE = "CoreCRM – AI-powered customer engagement made simple";
const BASE_URL = "https://core-crm.school-x.app";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "CoreCRM",
  creator: "Aarushi Kapoor",
  twitter: {
    creator: "aarushik250", //TODO: check for the real twitter 
    title: TITLE,
    description: DESCRIPTION,
    card: "summary_large_image",
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "CoreCRM",
    url: BASE_URL,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  category: "Marketing Technology",
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "CRM platform",
    "customer segmentation",
    "campaign delivery",
    "AI campaign insights",
    "personalized marketing",
    "Next.js CRM",
    "Full stack internship project",
    "Xeno CRM assignment",
    "Google OAuth",
    "AI-powered marketing tools",
  ],
  metadataBase: new URL(BASE_URL),
};


// import type { Metadata } from "next";
//
// export const siteConfig: Metadata = {
//   title: "lms-x",
//   description: "lms-x",
//   icons: [{ rel: "icon", url: "/favicon.ico" }]
// };
