export default function SiteFooter() {
  return (
    <footer className="py-8 px-12 border-t border-border flex justify-between items-center max-md:px-6">
      <p className="text-[0.7rem] text-text-muted tracking-[0.08em]">
        &copy; {new Date().getFullYear()} Alan Cross. All rights reserved.
      </p>
      <p className="text-[0.7rem] text-text-muted tracking-[0.08em]">
        alanxai.com
      </p>
    </footer>
  );
}
