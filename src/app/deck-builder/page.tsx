'use client';

import { useState, useEffect } from 'react';
import { Card, DeckGenerationResponse } from '@/types';
import { fetchCards } from '@/services/api';
import { useDeck } from '@/hooks/useDeck';
import { useToast } from '@/context/ToastContext';
import { downloadYDK } from '@/services/ydk';
import { Search, Info, Plus, Trash2, Download, Save, Filter, ChevronLeft, ChevronRight, FilePlus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function DeckBuilder() {
    const { activeDeck, addCardToActive, removeCardFromActive, updateActiveDeck, createDeck } = useDeck();
    const { showToast } = useToast();

    const [searchResults, setSearchResults] = useState<Card[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);


    // Filters
    const [type, setType] = useState('');
    const [attribute, setAttribute] = useState('');

    const [page, setPage] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        handleSearch();
    }, [page]);

    async function handleSearch(e?: React.FormEvent) {
        if (e) {
            e.preventDefault();
            setPage(0);
        }
        setLoading(true);
        try {
            const params: Record<string, string> = {
                num: pageSize.toString(),
                offset: (page * pageSize).toString(),
                fname: search
            };
            if (type) params.type = type;
            if (attribute) params.attribute = attribute;

            const { data } = await fetchCards(params);
            setSearchResults(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = () => {
        showToast('Deck Salvo', `"${activeDeck?.name}" foi sincronizado com sucesso.`, 'success');
    };


    if (!activeDeck) return <div className="container">Invocando Deck...</div>;

    return (
        <div className="flex" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* Left: Card Details */}
            <aside className="glass" style={{ width: '350px', padding: '1.5rem', overflowY: 'auto', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column' }}>
                <h2 className="section-title">Análise</h2>
                {selectedCard ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <img
                            src={selectedCard.card_images[0].image_url}
                            alt={selectedCard.name}
                            style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                        />
                        <div>
                            <h3 style={{ color: 'var(--accent)', fontSize: '1.25rem' }}>{selectedCard.name}</h3>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6, textTransform: 'uppercase', fontWeight: 'bold' }}>
                                {selectedCard.type} | {selectedCard.attribute || selectedCard.race}
                            </p>
                        </div>
                        <div style={{ fontSize: '0.9rem', lineHeight: 1.6, background: 'var(--card-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', maxHeight: '250px', overflowY: 'auto' }}>
                            {selectedCard.desc}
                        </div>
                        <button className="primary" onClick={() => addCardToActive(selectedCard)} style={{ gap: '0.5rem', height: '50px' }}>
                            <Plus size={20} /> Adicionar ao Deck
                        </button>
                    </motion.div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3, textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
                        <Info size={48} />
                        <p>Selecione uma carta para<br />ver suas propriedades</p>
                    </div>
                )}
            </aside>

            {/* Center: Deck Workspace */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'rgba(0,0,0,0.02)' }}>
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <div className="flex flex-col gap-1">
                            <label style={{ fontSize: '0.7rem', opacity: 0.5, fontWeight: 'bold', textTransform: 'uppercase' }}>Nome do seu Deck</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={activeDeck.name}
                                    onChange={(e) => updateActiveDeck({ name: e.target.value })}
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: '800',
                                        background: 'transparent',
                                        border: 'none',
                                        padding: 0,
                                        letterSpacing: '-0.05em',
                                        color: 'var(--accent)',
                                        width: '100%',
                                        outline: 'none'
                                    }}
                                    placeholder="Sem nome..."
                                />
                            </div>
                        </div>
                        <p style={{ opacity: 0.5, fontWeight: '600' }}>
                            {activeDeck.main.length}/60 MAIN DECK · {activeDeck.extra.length}/15 EXTRA
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            className="glass"
                            onClick={() => window.location.href = '/ai-generator'}
                            style={{
                                gap: '0.5rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
                                border: 'none',
                                color: 'white'
                            }}
                        >
                            <Sparkles size={18} /> Gerar com IA
                        </button>
                        <button className="glass" onClick={() => createDeck('Novo Deck')} style={{ gap: '0.5rem', borderRadius: '12px', border: '1px solid var(--accent)' }}>
                            <FilePlus size={18} /> Novo Deck
                        </button>
                        <button className="glass" onClick={() => downloadYDK(activeDeck)} style={{ gap: '0.5rem', borderRadius: '12px' }}>
                            <Download size={18} /> .YDK
                        </button>
                        <button className="primary" onClick={handleSave} style={{ gap: '0.5rem', borderRadius: '12px', padding: '0 1.5rem' }}>
                            <Save size={18} /> Salvar Alterações
                        </button>
                    </div>
                </header>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="section-title" style={{ marginBottom: 0 }}>Main Deck</h3>
                        <div style={{ height: '4px', flex: 1, margin: '0 2rem', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${(activeDeck.main.length / 60) * 100}%` }}
                                style={{ height: '100%', background: 'var(--accent)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px' }}>
                        {activeDeck.main.map((card, idx) => (
                            <motion.div
                                key={`${card.id}-${idx}`}
                                layout
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                                onClick={() => setSelectedCard(card)}
                                onContextMenu={(e) => { e.preventDefault(); removeCardFromActive(card.id, 'main'); }}
                                style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1.45', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                            >
                                <img src={card.card_images[0].image_url_small} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        ))}
                        {activeDeck.main.length === 0 && (
                            <div style={{ gridColumn: '1/-1', border: '2px dashed var(--glass-border)', borderRadius: '16px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                Arraste ou adicione cartas para começar seu deck principal
                            </div>
                        )}
                    </div>

                    <h3 className="section-title" style={{ marginTop: '3rem' }}>Extra Deck</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px' }}>
                        {activeDeck.extra.map((card, idx) => (
                            <motion.div
                                key={`${card.id}-${idx}`}
                                layout
                                whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                                onClick={() => setSelectedCard(card)}
                                onContextMenu={(e) => { e.preventDefault(); removeCardFromActive(card.id, 'extra'); }}
                                style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent-secondary)', boxShadow: '0 4px 10px rgba(126, 34, 206, 0.2)' }}
                            >
                                <img src={card.card_images[0].image_url_small} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        ))}
                        {activeDeck.extra.length === 0 && (
                            <div style={{ gridColumn: '1/-1', border: '2px dashed var(--glass-border)', borderRadius: '16px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                Monstros de fusão, synchro, xyz e link aparecerão aqui
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Right: Search & Filters */}
            <aside className="glass" style={{ width: '400px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRight: 'none', borderTop: 'none', borderBottom: 'none' }}>
                <h2 className="section-title">Base de Cartas</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <form onSubmit={(e) => handleSearch(e)} style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', paddingLeft: '3rem', borderRadius: '12px' }}
                        />
                    </form>

                    <div className="flex gap-2">
                        <select value={type} onChange={(e) => { setType(e.target.value); setPage(0); }} style={{ flex: 1, fontSize: '0.8rem', height: '40px' }}>
                            <option value="">Todos Tipos</option>
                            <option value="Normal Monster">Normal</option>
                            <option value="Effect Monster">Effect</option>
                            <option value="Spell Card">Magia</option>
                            <option value="Trap Card">Armadilha</option>
                        </select>
                        <select value={attribute} onChange={(e) => { setAttribute(e.target.value); setPage(0); }} style={{ flex: 1, fontSize: '0.8rem', height: '40px' }}>
                            <option value="">Atributos</option>
                            <option value="DARK">DARK</option>
                            <option value="LIGHT">LIGHT</option>
                            <option value="EARTH">EARTH</option>
                        </select>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5 }}>Procurando...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                            {searchResults.map(card => (
                                <motion.div
                                    key={card.id}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSelectedCard(card)}
                                    style={{ borderRadius: '6px', overflow: 'hidden', cursor: 'pointer', border: selectedCard?.id === card.id ? '2px solid var(--accent)' : '1px solid var(--glass-border)' }}
                                >
                                    <img src={card.card_images[0].image_url_small} alt={card.name} style={{ width: '100%', height: 'auto' }} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                    <button className="glass" disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem', borderRadius: '10px' }}>
                        <ChevronLeft size={18} />
                    </button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Página {page + 1}</span>
                    <button className="glass" disabled={searchResults.length < pageSize} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem', borderRadius: '10px' }}>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </aside>

        </div>
    );
}
