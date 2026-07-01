/**
 * Legal page content: Privacy Policy and Terms of Use.
 *
 * Kept here as structured data (not hardcoded in JSX) so the prose has one
 * home and the pages stay presentational. Written for a Montreal, Quebec
 * business under Quebec's Law 25 and Canada's PIPEDA. Informational only, not
 * legal advice. When the substance changes, bump {@link LEGAL_EFFECTIVE_DATE}.
 *
 * @module config/legal
 */

/** One section of a legal document. */
export interface LegalSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  /** Optional list items rendered beneath the paragraphs. */
  readonly bullets?: readonly string[];
}

/** A full legal document. */
export interface LegalDoc {
  readonly title: string;
  /** One or two sentences shown under the title. */
  readonly summary: string;
  readonly sections: readonly LegalSection[];
}

/** Human-readable "last updated" date, shown on both legal pages. */
export const LEGAL_EFFECTIVE_DATE = "June 28, 2026";

/** Privacy Policy. */
export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  summary:
    "How Summy Singh Photography (SummyPNG), a Montreal photography studio, collects, uses, and protects your personal information when you contact us through summysingh.com, and the rights you have under Quebec's Law 25 and Canada's PIPEDA.",
  sections: [
    {
      heading: "Who We Are",
      paragraphs: [
        'This Privacy Policy explains how Summy Singh Photography (operating under the brand SummyPNG, and referred to here as "we," "us," or "the studio") handles personal information. We are a sole photographer\'s studio based in Montreal, Quebec, Canada, offering cinematic, dark-toned editorial photography for people, businesses, hospitality venues, and real estate. We work in both English and French and serve Montreal, Greater Montreal, Quebec, and the rest of Canada.',
        "This policy applies to our website at summysingh.com and to the information we collect when you contact us through the site. It is informational and is meant to help you understand our practices. It is not legal advice. If a section does not apply to your situation, it simply means we do not engage in that activity.",
      ],
    },
    {
      heading: "Information We Collect",
      paragraphs: [
        "We collect personal information only when you choose to send us an inquiry through our contact and booking form. When you complete that form, we collect the following:",
      ],
      bullets: [
        "Your name.",
        "Your email address.",
        "Your phone number, if you choose to provide it (this field is optional).",
        "The photography category you are interested in (People, Businesses, Hospitality, or Real Estate).",
        "A free-text description of your project.",
        "An optional preferred date for your project.",
        "Marketing campaign parameters that may be attached to the link you arrived from (UTM source, medium, and campaign), which help us understand how people find us.",
        "The web page that referred you to our site and the landing page URL you first arrived on.",
        "Your browser's user-agent string, which is basic technical information your browser sends automatically (for example, the browser and operating system you are using).",
      ],
    },
    {
      heading: "How and Why We Use Your Information",
      paragraphs: [
        "We use the information from your inquiry to respond to you, to understand the work you are asking about, to prepare a quote, and to arrange and manage a booking if you decide to go ahead. Because our pricing is quote-based and there are no public prices, any engagement is confirmed separately in a written agreement or quote. We may use the attribution details (such as campaign parameters and referring pages) to understand, in a general way, which of our efforts bring people to the studio.",
        "Under Quebec's Law 25 (the Act respecting the protection of personal information in the private sector) and Canada's federal PIPEDA (the Personal Information Protection and Electronic Documents Act), our legal basis for collecting and using this information is your consent. You give that consent when you choose to submit the form and send us your project details. We do not use your information to build advertising profiles, and we do not sell your personal information.",
      ],
    },
    {
      heading: "Cookies and Analytics",
      paragraphs: [
        "We keep tracking to a minimum. Our site uses Vercel Analytics, a privacy-friendly, cookie-less analytics tool. It measures aggregate traffic to the site (for example, how many people visit a page) without using cookies, without building advertising profiles, and without tracking you across other websites. We do not use advertising cookies, third-party ad networks, or social media tracking pixels.",
        "The only thing the site stores in your browser is a local theme preference (for example, remembering whether you chose the light or dark display). This is kept on your device, is not personal information, and is never sent to us.",
      ],
    },
    {
      heading: "Service Providers We Work With",
      paragraphs: [
        "To run the website and respond to inquiries, we rely on a small number of trusted service providers who process information on our behalf:",
      ],
      bullets: [
        "Supabase, which hosts the database where your inquiry is stored.",
        "Vercel, which hosts our website and provides the cookie-less analytics described above.",
        "Resend, which delivers the email notification that lets us know you have sent an inquiry.",
      ],
    },
    {
      heading: "International Processing and Safeguards",
      paragraphs: [
        "Some of these providers (Supabase, Vercel, and Resend) may process or store data on servers located outside Quebec, including in the United States. When information is handled outside Quebec, we take reasonable steps to ensure it receives appropriate protection, including by working with established providers that offer contractual and technical safeguards. We share your information with these providers only as needed to operate the site and respond to you, and not for their own independent marketing purposes.",
      ],
    },
    {
      heading: "How Long We Keep Your Information",
      paragraphs: [
        "We keep your inquiry only as long as we reasonably need it: to respond to you, to carry out any project you book, and to maintain ordinary business records (for example, records of who we have worked with). When the information is no longer needed for these purposes, we delete it. You can ask us to delete your inquiry at any time, and we will do so unless we are required to keep certain records for a limited period to meet a legal or accounting obligation.",
      ],
    },
    {
      heading: "Your Privacy Rights",
      paragraphs: [
        "Under Quebec's Law 25 and Canada's PIPEDA, you have the right to access the personal information we hold about you, to request that we correct (rectify) information that is inaccurate or incomplete, to withdraw your consent, and to request deletion of your information, subject to any limited legal retention needs.",
        "To exercise any of these rights, email us at summy.png@gmail.com. We will respond within the timelines required by law. If you are not satisfied with how we have handled your personal information, you have the right to file a complaint with the Commission d'acces a l'information du Quebec (CAI) or with the Office of the Privacy Commissioner of Canada.",
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "We take reasonable measures to protect your personal information against loss, theft, and unauthorized access, use, or disclosure, including by working with reputable providers for hosting, storage, and email delivery. Please keep in mind that no method of transmitting or storing information over the internet is perfectly secure, so we cannot guarantee absolute security. If you have any concerns about the security of your information, you are welcome to contact us.",
      ],
    },
    {
      heading: "Children",
      paragraphs: [
        "Our website and services are not directed to children under the age of 14, and we do not knowingly collect personal information from them. If you believe a child under 14 has provided us with personal information, please contact us and we will take appropriate steps to delete it.",
      ],
    },
    {
      heading: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices, our service providers, or the law. When we make changes, we will post the updated policy on this page. We encourage you to review it periodically. Your continued use of the site after an update means you accept the revised policy.",
      ],
    },
    {
      heading: "How to Contact Us",
      paragraphs: [
        "If you have any questions about this policy or about how we handle your personal information, email us at summy.png@gmail.com. This is also the address for our person responsible for the protection of personal information under Law 25, who can be reached at the same email.",
        "Email is our only contact channel, along with the contact form on this website. We do not maintain a public phone number or a public mailing address.",
      ],
    },
  ],
};

