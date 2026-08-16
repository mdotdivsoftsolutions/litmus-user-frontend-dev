"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface NavLinkProps extends Omit<ComponentProps<typeof Link>, "className" | "href"> {
  href?: string;
  to?: string;
  className?: string | ((props: { isActive: boolean }) => string | undefined);
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, to, exact, children, ...props }, ref) => {
    const pathname = usePathname();
    const targetHref = href || to || "/";
    const isActive = exact
      ? pathname === targetHref
      : pathname === targetHref || (targetHref !== "/" && pathname?.startsWith(targetHref));

    const computedClassName =
      typeof className === "function"
        ? className({ isActive })
        : cn(className, isActive && activeClassName);

    return (
      <Link
        ref={ref}
        href={targetHref}
        className={computedClassName}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
