'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/types';
import { fetchCards } from '@/services/api';
import { CardModal } from '@/components/CardModal';
import { Search, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight, Eye, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 40;

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [attribute, setAttribute] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState<'new' | 'old'>('new');
  const [showFilters, setShowFilters] = useState(false);

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        num: pageSize.toString(),
        offset: (page * pageSize).toString(),
      };

      if (search) params.fname = search;
      if (type) params.type = type;
      if (attribute) params.attribute = attribute;
      if (level) params.level = level;
      params.sort = sort;

      const { data, total: totalCards } = await fetchCards(params);
      setCards(data);
      setTotal(totalCards);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, type, attribute, level]);

  useEffect(() => {
    loadData();
  }, [page, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadData();
  };

  const resetFilters = () => {
    setSearch('');
    setType('');
    setAttribute('');
    setLevel('');
    setPage(0);
    loadData();
  };

  const openCardDetails = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  return (
    <main style={{ maxWidth: '1800px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ marginBottom: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.5rem 1rem',
          borderRadius: '99px',
          border: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: 'var(--accent)' }}>⚡</span>
          <span>{total.toLocaleString()} Cards Available</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '4.5rem', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.5rem', maxWidth: '800px' }}>
          Explore the <span style={{ color: 'var(--accent-secondary)' }}>Yu-Gi-Oh!</span><br />
          Card Database
        </h1>

        <p style={{ opacity: 0.6, fontSize: '1.1rem', maxWidth: '600px', marginBottom: '2.5rem' }}>
          Discover thousands of cards from every set. Search, filter, and find the perfect cards for your deck.
        </p>

        {/* Action Button */}
        <a
          href="/deck-builder"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 1.5rem',
            borderRadius: '99px',
            border: '1px solid var(--accent-secondary)',
            color: 'var(--accent-secondary)',
            fontWeight: 600,
            marginBottom: '4rem',
            textDecoration: 'none',
            transition: '0.2s'
          }}
        >
          <RefreshCcw size={16} /> Open Deck Builder &rarr;
        </a>

        {/* Centered Search Bar */}
        <div style={{ maxWidth: '700px', width: '100%', position: 'relative' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--glass-bg)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--accent-secondary)' }}>
            <Search size={22} style={{ marginLeft: '1rem', opacity: 0.5 }} />
            <input
              type="text"
              placeholder="Search for any card by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', padding: '1rem', fontSize: '1rem', background: 'transparent' }}
            />
            <button type="submit" className="primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px' }}>
              Search
            </button>
          </form>
        </div>
      </header>

      {loading ? (
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--accent)', borderRadius: '50%' }}
            />
            <p style={{ opacity: 0.5 }}>Invocando cartas...</p>
          </div>
        </div>
      ) : (
        <section>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '1rem'
          }}

          >
            {cards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', position: 'relative', border: '1px solid transparent', transition: 'all 0.2s' }}
                whileHover={{ y: -5, borderColor: 'var(--accent-secondary)', boxShadow: '0 10px 30px -10px rgba(212, 175, 55, 0.3)' }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={card.card_images[0].image_url}
                    alt={card.name}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(2px)',
                      transition: '0.2s'
                    }}
                  >
                    <button
                      className="primary"
                      onClick={() => openCardDetails(card)}
                      style={{ gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
                    >
                      <Eye size={16} /> Ver Detalhes
                    </button>
                  </motion.div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {card.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p style={{
                      fontSize: '0.8rem',
                      color: card.type.includes('Monster') ? 'var(--monster-color)' :
                        card.type.includes('Spell') ? 'var(--spell-color)' : 'var(--trap-color)',
                      fontWeight: '700'
                    }}>
                      {card.type.replace(' Card', '').toUpperCase()}
                    </p>
                    {card.level && <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>★{card.level}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {!loading && cards.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
              <p>Nenhuma carta encontrada para esses critérios.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-20 mb-20">
            {/* First Page Button */}
            <button
              className="glass"
              disabled={page === 0}
              onClick={() => { setPage(0); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                opacity: page === 1 ? 1 : 1,
                fontSize: '1.2rem',
                color: 'white'
              }}
            >
              «
            </button>

            {/* Previous Page Button */}
            <button
              className="glass"
              disabled={page === 0}
              onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                opacity: page === 1 ? 1 : 1,
                fontSize: '1.2rem',
                color: 'white'
              }}
            >
              ‹
            </button>

            {/* Page Numbers */}
            {(() => {
              const totalPages = Math.ceil(total / pageSize);
              const pageNumbers = [];

              // Always show first page
              pageNumbers.push(0);

              // Show pages around current page
              if (page > 2) pageNumbers.push('...');

              for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
                if (i > 0 && i < totalPages - 1) pageNumbers.push(i);
              }

              // Show ellipsis before last page if needed
              if (page < totalPages - 3) pageNumbers.push('...');

              // Always show last page
              if (totalPages > 1) pageNumbers.push(totalPages - 1);

              return pageNumbers.map((num, idx) => {
                if (num === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} style={{ padding: '0 0.5rem', opacity: 0.4 }}>
                      ...
                    </span>
                  );
                }

                const pageNum = num as number;
                const isActive = pageNum === page;

                return (
                  <button
                    key={pageNum}
                    onClick={() => { setPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--accent)' : 'transparent',
                      color: isActive ? '#000' : 'var(--text-primary)',
                      fontWeight: isActive ? 'bold' : 'normal',
                      border: isActive ? 'none' : '1px solid var(--glass-border)',
                      fontSize: '0.95rem'
                    }}
                  >
                    {pageNum + 1}
                  </button>
                );
              });
            })()}

            {/* Next Page Button */}
            <button
              className="glass"
              disabled={cards.length < pageSize}
              onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                opacity: cards.length < pageSize ? 0.3 : 1,
                fontSize: '1.2rem',
                color: 'white'
              }}
            >
              ›
            </button>

            {/* Last Page Button */}
            <button
              className="glass"
              disabled={cards.length < pageSize}
              onClick={() => {
                const lastPage = Math.ceil(total / pageSize) - 1;
                setPage(lastPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                opacity: cards.length < pageSize ? 0.3 : 1,
                fontSize: '1.2rem',
                color: 'white'
              }}
            >
              »
            </button>
          </div>
        </section>
      )}

      <CardModal
        card={selectedCard}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </main>
  );
}
