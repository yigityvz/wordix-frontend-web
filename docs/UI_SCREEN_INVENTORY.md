# Wordix UI Screen Inventory

## Login / Landing

Route: `/`

Actions:

- Login with Keycloak
- Toggle theme
- Learn more / scroll preview

## Auth Callback

Route: `/auth/callback`

Behavior:

- handle Keycloak callback
- call `/api/profile/me`
- admin -> `/admin/dashboard`
- basic_user -> `/dashboard`

## User Dashboard

Route: `/dashboard`

Actions:

- search -> `/lookup`
- dictionary -> `/dictionary`
- decks -> `/decks`
- quiz -> `/quizzes/start`
- statistics -> `/statistics`

## Lookup

Route: `/lookup`

Backend:

```text
POST /api/lookups

Actions:

Search
Save to dictionary
Clear search
Open saved item
Dictionary List

Route: /dictionary

Backend:

GET /api/user-dictionary/me

Actions:

Open detail
Filter/search
Add to deck
Toggle favorite/difficult
Start quiz
Dictionary Detail

Route: /dictionary/:userLearningItemId

Actions:

create/edit/delete note
toggle favorite/difficult
add to deck
start practice
Decks

Routes:

/decks
/decks/:deckId

Actions:

create deck
add/remove item
start deck quiz
Quiz

Routes:

/quizzes/start
/quizzes/:quizSessionId/play
/quizzes/:quizSessionId/summary

Actions:

configure quiz
answer question
view summary
save recommended item
Statistics

Route: /statistics

Actions:

learning summary
quiz stats
difficult items
deck stats
confidence distribution
Admin Dashboard

Route: /admin/dashboard

Role: admin

Actions:

top lookups
most saved
provider/import stats
quiz analytics
Profile / Settings

Routes:

/profile
/settings

Actions:

view token info
toggle theme
logout