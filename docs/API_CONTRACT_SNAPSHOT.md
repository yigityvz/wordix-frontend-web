# Wordix API Contract Snapshot

Snapshot tarihi: 2026-07-13

Kaynak: `http://localhost:5000/swagger/v1/swagger.json`

API title/version: Wordix API / v1

Security scheme: Bearer JWT

Doğrulanan canlı kapsam: 36 path, 41 HTTP operasyonu ve 112 component schema.

Bu dosya frontend planlama snapshotıdır. Her API fazında canlı Swagger yeniden kontrol edilir; bu belge canlı sözleşmenin yerine geçmez.

## Global contract

Başarılı response modelleri genel olarak `ApiResponse<T>` wrapperı içindedir. Hata response modeli `ErrorResponse` olarak tanımlıdır. Liste/pagination gerektiren bazı sonuçlar `PagedResult<T>` ile sarılır.

Canlı Swagger'a göre ortak başarılı response alanları:

```text
success: boolean
message: string | null
data: T
timestamp: date-time string
```

`ErrorResponse` alanları:

```text
success: boolean
statusCode: integer
errorCode: string | null
message: string | null
detail: string | null
traceId: string | null
validationErrors: ValidationError[] | null
timestamp: date-time string
```

Her `ValidationError`, nullable `propertyName`, `errorMessage` ve `errorCode` alanlarını taşır. Sayfalanmış sonuçlar `items`, `pageNumber`, `pageSize`, `totalCount`, `totalPages`, `hasPreviousPage` ve `hasNextPage` alanlarını kullanır.

Frontend ortak HTTP katmanı şu durumları normalize eder:

| Status | Frontend davranışı                    |
| ------ | ------------------------------------- |
| 400    | Validation/business error mapping     |
| 401    | Session/authentication recovery       |
| 403    | Forbidden state veya route            |
| 404    | Feature not-found state               |
| 500    | Generic server error, güvenli loglama |

Tüm protected requestler access token taşır. Frontend ownership için `userId`, `keycloakUserId`, `userProfileId` veya `ownerId` göndermez.

## Profile

