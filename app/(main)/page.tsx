import {
  fetchSiteSettings,
  fetchPortfolioItems,
  fetchServices,
  fetchContactDetails,
} from '@/sanity/lib/fetch';
import Nav from '@/components/nav';
import Hero from '@/components/sections/hero';
import Work from '@/components/sections/work';
import About from '@/components/sections/about';
import Services from '@/components/sections/services';
import Contact from '@/components/sections/contact';
import SiteFooter from '@/components/sections/site-footer';
import HomepageClient from '@/components/homepage-client';
import BackToTop from '@/components/back-to-top';
import type {
  SiteSettings,
  PortfolioItem,
  Service,
  ContactDetail,
} from '@/types';

export default async function IndexPage() {
  const [settings, portfolioItems, services, contactDetails] =
    await Promise.all([
      fetchSiteSettings(),
      fetchPortfolioItems(),
      fetchServices(),
      fetchContactDetails(),
    ]);

  const siteSettings = (settings || {}) as SiteSettings;
  const items = (portfolioItems || []) as PortfolioItem[];
  const servicesList = (services || []) as Service[];
  const details = (contactDetails || []) as ContactDetail[];

  return (
    <HomepageClient>
      <Nav overlayOnMedia />
      <Hero settings={siteSettings} />
      <About settings={siteSettings} />
      <Work items={items} />
      <Services services={servicesList} />
      <Contact settings={siteSettings} contactDetails={details} />
      <BackToTop />
      <SiteFooter />
    </HomepageClient>
  );
}
