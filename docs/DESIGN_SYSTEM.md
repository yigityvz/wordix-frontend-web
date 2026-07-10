# Wordix Design System

## Source

The design is based on `design/figma/react-reference` and screenshots.

## Theme

Wordix supports light mode and dark mode.

Theme preference must be stored in localStorage.

## Visual style

- premium
- modern
- clean
- calm
- language-learning focused
- responsive
- high quality portfolio-ready UI

## Coastal Blues palette

```ts
deepSpaceBlue: '#012a4a'
yaleBlueDark: '#013a63'
yaleBlue: '#01497c'
yaleBlueBright: '#014f86'
richCerulean: '#2a6f97'
cerulean: '#2c7da0'
airForceBlue: '#468faf'
steelBlue: '#61a5c2'
skyBlueLight: '#89c2d9'
lightBlue: '#a9d6e5'


Shared components
Button
Card
Badge
Input
Select
Modal
Toast
EmptyState
ErrorState
Skeleton
Spinner
StatCard
ProgressBar
ThemeToggle
RoleBadge
Button rule

No dead buttons.

Every button must:

navigate
open modal
submit form
call facade action
toggle state/theme
be disabled with a visible reason
show Coming Soon label