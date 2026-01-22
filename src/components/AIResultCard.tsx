'use client';

import { Card } from '@/types';
import { motion } from 'framer-motion';

interface AIResultCardProps {
    card: Card;
    index: number;
}

export default function AIResultCard({ card, index }: AIResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.03, rotate: 0.2 }}
            className="group relative rounded-lg overflow-hidden border border-white-10 ring-white-10 hover-ring-accent transition-all shadow-card hover-shadow-card block"
            style={{ aspectRatio: '2/3' }}
        >
            <img
                src={card.card_images[0].image_url}
                alt={card.name}
                className="w-full h-full block transition-transform group-hover-scale-106"
                style={{ objectFit: 'cover' }}
            />
            <div className="absolute inset-0 bg-gradient-top opacity-0 group-hover-opacity-100 transition-opacity flex flex-col justify-end p-3" style={{ backdropFilter: 'blur(2px)' }}>
                <p className="text-xs uppercase tracking-wider text-accent font-bold mb-1" style={{ fontSize: '10px' }}>{card.type}</p>
                <h4 className="text-sm font-bold leading-tight line-clamp-2">{card.name}</h4>
            </div>
        </motion.div>
    );
}