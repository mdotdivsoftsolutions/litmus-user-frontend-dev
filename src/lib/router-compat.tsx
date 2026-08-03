"use client";

/**
 * React Router DOM compatibility layer for Next.js.
 * This module provides hooks and components that mirror the react-router-dom API
 * but use Next.js App Router internals under the hood.
 * 
 * This allows pages copied from the Vite+React app to work with minimal changes.
 */

import { useRouter, useParams as useNextParams, usePathname, useSearchParams as useNextSearchParams } from "next/navigation";
import NextLink from "next/link";
import React, { createContext, useContext, forwardRef } from "react";

// useNavigate → returns a function that pushes to a route
export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      else router.push("/");
    } else if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

// useParams → same name, just re-export Next.js version
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useNextParams() as T;
}

// useLocation → approximation using pathname + searchParams
export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  return {
    pathname,
    search: searchParams?.toString() ? `?${searchParams.toString()}` : "",
    hash: "",
    state: null,
    key: "default",
  };
}

// useSearchParams → matches react-router-dom signature [searchParams, setSearchParams]
export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (
    params: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean; state?: any }
  ) => {
    let newParams: URLSearchParams;
    if (typeof params === "function") {
      newParams = params(new URLSearchParams(searchParams?.toString() || ""));
    } else if (params instanceof URLSearchParams) {
      newParams = params;
    } else {
      newParams = new URLSearchParams(params as Record<string, string>);
    }

    const query = newParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    if (options?.replace) {
      router.replace(url);
    } else {
      router.push(url);
    }
  };

  return [searchParams || new URLSearchParams(), setSearchParams] as const;
}

// Link component → wraps Next.js Link to accept `to` prop instead of `href`
interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  replace?: boolean;
  children: React.ReactNode;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, replace, children, ...rest }, ref) => {
    return (
      <NextLink href={to} replace={replace} ref={ref} {...rest}>
        {children}
      </NextLink>
    );
  }
);
Link.displayName = "Link";

// Navigate component → client-side redirect
export function Navigate({ to, replace = false }: { to: string; replace?: boolean; state?: any }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
}

// Outlet → just renders children (used in layout patterns)
const OutletContext = createContext<React.ReactNode>(null);

export function Outlet() {
  const children = useContext(OutletContext);
  return <>{children}</>;
}

export function OutletProvider({ children, outlet }: { children: React.ReactNode; outlet: React.ReactNode }) {
  return (
    <OutletContext.Provider value={outlet}>
      {children}
    </OutletContext.Provider>
  );
}

export interface NavLinkProps extends Omit<LinkProps, 'className' | 'style' | 'children'> {
  className?: string | ((props: { isActive: boolean; isPending: boolean }) => string | undefined);
  style?: React.CSSProperties | ((props: { isActive: boolean; isPending: boolean }) => React.CSSProperties | undefined);
  children?: React.ReactNode | ((props: { isActive: boolean; isPending: boolean }) => React.ReactNode);
  end?: boolean;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ to, className, style, children, end, ...rest }, ref) => {
    const pathname = usePathname();
    const isActive = end ? pathname === to : pathname?.startsWith(to);

    const computedClassName = typeof className === 'function' ? className({ isActive, isPending: false }) : className;
    const computedStyle = typeof style === 'function' ? style({ isActive, isPending: false }) : style;

    return (
      <Link to={to} ref={ref} className={computedClassName} style={computedStyle} {...rest}>
        {typeof children === 'function' ? children({ isActive, isPending: false }) : children}
      </Link>
    );
  }
);
NavLink.displayName = "NavLink";
