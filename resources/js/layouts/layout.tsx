import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs: BreadcrumbItem[];
}

export default function Layout({ children, breadcrumbs }: AppLayoutProps) {
    return (
        <>
            <Head title="MUST Venue Finder" />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">MUST Venue Finder</h1>
                            <nav>
                                <Link href="/" className="text-primary hover:underline">
                                    Home
                                </Link>
                                <Link href="/dashboard" className="ml-4 text-primary hover:underline">
                                    Dashboard
                                </Link>
                                {window.Laravel?.user ? (
                                    <Link href="/logout" method="post" className="ml-4 text-primary hover:underline">
                                        Logout
                                    </Link>
                                ) : (
                                    <Link href="/login" className="ml-4 text-primary hover:underline">
                                        Login
                                    </Link>
                                )}
                            </nav>
                        </div>
                        <nav className="mt-4">
                            {breadcrumbs.map((item, index) => (
                                <span key={item.href}>
                                    <Link href={item.href} className="text-gray-600 hover:underline">
                                        {item.title}
                                    </Link>
                                    {index < breadcrumbs.length - 1 && ' / '}
                                </span>
                            ))}
                        </nav>
                    </div>
                </header>
                <main className="container mx-auto p-4">{children}</main>
            </div>
        </>
    );
}
