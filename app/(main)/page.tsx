import {
  fetchSiteSettings,
  fetchPortfolioItems,
  fetchServices,
  fetchSocialLinks,
} from "@/sanity/lib/fetch";
import Nav from "@/components/nav";
import Hero from "@/components/sections/hero";
import Work from "@/components/sections/work";
import About from "@/components/sections/about";
import Services from "@/components/sections/services";
import Contact from "@/components/sections/contact";
import SiteFooter from "@/components/sections/site-footer";
import HomepageClient from "@/components/homepage-client";
import type { SiteSettings, PortfolioItem, Service, SocialLink } from "@/types";

export default async function IndexPage() {
  const [settings, portfolioItems, services, socialLinks] = await Promise.all([
    fetchSiteSettings(),
    fetchPortfolioItems(),
    fetchServices(),
    fetchSocialLinks(),
  ]);

  const siteSettings = (settings || {}) as SiteSettings;
  const items = (portfolioItems || []) as PortfolioItem[];
  const servicesList = (services || []) as Service[];
  const links = (socialLinks || []) as SocialLink[];

  return (
    <HomepageClient>
      <Nav />
      <Hero settings={siteSettings} />
      <Work items={items} />
      <About settings={siteSettings} />
      <Services services={servicesList} />
      <Contact settings={siteSettings} socialLinks={links} />
      <SiteFooter />
    </HomepageClient>
  );
}
