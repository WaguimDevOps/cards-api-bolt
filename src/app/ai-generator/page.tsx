'use client';

import React, { useState, useEffect } from 'react';
import {
    Wand2, Sparkles, Settings2, Zap, Shield, Save,
    Share2, Sword, Home, Library, LayoutDashboard,
    ChevronDown, Search, Filter, Trash2, Download,
    RotateCcw
} from 'lucide-react';
import { generateDeckWithAI } from '@/services/gemini';
import { useToast } from '@/context/ToastContext';
import { useDeck } from '@/hooks/useDeck';
import { motion, AnimatePresence } from 'framer-motion';
import { DeckGenerationRequest, DeckGenerationResponse, Card } from '@/types';

export default function AIGeneratorPage() {
    const { showToast } = useToast();
    const { createDeck, updateActiveDeck, setActiveDeckId } = useDeck();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DeckGenerationResponse | null>(null);

    const [config, setConfig] = useState<DeckGenerationRequest>({
        prompt: '',
        deckSize: 'competitive',
        playstyle: 'aggro',
        archetype: ''
    });

    const handleGenerate = async () => {
        if (!config.prompt.trim() && !config.archetype?.trim()) {
            showToast('Descreva o deck ou informe um arquétipo!', '', 'error');
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const response = await generateDeckWithAI(config);
            setResult(response);
            showToast('Deck gerado com sucesso!', 'Sua nova estratégia está pronta.', 'success');
        } catch (error: any) {
            showToast(error.message || 'Erro ao gerar deck', '', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (!result) return;
        const baseName = config.archetype || config.prompt.slice(0, 24);
        const deckName = `AI: ${baseName}${baseName.length > 24 ? '...' : ''}`;

        const newDeck = createDeck(deckName);
        if (newDeck) {
            setActiveDeckId(newDeck.id);
            updateActiveDeck({
                main: result.cards.main,
                extra: result.cards.extra,
                name: deckName,
            });
            showToast('Deck Salvo!', `"${deckName}" foi adicionado à sua coleção.`, 'success');
        }
    };

    return (
        <main className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <nav className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-30 shrink-0">
                <div className="flex items-center gap-8">
                    <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                        <LayoutDashboard className="text-purple-600" size={20} />
                        Yu-Gi-Oh! Deck Builder
                    </h1>
                    <div className="hidden md:flex items-center gap-6">
                        <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Decks</button>
                        <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Cards</button>
                        <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Import Deck</button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-all">
                        <Library size={18} className="text-slate-600" />
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Filters & AI Generation */}
                <aside className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex flex-col shrink-0">
                    <div className="p-6 flex-1 space-y-8 custom-scrollbar">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Build the Ultimate Deck</h4>
                            <p className="text-xs font-bold text-slate-800">WITH AI</p>
                        </div>

                        {/* Filters Section */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Filters</h4>
                            <div className="space-y-4">
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Card Type</label>
                                    <div className="relative">
                                        <select className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs appearance-none focus:border-purple-400 outline-none">
                                            <option>All Types</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400" />
                                    </div>
                                </div>
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Attribute</label>
                                    <div className="relative">
                                        <select className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs appearance-none focus:border-purple-400 outline-none">
                                            <option>All Attributes</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400" />
                                    </div>
                                </div>
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Archetype</label>
                                    <input
                                        type="text"
                                        placeholder="Search archetype..."
                                        className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none focus:border-purple-400"
                                    />
                                </div>
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">ATK Range</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Min" className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none" />
                                        <input type="text" placeholder="Max" defaultValue="4000" className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none" />
                                    </div>
                                </div>
                                <button className="w-full py-2-5 text-xs bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-500 hover:bg-slate-100 transition-all">
                                    Reset Filters
                                </button>
                            </div>
                        </div>

                        {/* AI Generation Section */}
                        <div className="pt-4 border-t border-slate-100">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">AI Generation</h4>
                            <div className="space-y-4">
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Deck Strategy</label>
                                    <div className="relative">
                                        <select
                                            value={config.playstyle}
                                            onChange={(e: any) => setConfig({ ...config, playstyle: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs appearance-none focus:border-purple-400 outline-none"
                                        >
                                            <option value="aggro">Aggro</option>
                                            <option value="control">Control</option>
                                            <option value="combo">Combo</option>
                                            <option value="midrange">Midrange</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400" />
                                    </div>
                                </div>
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Focus Archetype</label>
                                    <input
                                        type="text"
                                        placeholder="Blue-Eyes, Dark Magician..."
                                        value={config.archetype}
                                        onChange={(e) => setConfig({ ...config, archetype: e.target.value })}
                                        className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none focus:border-purple-400"
                                    />
                                </div>
                                <div className="space-y-1-5">
                                    <label className="text-xs font-bold text-slate-600">Deck Size</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Min" defaultValue="40" className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none" />
                                        <input type="text" placeholder="Max" defaultValue="45" className="w-full bg-white border border-slate-200 rounded-md p-2-5 text-xs outline-none" />
                                    </div>
                                </div>
                                <button className="w-full py-2-5 text-xs bg-slate-50 border border-slate-200 rounded-md font-bold text-slate-500 hover:bg-slate-100 transition-all">
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Generate Button Fixed at Bottom */}
                    <div className="p-6 border-t border-slate-200 bg-white">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className={`w-full py-3-5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50 ${loading ? 'bg-purple-100 text-purple-600' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}
                        >
                            <Zap size={14} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Generating...' : 'Generate With AI'}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area: Deck View */}
                <section className="flex-1 overflow-y-auto flex flex-col bg-slate-50 relative custom-scrollbar">
                    {/* Header */}
                    <header className="bg-white border-b border-slate-200 p-6 flex items-center justify-between sticky top-0 z-20">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {result ? (config.archetype || 'New AI Deck') : 'My Deck'}
                            </h2>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {result ? `${result.cards.main.length} cards in main deck - ${result.cards.extra.length} cards in extra deck` : '0 cards in main deck - 0 cards in extra deck'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs font-bold flex items-center gap-2 text-slate-700 transition-all shadow-sm">
                                <Download size={14} /> Export
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!result}
                                className={`px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${result ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'}`}
                            >
                                <Save size={14} /> Save
                            </button>
                            <button
                                onClick={() => setResult(null)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                            >
                                <Trash2 size={14} /> Clear Deck
                            </button>
                        </div>
                    </header>

                    <div className="p-8 space-y-12">
                        {/* Main Deck Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <h3 className="text-sm font-black uppercase text-slate-930 tracking-wider">
                                    Main Deck ({result ? result.cards.main.length : 0})
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button className="p-1 px-3 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 shadow-sm">
                                        <ChevronDown size={10} /> Sort by Name
                                    </button>
                                    <button className="p-1 px-3 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 shadow-sm">
                                        <ChevronDown size={10} /> Sort by Type
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                <AnimatePresence mode="popLayout">
                                    {result ?
                                        Object.values(result.cards.main.reduce((acc: any, card: Card) => {
                                            if (!acc[card.id]) acc[card.id] = { ...card, count: 0 };
                                            acc[card.id].count++;
                                            return acc;
                                        }, {} as Record<string, any>)).map((card: any, i) => (
                                            <motion.div
                                                key={`${card.id}-${i}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative aspect-[2/3] rounded overflow-hidden shadow-sm group cursor-pointer border border-slate-200 bg-slate-200"
                                                title={card.name}
                                            >
                                                <img src={card.card_images[0].image_url_small} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-black px-1-5 py-0-5 rounded-sm backdrop-blur-[2px]">
                                                    x{card.count}
                                                </div>
                                            </motion.div>
                                        )) :
                                        Array.from({ length: 40 }).map((_, i) => (
                                            <div key={i} className="aspect-[2/3] bg-slate-100 rounded border border-slate-200 border-dashed flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-slate-300">Slot {i + 1}</span>
                                            </div>
                                        ))
                                    }
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Extra Deck Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                                    Extra Deck ({result ? result.cards.extra.length : 0})
                                </h3>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {result ?
                                    Object.values(result.cards.extra.reduce((acc: any, card: Card) => {
                                        if (!acc[card.id]) acc[card.id] = { ...card, count: 0 };
                                        acc[card.id].count++;
                                        return acc;
                                    }, {} as Record<string, any>)).map((card: any, i) => (
                                        <div key={i} className="relative aspect-[2/3] rounded overflow-hidden shadow-sm border border-slate-200 bg-slate-200" title={card.name}>
                                            <img src={card.card_images[0].image_url_small} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-black px-1-5 py-0-5 rounded-sm backdrop-blur-[2px]">
                                                x{card.count}
                                            </div>
                                        </div>
                                    )) :
                                    Array.from({ length: 15 }).map((_, i) => (
                                        <div key={i} className="aspect-[2/3] bg-slate-100 rounded border border-slate-200 border-dashed" />
                                    ))
                                }
                            </div>
                        </div>

                        {/* Side Deck Section Placeholder */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                                    Side Deck (0)
                                </h3>
                                <ChevronDown size={14} className="text-slate-400" />
                            </div>
                            <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 border-dashed rounded-lg text-center opacity-50">
                                <Sparkles size={32} className="text-slate-300 mb-2" />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drag cards here to add to side deck</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Sidebar: Card Database */}
                <aside className="w-72 bg-white border-l border-slate-200 flex flex-col">
                    <div className="p-5 flex-1 overflow-hidden flex flex-col">
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search cards...."
                                className="w-full bg-white border border-slate-200 rounded-lg p-2-5 text-xs outline-none focus:ring-1 focus:ring-purple-400"
                            />
                            <Search size={14} className="absolute right-3 top-3 text-slate-400" />
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Card Database</h4>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 custom-scrollbar">
                            {[
                                { name: 'Blue-Eyes White Dragon', type: 'Monster · Light · Dragon', level: 'Level 8', atk: 3000, def: 2500, color: '#fef3c7' },
                                { name: 'Dark Magician', type: 'Monster · Dark · Spellcaster', level: 'Level 7', atk: 2500, def: 2100, color: '#e0e7ff' },
                                { name: 'Pot of Greed', type: 'Spell · Normal', level: 'Spell', atk: 0, def: 0, color: '#dcfce7' },
                                { name: 'Mirror Force', type: 'Trap · Normal', level: 'Trap', atk: 0, def: 0, color: '#fce7f3' },
                                { name: 'Red-Eyes Black Dragon', type: 'Monster · Dark · Dragon', level: 'Level 7', atk: 2400, def: 2000, color: '#ffedd5' },
                            ].map((card, i) => (
                                <div key={i} className="flex gap-3 p-2 group hover:bg-slate-50 transition-colors rounded-md cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className="w-10 h-10 rounded-md flex items-center justify-center p-1" style={{ backgroundColor: card.color }}>
                                        <div className="w-full h-full bg-white/20 rounded-sm" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-[11px] font-bold text-slate-900 truncate">{card.name}</h5>
                                        <p className="text-[9px] text-slate-500 truncate">{card.type}</p>
                                        <div className="flex gap-2 mt-0-5">
                                            <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-1 rounded uppercase tracking-tighter">{card.level}</span>
                                            <span className="text-[8px] font-black text-slate-400">ATK : {card.atk}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Section at Bottom */}
                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-700">WaguimDev</span>
                                    <span className="text-[9px] text-slate-400">Pro Collector</span>
                                </div>
                            </div>
                            <Settings2 size={16} className="text-slate-400" />
                        </div>
                    </div>
                </aside>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }

                body {
                    background: #f8fafc;
                }

                @media (max-width: 1024px) {
                    aside { display: none; }
                }
            `}</style>
        </main>
    );
}