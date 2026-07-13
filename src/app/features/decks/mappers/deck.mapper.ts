/** Bu dosya, deck transport DTO'larını state ve UI için normalize modellere dönüştürür. */
import {
  AddItemToDeckResponseDto,
  CreateDeckResponseDto,
  DeckDetailResponseDto,
  DeckItemResponseDto,
  DeckMeaningResponseDto,
  DeckSentenceTranslationResponseDto,
  DeckSummaryResponseDto,
  GetMyDecksResponseDto,
  RemoveItemFromDeckResponseDto,
} from '../models/deck-api.models';
import {
  AddedDeckItem,
  CreatedDeck,
  DeckCollection,
  DeckDetail,
  DeckItem,
  DeckMeaning,
  DeckSentenceTranslation,
  DeckSummary,
  RemovedDeckItem,
} from '../models/deck.models';

/** Nullable deck listesini boş diziye normalize edip backend total count değerini korur. */
export function mapDeckCollection(dto: GetMyDecksResponseDto): DeckCollection {
  return {
    totalCount: dto.totalCount,
    decks: (dto.decks ?? []).map(mapDeckSummary),
  };
}

/** Ham deck summary DTO'sunu null olmayan name alanlarıyla UI modeline dönüştürür. */
export function mapDeckSummary(dto: DeckSummaryResponseDto): DeckSummary {
  return {
    deckId: dto.deckId,
    name: dto.name ?? '',
    normalizedName: dto.normalizedName ?? '',
    description: dto.description,
    itemCount: dto.itemCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    isActive: dto.isActive,
  };
}

/** Deck detail DTO'sunu nullable item listesini normalize ederek state modeline dönüştürür. */
export function mapDeckDetail(dto: DeckDetailResponseDto): DeckDetail {
  return {
    ...mapDeckSummary(dto),
    items: (dto.items ?? []).map(mapDeckItem),
  };
}

/** Ham deck item DTO'sunu seçili meaning veya sentence translation alanlarıyla dönüştürür. */
export function mapDeckItem(dto: DeckItemResponseDto): DeckItem {
  return {
    deckItemId: dto.deckItemId,
    userLearningItemId: dto.userLearningItemId,
    learningItemId: dto.learningItemId,
    wordId: dto.wordId,
    phraseId: dto.phraseId,
    sentenceId: dto.sentenceId,
    itemType: dto.itemType,
    displayText: dto.displayText,
    normalizedText: dto.normalizedText,
    sourceLanguageCode: dto.sourceLanguageCode,
    selectedMeaning: dto.selectedMeaning ? mapDeckMeaning(dto.selectedMeaning) : null,
    sentenceTranslation: dto.sentenceTranslation
      ? mapDeckSentenceTranslation(dto.sentenceTranslation)
      : null,
    addedAt: dto.addedAt,
  };
}

/** Create response DTO'sunu collection güncellemesinde kullanılacak normalize modele dönüştürür. */
export function mapCreatedDeck(dto: CreateDeckResponseDto): CreatedDeck {
  return {
    deckId: dto.deckId,
    name: dto.name ?? '',
    normalizedName: dto.normalizedName ?? '',
    description: dto.description,
    createdAt: dto.createdAt,
    isActive: dto.isActive,
  };
}

/** Item add response DTO'sunu canonical deck ve dictionary kimliklerini koruyan modele dönüştürür. */
export function mapAddedDeckItem(dto: AddItemToDeckResponseDto): AddedDeckItem {
  return { ...dto };
}

/** Item remove response DTO'sunu backend removed sonucunu koruyan modele dönüştürür. */
export function mapRemovedDeckItem(dto: RemoveItemFromDeckResponseDto): RemovedDeckItem {
  return { ...dto };
}

/** Ham selected meaning DTO'sunu deck görünüm modeline dönüştürür. */
function mapDeckMeaning(dto: DeckMeaningResponseDto): DeckMeaning {
  return { ...dto };
}

/** Ham sentence translation DTO'sunu deck görünüm modeline dönüştürür. */
function mapDeckSentenceTranslation(
  dto: DeckSentenceTranslationResponseDto,
): DeckSentenceTranslation {
  return { ...dto };
}
