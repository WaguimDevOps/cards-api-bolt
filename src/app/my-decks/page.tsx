'use client';

import { useDeck } from '@/hooks/useDeck';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Plus, Calendar, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyDecks() {
    const { decks, setActiveDeckId, deleteDeck, createDeck } = useDeck();
    const router = useRouter();

    const handleEdit = (id: string) => {
        setActiveDeckId(id);
        router.push('/deck-builder');
    };

    const handleCreateNew = () => {
        const newDeck = createDeck(`Novo Deck ${decks.length + 1}`);
        router.push('/deck-builder');
    };

    return (
        <main className="container">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', color: 'var(--accent)' }}>Meus Decks</h1>
                    <p style={{ opacity: 0.6 }}>Você tem {decks.length} estratégias salvas.</p>
                </div>
                <button className="primary" onClick={handleCreateNew} style={{ gap: '0.5rem' }}>
                    <Plus size={20} /> Criar Novo Deck
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {decks.map((deck) => (
                    <motion.div
                        key={deck.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass"
                        style={{ borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                    >
                        <div className="flex justify-between items-start">
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--accent)' }}>{deck.name}</h2>
                            <div className="flex gap-2">
                                <button className="glass" onClick={() => handleEdit(deck.id)} style={{ width: '36px', height: '36px', padding: 0 }}>
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    className="glass"
                                    onClick={() => { if (confirm('Excluir este deck?')) deleteDeck(deck.id) }}
                                    style={{ width: '36px', height: '36px', padding: 0, color: '#ff4d4d' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                            <div className="flex items-center gap-1">
                                <Layers size={14} /> {deck.main.length + deck.extra.length} cartas
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={14} /> {new Date(deck.updatedAt).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Deck Preview (Show first 5 cards) */}
                        <div className="flex gap-1" style={{ height: '60px', overflow: 'hidden', borderRadius: '8px' }}>
                            {deck.main.slice(0, 5).map((card, i) => (
                                <img key={i} src={card.card_images[0].image_url_small} alt="" style={{ height: '100%', width: 'auto' }} />
                            ))}
                            {deck.main.length === 0 && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)', fontSize: '0.75rem', opacity: 0.5 }}>
                                    Deck Vazio
                                </div>
                            )}
                        </div>

                        <button
                            className="primary"
                            onClick={() => handleEdit(deck.id)}
                            style={{ width: '100%', marginTop: '0.5rem', background: 'rgba(212, 175, 55, 0.1)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                        >
                            Abrir no Builder
                        </button>
                    </motion.div>
                ))}
            </div>

            {decks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
                    <p>Você ainda não criou nenhum deck. Comece a sua jornada agora!</p>
                </div>
            )}
        </main>
    );
}
