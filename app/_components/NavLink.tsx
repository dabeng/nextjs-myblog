'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
/*
* An extended version of the Next.js Link component that adds the CSS className "active" when
* the href matches the current URL. By default the href only needs to match the start of the
* URL, use the exact property to change it to an exact match (e.g. <NavLink href="/"
* exact>Home</NavLink>).
*/
export { NavLink };

interface INavLink {
    children: React.ReactNode,
    href: string,
    exact?: boolean,
    [key: string]: any
}

function NavLink({ children, href, exact, ...props }: INavLink) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        props.className += ' is-active';
    }

    return <Link href={href} {...props}>{children}</Link>;
}
