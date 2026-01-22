export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface CardPrice {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface Card {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race: string;
  attribute?: string;
  archetype?: string;
  card_sets?: CardSet[];
  card_images: CardImage[];
  card_prices: CardPrice[];
}

export interface Deck {
  id: string;
  name: string;
  main: Card[];
  extra: Card[];
  side: Card[];
  createdAt: number;
  updatedAt: number;
}

// AI Deck Generation Types
export interface AIDeckSuggestion {
  mainDeck: string[];
  extraDeck: string[];
  strategy: string;
  keyCards: string[];
}

export interface DeckGenerationRequest {
  prompt: string;
  deckSize?: 'competitive' | 'casual'; // competitive = 40-45, casual = 45-60
  archetype?: string;
  playstyle?: 'aggro' | 'control' | 'combo' | 'midrange' | 'any';
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  format?: 'TCG' | 'OCG' | 'Master Duel' | 'Edison';
  includeCards?: string[];
  excludeCards?: string[];
}

export interface DeckGenerationResponse {
  suggestion: AIDeckSuggestion;
  cards: {
    main: Card[];
    extra: Card[];
  };
  notFound: string[];
}

