"use client";

/** A compact five-destination navigation for small browser screens; desktop keeps the full header. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "#/components/brand/icon.tsx";
import { useLanguage } from "#/lib/site/i18n.tsx";
interface Destination {
  href: string;
  title: string;
  icon: IconName;
}
const destinations: readonly Destination[] = [
  { href: "/", title: "Home", icon: "home" },
  { href: "/explore", title: "Explore", icon: "compass" },
  { href: "/leaderboards", title: "Rankings", icon: "trophy" },
  { href: "/search", title: "Search", icon: "search" },
  { href: "/profile", title: "Profile", icon: "user" },
];
export function MobileNav() {
  const path = usePathname();
  const { tr } = useLanguage();
  return (
    <nav
      aria-label="Quick navigation"
      className="mz-mobile-nav glass-strong fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[var(--border-default)] sm:hidden"
    >
      {destinations.map((item, index) => {
        const active =
          path === item.href ||
          (item.href !== "/" && path.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={tr(item.title)}
            aria-current={active ? "page" : undefined}
            className={`relative flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-clay" : "text-content-muted"}`}
          >
            {index === 2 ? (
              <span className="mz-web-trophy grid h-12 w-12 place-items-center rounded-full text-white">
                <Icon name="trophy" size={26} />
                <span
                  aria-hidden
                  className="absolute -right-1 -top-1 text-base text-calabash"
                >
                  ✦
                </span>
              </span>
            ) : (
              <>
                <Icon name={item.icon} size={22} />
                <span>{tr(item.title)}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
