'use client';

import { useState, useEffect } from 'react';
import { generateUUID } from '@/utils/id';
import { Card, Deck } from '@/types';
import { useToast } from '@/context/ToastContext';

const STORAGE_KEY = 'ygo_decks_v2';

const isExtraDeckCard = (card: Card) => {
    const type = card.type.toLowerCase();
    return type.includes('fusion') ||
        type.includes('synchro') ||
        type.includes('xyz') ||
        type.includes('link');
};


export function useDeck() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDecks(parsed);
                if (parsed.length > 0) {
                    const lastActiveId = localStorage.getItem('active_deck_id');
                    setActiveDeckId(lastActiveId || parsed[0].id);
                }
            } catch (e) {
                console.error('Error loading decks', e);
            }
        } else {
            const defaultDeck: Deck = {
                id: generateUUID(),
                name: 'Meu Deck 1',
                main: [],
                extra: [],
                side: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            setDecks([defaultDeck]);
            setActiveDeckId(defaultDeck.id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultDeck]));
        }
    }, []);

    const activeDeck = decks.find(d => d.id === activeDeckId) || null;

    const saveDecks = (updatedDecks: Deck[]) => {
        setDecks(updatedDecks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks));
    };

    const createDeck = (name: string) => {
        const newDeck: Deck = {
            id: generateUUID(),
            name,
            main: [],
            extra: [],
            side: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const newList = [...decks, newDeck];
        saveDecks(newList);
        setActiveDeckId(newDeck.id);
        localStorage.setItem('active_deck_id', newDeck.id);
        showToast('Sucesso', `Deck "${name}" criado!`, 'success');
        return newDeck;
    };

    const updateActiveDeck = (updates: Partial<Deck>) => {
        if (!activeDeckId) return;
        const newList = decks.map(d =>
            d.id === activeDeckId ? { ...d, ...updates, updatedAt: Date.now() } : d
        );
        saveDecks(newList);
    };

    const deleteDeck = (id: string) => {
        const deckToDelete = decks.find(d => d.id === id);
        const newList = decks.filter(d => d.id !== id);
        saveDecks(newList);
        if (activeDeckId === id) {
            const newActiveId = newList.length > 0 ? newList[0].id : null;
            setActiveDeckId(newActiveId);
            if (newActiveId) localStorage.setItem('active_deck_id', newActiveId);
            else localStorage.removeItem('active_deck_id');
        }
        showToast('Deck Excluído', `"${deckToDelete?.name}" foi removido.`);
    };

    const addCardToActive = (card: Card, toastAction?: { label: string, onClick: () => void }) => {
        if (!activeDeck) {
            showToast('Erro', 'Nenhum deck selecionado!', 'error');
            return { success: false };
        }

        const copies = [
            ...activeDeck.main,
            ...activeDeck.extra,
            ...activeDeck.side
        ].filter(c => c.id === card.id).length;

        if (copies >= 3) {
            showToast('Limite Atingido', 'Máximo de 3 cópias por carta.', 'error');
            return { success: false };
        }

        if (isExtraDeckCard(card)) {
            if (activeDeck.extra.length >= 15) {
                showToast('Extra Deck Cheio', 'Máximo 15 cartas atingido.', 'error');
                return { success: false };
            }
            updateActiveDeck({ extra: [...activeDeck.extra, card] });
        } else {
            if (activeDeck.main.length >= 60) {
                showToast('Main Deck Cheio', 'Máximo 60 cartas atingido.', 'error');
                return { success: false };
            }
            updateActiveDeck({ main: [...activeDeck.main, card] });
        }
        showToast('Carta Adicionada', `${card.name} adicionada ao deck.`, 'success', toastAction);
        return { success: true };
    };

    const removeCardFromActive = (cardId: number, zone: 'main' | 'extra' | 'side') => {
        if (!activeDeck) return;
        const list = activeDeck[zone];
        const index = list.findIndex(c => c.id === cardId);
        if (index !== -1) {
            const cardName = list[index].name;
            const newList = [...list];
            newList.splice(index, 1);
            updateActiveDeck({ [zone]: newList });
            showToast('Carta Removida', `${cardName} foi removida.`);
        }
    };

    const changeActiveDeck = (id: string) => {
        setActiveDeckId(id);
        localStorage.setItem('active_deck_id', id);
    }

    return {
        decks,
        activeDeck,
        setActiveDeckId: changeActiveDeck,
        createDeck,
        updateActiveDeck,
        deleteDeck,
        addCardToActive,
        removeCardFromActive,
    };
}
