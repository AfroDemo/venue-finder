import { Head, Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs: BreadcrumbItem[];
    user?: any; // Added missing user prop
}

export default function Layout({ children, user, breadcrumbs }: AppLayoutProps) {
    return (
        <>
            <Head title="MUST Venue Finder" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white shadow dark:bg-gray-800 dark:shadow-gray-700/50">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">MUST Venue Finder</h1>
                            <nav>
                                {user ? (
                                    <>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/dashboard"
                                                className="ml-4 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="ml-4 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/register"
                                            className="ml-4 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Register
                                        </Link>
                                        <Link href="/login" className="ml-4 text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                                            Login
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>
                <main className="container mx-auto p-4">{children}</main>
            </div>
        </>
    );
}
