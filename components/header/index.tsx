// components/header/index.tsx
import HeaderClient from "@/components/header/header-client";
import {
  fetchSanityNavigation,
  fetchSanitySettings,
} from "@/sanity/lib/fetch";

export default async function Header() {
  const [settings, navigation] = await Promise.all([
    fetchSanitySettings(),
    fetchSanityNavigation(),
  ]);

  return <HeaderClient navigation={navigation} settings={settings} />;
}
