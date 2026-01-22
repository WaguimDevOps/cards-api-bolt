import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIDeckSuggestion, DeckGenerationRequest, DeckGenerationResponse, Card } from '@/types';
import { fetchCards } from './api';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_NAME = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Generate a Yu-Gi-Oh! deck using AI based on user's description
 */
export async function generateDeckWithAI(request: DeckGenerationRequest): Promise<DeckGenerationResponse> {
    if (!API_KEY) {
        throw new Error('API Key não configurada. Adicione NEXT_PUBLIC_GEMINI_API_KEY no arquivo .env.local');
    }

    const deckSize = request.deckSize === 'competitive' ? '40-45' : '45-60';
    const archetype = request.archetype ? `Arquétipo Foco: ${request.archetype}` : '';
    const playstyle = request.playstyle && request.playstyle !== 'any' ? `Estilo de Jogo: ${request.playstyle}` : '';
    const complexity = request.complexity ? `Nível de Complexidade: ${request.complexity}` : '';
    const format = request.format ? `Formato: ${request.format}` : 'TCG';
    const include = request.includeCards && request.includeCards.length > 0 ? `Obrigatório incluir estas cartas: ${request.includeCards.join(', ')}` : '';
    const exclude = request.excludeCards && request.excludeCards.length > 0 ? `NÃO inclua estas cartas: ${request.excludeCards.join(', ')}` : '';

    const prompt = `Você é um especialista MASTER em Yu-Gi-Oh! TCG e formatos relacionados.
Crie um deck baseado nesta descrição: "${request.prompt}"

PARÂMETROS TÉCNICOS:
- Formato: ${format}
- ${playstyle}
- ${complexity}
- ${include}
- ${exclude}

REGRAS DE CONSTRUÇÃO:
- Main Deck: ${deckSize} cartas (priorize consistência)
- Extra Deck: 0-15 cartas (apenas Fusion, Synchro, Xyz, Link)
- Máximo 3 cópias de qualquer carta
- Respeite rigorosamente a banlist atual do formato ${format}
- Priorize sinergia absoluta entre as cartas

IMPORTANTE: Retorne APENAS um objeto JSON válido, sem texto adicional:
{
  "mainDeck": ["Nome Exato da Carta 1", "Nome Exato da Carta 2", ...],
  "extraDeck": ["Monstro Fusion 1", "Monstro Xyz 1", ...],
  "strategy": "Explicação detalhada da estratégia e combos principais (3-4 frases)",
  "keyCards": ["Carta Chave 1", "Carta Chave 2", "Carta Chave 3"]
}

LEMBRE-SE: Use nomes EXATOS das cartas em inglês.`;

    try {
        // Generate content with AI
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse JSON response
        let suggestion: AIDeckSuggestion;
        try {
            // Remove markdown code blocks if present
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            suggestion = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new Error('A IA retornou uma resposta inválida. Tente novamente.');
        }

        // Validate the response structure
        if (!suggestion.mainDeck || !Array.isArray(suggestion.mainDeck)) {
            throw new Error('Resposta da IA está incompleta. Tente novamente.');
        }

        // Fetch actual cards from YGOProDeck API
        const mainCards: Card[] = [];
        const extraCards: Card[] = [];
        const notFound: string[] = [];

        // Helper function to search for a card by name
        async function findCard(cardName: string): Promise<Card | null> {
            try {
                const { data } = await fetchCards({ fname: cardName });
                if (data.length === 0) return null;

                // Try to find exact match first
                const exactMatch = data.find(c => c.name.toLowerCase() === cardName.toLowerCase());
                if (exactMatch) return exactMatch;

                // Otherwise return first result (fuzzy match)
                return data[0];
            } catch (error) {
                console.error(`Error fetching card: ${cardName}`, error);
                return null;
            }
        }

        // Fetch main deck cards
        for (const cardName of suggestion.mainDeck) {
            const card = await findCard(cardName);
            if (card) {
                mainCards.push(card);
            } else {
                notFound.push(cardName);
            }
        }

        // Fetch extra deck cards
        if (suggestion.extraDeck && Array.isArray(suggestion.extraDeck)) {
            for (const cardName of suggestion.extraDeck) {
                const card = await findCard(cardName);
                if (card) {
                    extraCards.push(card);
                } else {
                    notFound.push(cardName);
                }
            }
        }

        return {
            suggestion,
            cards: {
                main: mainCards,
                extra: extraCards
            },
            notFound
        };

    } catch (error: any) {
        console.error('AI Deck Generation Error:', error);

        if (error.message?.includes('API_KEY_INVALID')) {
            throw new Error('Chave API inválida. Verifique sua configuração.');
        }

        if (error.message?.includes('RATE_LIMIT')) {
            throw new Error('Limite de requisições atingido. Aguarde um momento e tente novamente.');
        }

        throw error;
    }
}
