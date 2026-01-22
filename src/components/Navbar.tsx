'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { LayoutDashboard, Library, Home, Moon, Sun, Zap } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { name: 'Início', href: '/', icon: Home },
        { name: 'Deck Builder', href: '/deck-builder', icon: LayoutDashboard },
        { name: 'Meus Decks', href: '/my-decks', icon: Library },
        { name: 'AI Creator', href: '/ai-generator', icon: Zap },
    ];

    return (
        <nav className="glass" style={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            padding: '0.75rem 0'
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: 0,
                paddingBottom: 0
            }}>
                <Link href="/" style={{
                    textDecoration: 'none',
                    color: 'var(--accent)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.05em'
                }}>
                    YGO<span style={{ color: 'var(--foreground)' }}>PRO</span>
                </Link>

                <div className="flex gap-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} className={`ghost ${isActive ? 'active' : ''}`} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                color: isActive ? 'var(--accent)' : 'var(--foreground)',
                                fontWeight: isActive ? 600 : 400,
                                opacity: isActive ? 1 : 0.7
                            }}>
                                <Icon size={18} />
                                <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <button onClick={toggleTheme} className="glass" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    padding: 0
                }}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
        </nav>
    );
}
