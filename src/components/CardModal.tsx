'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, ExternalLink } from 'lucide-react';
import { Card } from '@/types';
import { useDeck } from '@/hooks/useDeck';
import { useRouter } from 'next/navigation';

interface CardModalProps {
    card: Card | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardModal({ card, open, onOpenChange }: CardModalProps) {
    const { addCardToActive } = useDeck();
    const router = useRouter();

    if (!card) return null;

    const handleAddToDeck = () => {
        addCardToActive(card, {
            label: 'Ir para o Builder',
            onClick: () => router.push('/deck-builder')
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    position: 'fixed',
                    inset: 0,
                    zIndex: 500,
                    backdropFilter: 'blur(4px)'
                }} />
                <Dialog.Content className="glass" style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90vw',
                    maxWidth: '800px',
                    maxHeight: '85vh',
                    padding: '2rem',
                    borderRadius: '24px',
                    zIndex: 501,
                    overflowY: 'auto',
                    display: 'flex',
                    gap: '2rem'
                }}>
                    <div className="flex-shrink-0">
                        <img
                            src={card.card_images[0].image_url}
                            alt={card.name}
                            style={{
                                width: '280px',
                                height: 'auto',
                                borderRadius: '12px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <Dialog.Title style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '0.25rem' }}>
                                {card.name}
                            </Dialog.Title>
                            <div className="flex gap-2" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                                <span>{card.type}</span>
                                {card.race && <>| <span>{card.race}</span></>}
                                {card.attribute && <>| <span>{card.attribute}</span></>}
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            {card.level && (
                                <div className="glass" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'var(--accent)', fontWeight: 'bold' }}>
                                    ★ {card.level}
                                </div>
                            )}
                            {card.atk !== undefined && (
                                <div className="glass" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                    ATK {card.atk} / DEF {card.def}
                                </div>
                            )}
                        </div>

                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            lineHeight: '1.6',
                            fontSize: '1rem',
                            border: '1px solid var(--glass-border)',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}>
                            {card.desc}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                            <button className="primary" onClick={handleAddToDeck} style={{ flex: 1, gap: '0.5rem' }}>
                                <Plus size={20} /> Adicionar ao Deck
                            </button>
                            <Dialog.Close asChild>
                                <button className="glass" style={{ flex: 1 }}>Fechar</button>
                            </Dialog.Close>
                        </div>
                    </div>

                    <Dialog.Close asChild>
                        <button style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.5
                        }}>
                            <X size={24} />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