/** Terms of Use. */
export const termsOfUse: LegalDoc = {
  title: "Terms of Use",
  summary:
    "These terms govern your use of summysingh.com, the website of Summy Singh Photography, a Montreal based photography studio. They are informational and are not legal advice.",
  sections: [
    {
      heading: "Acceptance of These Terms",
      paragraphs: [
        'Welcome to summysingh.com, the website of Summy Singh Photography (also known as SummyPNG), a photography studio based in Montreal, Quebec, Canada. In these terms, "we," "us," and "our" mean Summy Singh Photography, and "you" means anyone who visits or uses the site.',
        "By accessing or using this website, you agree to these Terms of Use. If you do not agree with them, please do not use the site. We may update these terms from time to time, and your continued use of the site after an update means you accept the version then in effect.",
      ],
    },
    {
      heading: "About the Site and Our Services",
      paragraphs: [
        "This is an informational and portfolio website. It presents the work of Summy Singh, a sole photographer working in a cinematic, moody, dark toned editorial style across four areas: People (portraits), Businesses (commercial and brand work), Hospitality (restaurants, hotels, bars, and cafes), and Real Estate (architectural and interior photography).",
        "We serve Montreal, Greater Montreal, Quebec, and the rest of Canada, and we work in both English and French. Photography is offered on a quote basis. There are no public prices on this site. Every engagement is arranged by inquiry and confirmed in a separate written agreement or quote that is specific to your project.",
      ],
    },
    {
      heading: "Nothing on This Site Is an Offer",
      paragraphs: [
        "The photographs, descriptions, taglines, and any figures or examples shown on this site are illustrative only. They are meant to give you a sense of the work and the studio's approach. They are not a binding offer, a guaranteed availability, or a guaranteed price.",
        "A project is confirmed only when both parties agree to a separate written quote or agreement that sets out the scope, deliverables, pricing, and terms for that specific engagement. Until that written agreement is in place, nothing on this site or exchanged through it creates a contract or commits either of us to a booking.",
      ],
    },
    {
      heading: "Inquiries and Communication",
      paragraphs: [
        "When you submit the contact or booking form, you are sending us an inquiry so we can understand your project and reply. Submitting the form does not book a session, reserve a date, or create a contract of any kind.",
        "We will normally respond by email. Email (summy.png@gmail.com) and the website contact form are the only ways to reach the studio. There is no public phone number and no public mailing address. Please make sure the contact details you provide are accurate so we can reply, and avoid sending sensitive personal information through the form beyond what is needed to discuss your project.",
      ],
    },
    {
      heading: "Intellectual Property and Copyright",
      paragraphs: [
        "All content on this site, including the photographs, written text, layout, design, and other materials, is owned by Summy Singh Photography or used with permission, and is protected by Canadian and international copyright and other intellectual property laws. The photographs in particular are original creative works and remain the property of the studio.",
        "You may view the site and share links to its public pages for personal, non commercial purposes. You may not, without our prior written permission, copy, download, reproduce, republish, modify, distribute, scrape, harvest, or otherwise reuse any content from this site, and you may not use any content to train, fine tune, or develop artificial intelligence or machine learning models, or for any commercial purpose.",
        "We separately welcome reputable AI and search crawlers to index our public pages so that people can find the work. Allowing a page to be crawled or indexed is not permission to copy, store, or reuse the photographs or other content, and it does not grant any license to reproduce the images or to use them to train AI models. All rights not expressly granted are reserved.",
      ],
    },
    {
      heading: "Acceptable Use",
      paragraphs: [
        "You agree to use this site only for lawful purposes and in a way that does not infringe anyone's rights or restrict anyone else's use of it. You agree not to attempt to gain unauthorized access to any part of the site, its servers, or connected systems, and not to interfere with or disrupt the site's normal operation or security.",
        "You also agree not to introduce viruses or other harmful code, not to place an unreasonable load on the site through automated requests or other means, and not to use bots, scrapers, or similar tools to collect content or data from the site except as expressly permitted by these terms.",
      ],
    },
    {
      heading: "Third Party Links",
      paragraphs: [
        "This site may contain links to third party websites and platforms, such as Instagram. We provide these links for convenience only. The linked sites are not under our control, and we are not responsible for their content, their availability, or their privacy and security practices.",
        "Following a link to a third party site is at your own risk, and your use of that site is governed by its own terms and policies, not ours. A link from this site does not imply that we endorse the third party or anything it offers.",
      ],
    },
    {
      heading: "Disclaimers",
      paragraphs: [
        'The site is provided on an "as is" and "as available" basis. To the fullest extent permitted by applicable law, we make no warranties or representations of any kind, whether express or implied, about the site or its content, including any implied warranties of merchantability, fitness for a particular purpose, accuracy, or non infringement.',
        "We do not warrant that the site will be uninterrupted, timely, secure, or error free, or that any defects will be corrected. While we aim to keep the site current and accurate, the content may contain errors or become out of date, and you should not rely on it as the final word on pricing, availability, or the scope of any engagement.",
      ],
    },
    {
      heading: "Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by applicable Quebec and Canadian law, Summy Singh Photography will not be liable for any indirect, incidental, special, or consequential damages, or for any loss of data, revenue, or profits, arising out of or related to your use of, or inability to use, this site, even if we have been advised of the possibility of such damages.",
        "Nothing in these terms limits or excludes any liability that cannot be limited or excluded under applicable law. Where our liability cannot be excluded but may be limited, it is limited to the greatest extent permitted by law.",
      ],
    },
    {
      heading: "Privacy",
      paragraphs: [
        "Your privacy matters to us. How we collect, use, and protect personal information submitted through this site, including through the contact form, is explained in our Privacy Policy. The Privacy Policy forms part of your use of the site, and we encourage you to read it.",
        "In short, we handle personal information in accordance with Quebec's Law 25 and Canada's federal PIPEDA, we do not sell personal information, and we do not use advertising cookies or third party ad networks. Please see the Privacy Policy for the full details, including your rights of access, correction, and deletion.",
      ],
    },
    {
      heading: "Changes to These Terms",
      paragraphs: [
        "We may revise these Terms of Use at any time to reflect changes in our practices, our services, or the law. When we do, we will update the date shown on this page.",
        "Any changes take effect when they are posted here. We encourage you to review these terms periodically. By continuing to use the site after a change is posted, you accept the updated terms.",
      ],
    },
    {
      heading: "Governing Law and Disputes",
      paragraphs: [
        "These Terms of Use are governed by and interpreted in accordance with the laws of the Province of Quebec and the laws of Canada applicable in that province, without regard to conflict of law principles.",
        "Any dispute arising out of or relating to these terms or your use of the site is subject to the exclusive jurisdiction of the courts of the Province of Quebec, and you agree to submit to that jurisdiction.",
      ],
    },
    {
      heading: "Contact",
      paragraphs: [
        "If you have questions about these Terms of Use, or about your use of this site, you can reach the studio by email at summy.png@gmail.com or through the contact form on this website.",
        "This document is provided for general information only and is not legal advice.",
      ],
    },
  ],
};
