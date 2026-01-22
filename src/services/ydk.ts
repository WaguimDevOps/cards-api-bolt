import { Deck } from '@/types';

export function exportToYDK(deck: Deck): string {
    let ydk = '#created by Yu-Gi-Oh! Deck Builder\n';

    ydk += '#main\n';
    deck.main.forEach(card => {
        ydk += `${card.id}\n`;
    });

    ydk += '#extra\n';
    deck.extra.forEach(card => {
        ydk += `${card.id}\n`;
    });

    ydk += '!side\n';
    deck.side.forEach(card => {
        ydk += `${card.id}\n`;
    });

    return ydk;
}

export function downloadYDK(deck: Deck) {
    const content = exportToYDK(deck);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${deck.name.replace(/\s+/g, '_')}.ydk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