| Method | Path              | Response payload          |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/profile/me` | `CurrentUserInfoResponse` |

`CurrentUserInfoResponse` alanları:

```text
isAuthenticated
keycloakUserId
email
username
roles[]
```

`keycloakUserId` backend responseunda bulunsa da UI'da gösterilmez ve ownership requestine dönüştürülmez.

## Lookup

| Method | Path           | Request         | Response payload |
| ------ | -------------- | --------------- | ---------------- |
| POST   | `/api/lookups` | `LookupRequest` | `LookupResponse` |

`LookupRequest`:

```text
text
sourceLanguageCode
targetLanguageCode
```

`LookupResponse` frontend akışında gerekli şu alanları içerir:

```text
learningItemId
wordId / phraseId / sentenceId
lookupHistoryId
text / normalizedText
itemType
sourceLanguageCode / targetLanguageCode
lookupSource / contentSource / sourceType
isAlreadyInUserDictionary
meanings[]
sentenceTranslations[]
```

Her meaning `meaningId`, translation, definition, example, part-of-speech ve source bilgisi taşıyabilir.

## User Dictionary

| Method | Path                             | Request                           | Response payload                   |
| ------ | -------------------------------- | --------------------------------- | ---------------------------------- |
| GET    | `/api/user-dictionary`           | —                                 | `GetMyDictionaryResponse`          |
| POST   | `/api/user-dictionary`           | `SaveLearningItemRequest`         | `SaveLearningItemResponse`         |
| POST   | `/api/user-dictionary/sentences` | `SaveSentenceToDictionaryRequest` | `SaveSentenceToDictionaryResponse` |
| GET    | `/api/user-dictionary/{id}`      | path `id`                         | `UserDictionaryItemResponse`       |

`SaveLearningItemRequest`:

```text
learningItemId
selectedMeaningId
sourceLookupHistoryId
```

`SaveSentenceToDictionaryRequest`:

```text
sourceText
translatedText
sourceLanguageCode
targetLanguageCode
sourceLookupHistoryId
```

Frontend için canonical dictionary identifier `userLearningItemId` alanıdır. Dictionary response ayrıca selected meaning/translation, learning status, confidence, flags, note count ve active state içerir.

Contract gap: ürün hedefi word/phrase sonucunu bütün anlamlarıyla kaydetmektir; mevcut request tek `selectedMeaningId` taşır. Backend sözleşmesi değişmeden bütün anlamlar kaydedilmiş gibi davranılmaz.

## Notes

| Method | Path                                              | Request                         | Response payload               |
| ------ | ------------------------------------------------- | ------------------------------- | ------------------------------ |
| GET    | `/api/user-dictionary/{userLearningItemId}/notes` | —                               | `GetUserLearningNotesResponse` |
| POST   | `/api/user-dictionary/{userLearningItemId}/notes` | `CreateUserLearningNoteRequest` | `UserLearningNoteResponse`     |
| PUT    | `/api/user-dictionary/notes/{noteId}`             | `UpdateUserLearningNoteRequest` | `UserLearningNoteResponse`     |
| DELETE | `/api/user-dictionary/notes/{noteId}`             | —                               | `UserLearningNoteResponse`     |

Create/update request alanı `noteText`tir.

## Flags

| Method | Path                                                         | Request                      | Response payload               |
| ------ | ------------------------------------------------------------ | ---------------------------- | ------------------------------ |
| GET    | `/api/user-dictionary/{userLearningItemId}/flags`            | —                            | `GetUserLearningFlagsResponse` |
| POST   | `/api/user-dictionary/{userLearningItemId}/flags`            | `SetUserLearningFlagRequest` | `UserLearningFlagResponse`     |
| DELETE | `/api/user-dictionary/{userLearningItemId}/flags/{flagType}` | —                            | `UserLearningFlagResponse`     |

`SetUserLearningFlagRequest` alanı `flagType`tir. Desteklenen flag değerleri backend enum/sözleşmesinden doğrulanmalıdır.

## Decks

| Method | Path                                             | Request                | Response payload             |
| ------ | ------------------------------------------------ | ---------------------- | ---------------------------- |
| GET    | `/api/decks`                                     | —                      | `GetMyDecksResponse`         |
| POST   | `/api/decks`                                     | `CreateDeckRequest`    | `CreateDeckResponse`         |
| GET    | `/api/decks/{id}`                                | path `id`              | `DeckDetailResponse`         |
| POST   | `/api/decks/{deckId}/items`                      | `AddItemToDeckRequest` | `AddItemToDeckResponse`      |
| DELETE | `/api/decks/{deckId}/items/{userLearningItemId}` | —                      | `RemoveItemFromDeckResponse` |

Requests:

```text
CreateDeckRequest: name, description
AddItemToDeckRequest: userLearningItemId
```

Deck update/delete endpointi yoktur. Lookup sonucundan deck'e ekleme için önce dictionary save tamamlanmalı ve `userLearningItemId` elde edilmelidir.

## Quizzes

| Method | Path                                                                         | Request                   | Response payload                          |
| ------ | ---------------------------------------------------------------------------- | ------------------------- | ----------------------------------------- |
| POST   | `/api/quizzes`                                                               | `StartQuizRequest`        | `StartQuizResponse`                       |
| POST   | `/api/quizzes/{quizSessionId}/answers`                                       | `SubmitQuizAnswerRequest` | `SubmitQuizAnswerResponse`                |
| GET    | `/api/quizzes/{quizSessionId}/summary`                                       | —                         | `QuizSummaryResponse`                     |
| POST   | `/api/quizzes/recommendations/{quizRecommendationItemId}/save-to-dictionary` | —                         | `SaveRecommendedItemToDictionaryResponse` |

`StartQuizRequest`:

```text
quizType
quizSourceType
quizContentMode
questionCount
deckId
includeSystemRecommendations
```

`difficulty` alanı mevcut değildir ve frontend formunda gösterilmez.

`SubmitQuizAnswerRequest`:

```text
quizQuestionId
selectedQuizOptionId
userAnswer
questionResponseTimeInMilliseconds
```

Answer response doğruluk, doğru cevap, progress/confidence değişimi, next review ve recommendation bilgisini içerir. Frontend doğruluğu kendi hesaplamaz.

Summary response total/answered/unanswered, correct/wrong, accuracy, completion, response-time ve question breakdown alanlarını içerir.

Contract gap: aktif quiz browser tarafından kapatıldığında unanswered soruların server-side finalization davranışı tanımlı değildir.

## User Statistics

| Method | Path                                           | Query                                                                                  |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| GET    | `/api/user-statistics/learning-summary`        | —                                                                                      |
| GET    | `/api/user-statistics/quizzes`                 | `FromUtc`, `ToUtc`, `QuizType`, `QuizSourceType`, `QuizContentMode`, `DifficultyGroup` |
| GET    | `/api/user-statistics/difficult-items`         | `PageNumber`, `PageSize`, `Source`, `SortBy`, `ItemType`, `LearningStatus`             |
| GET    | `/api/user-statistics/decks`                   | —                                                                                      |
| GET    | `/api/user-statistics/confidence-distribution` | —                                                                                      |

Dashboard ve statistics ekranları bu endpointleri kullanır. Streak alanı mevcut sözleşmede yoktur.

## Admin Analytics

Tüm endpointler admin backend authorization ve frontend RoleGuard gerektirir.

| Method | Path                                  | Query                       | Response payload                          |
| ------ | ------------------------------------- | --------------------------- | ----------------------------------------- |
| GET    | `/api/admin/analytics/dashboard`      | `FromUtc`, `ToUtc`          | `AdminDashboardAnalyticsResponse`         |
| GET    | `/api/admin/analytics/top-searches`   | `FromUtc`, `ToUtc`, `Limit` | `TopSearchesAnalyticsResponse`            |
| GET    | `/api/admin/analytics/top-saved`      | `FromUtc`, `ToUtc`, `Limit` | `TopSavedLearningItemsAnalyticsResponse`  |
| GET    | `/api/admin/analytics/most-wrong`     | `FromUtc`, `ToUtc`, `Limit` | `MostWrongLearningItemsAnalyticsResponse` |
| GET    | `/api/admin/analytics/provider-stats` | `FromUtc`, `ToUtc`          | `ProviderStatsAnalyticsResponse`          |

Desteklenen frontend admin ekranları yalnızca bu aggregate analytics verilerini kullanır.

## Import endpoints

Swagger içinde aşağıdaki admin operasyon endpointleri vardır:

```text
POST /api/imports/cefr-words
POST /api/imports/meanings/kaikki/parse-test
POST /api/imports/meanings/kaikki/enrich
POST /api/imports/translations/azure/test
POST /api/imports/phrases/provider-create-test
POST /api/imports/examples/tatoeba/parse-test
POST /api/imports/examples/tatoeba/enrich
POST /api/imports/meanings/freedict/enrich
POST /api/imports/meanings/missing/azure-backfill
```

Bunlar doğrudan operasyon başlatan endpointlerdir. Figma'daki import job listesi, raw log, progress ve retry UI'ları için gerekli read/retry sözleşmesi bulunmadığından frontend kapsamına alınmaz ve admin navigation'a eklenmez.

## Bilinen sözleşme farkları

Canonical gerçek route'lar:

```text
GET  /api/user-dictionary
POST /api/quizzes
POST /api/quizzes/recommendations/{quizRecommendationItemId}/save-to-dictionary
GET  /api/decks/{id}
```

Eski planlarda geçen aşağıdaki varyasyonlar kullanılmaz:

```text
/api/user-dictionary/me
/api/quizzes/start
/api/quizzes/recommendations/{id}/save
/api/decks/{deckId} detail route adı
```

## Backend bekleyen frontend gereksinimleri

- Bütün meaningleri tek dictionary save ile ilişkilendirme
- Quiz abandonment/timeout finalization
- Quiz difficulty request alanı
- Deck update/delete
- Notifications ve preferences
- Item quiz history
- Admin users/system-health analytics
- Analytics export
