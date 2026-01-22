import { Card } from '@/types';

const BASE_URL = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export async function fetchCards(params: Record<string, string> = {}): Promise<{ data: Card[], total: number }> {
    const queryParams = new URLSearchParams(params);

    // Default pagination if not provided
    if (!queryParams.has('num')) queryParams.append('num', '50');
    if (!queryParams.has('offset')) queryParams.append('offset', '0');

    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);

    if (!response.ok) {
        if (response.status === 400) return { data: [], total: 0 };
        throw new Error('Failed to fetch cards');
    }

    const data = await response.json();

    // The API doesn't return total count in the same way for every endpoint.
    // For basic search, it just returns the array.
    // We'll estimate or just return the data length for now, 
    // but usually we'd need a separate call for total if we wanted meta-info.
    return {
        data: data.data,
        total: data.meta?.total_rows || data.data.length
    };
}

export async function getCardById(id: string): Promise<Card | null> {
    const response = await fetch(`${BASE_URL}?id=${id}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.data[0];
}
