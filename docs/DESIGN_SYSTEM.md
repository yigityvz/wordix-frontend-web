# Wordix Design System

## Source and implementation rule

Tasarım dili `design/figma/react-reference` ve dark-mode ekran görüntülerinden türetilir. Export yalnızca görsel/component referansıdır; React kodu veya demo davranışları Angular'a kopyalanmaz.

Angular uygulaması production kalitesinde, responsive, erişilebilir ve backend durumlarıyla uyumlu olarak yeniden inşa edilir.

## Visual character

- Premium, modern ve sakin language-learning ürünü
- Ferah grid ve card tabanlı düzen
- Coastal Blues ana paleti
- Yumuşak radius, kontrollü glass yüzey ve soft shadow
- Güçlü typography hiyerarşisi
- Mobile-first responsive davranış
- User ve admin için aynı tasarım ailesi, ayrı shell/navigation

## Coastal Blues palette

```ts
deepSpaceBlue: '#012a4a';
yaleBlueDark: '#013a63';
yaleBlue: '#01497c';
yaleBlueBright: '#014f86';
richCerulean: '#2a6f97';
cerulean: '#2c7da0';
airForceBlue: '#468faf';
steelBlue: '#61a5c2';
skyBlueLight: '#89c2d9';
lightBlue: '#a9d6e5';
```

Componentlerde doğrudan hex kullanılmaz. Palette renkleri Tailwind theme ve semantic tokenlar üzerinden tüketilir. Status, chart ve focus renkleri de tokenlaştırılır.

## Theme modes

Wordix ilk sürümde üç kullanıcı tercihini destekler:

```ts
export type WordixTheme = 'light' | 'dark' | 'system';
```

- Storage key: `wordix-theme`
- `light`: Her zaman light tokenları uygular.
- `dark`: Her zaman dark tokenları uygular.
- `system`: `prefers-color-scheme` değerini izler.
- System tercihi aktifken işletim sistemi tema değişikliği sayfa yenilenmeden uygulanır.
- İlk açılışta kayıtlı tercih yoksa `system` kullanılır.
- Uygulanan görsel tema `html` üzerindeki `dark` classıyla yönetilir.

## Semantic token groups

- Background ve surface
- Border ve focus ring
- Primary/secondary/muted/inverse text
- Brand, accent ve primary button gradient
- Navigation active/hover
- Success, warning, error ve info
- Shadow ve glow
- Radius ve layout dimensions
- Chart series ve tooltip

Canonical active navigation tokenı `nav-active-bg` olacaktır. React referansındaki tanımsız `--nav-active` kullanımı taşınmaz.

## Authentication surface

- Marketing welcome hero kullanılmaz.
- Tek, yüksek kaliteli login/register giriş yüzeyi tasarlanır.
- Sign in ve Create account Keycloak akışlarına yönlendirir.
- Ayrı admin login ekranı bulunmaz.
- Demo flow ve demo role switcher bulunmaz.
- Form alanları Wordix API'ye credential göndermez.

## Shared components

- Button
- Card
- Badge
- Input
- Select
- Textarea
- Modal
- ConfirmDialog
- Drawer
- Toast
- EmptyState
- ErrorState
- Skeleton
- Spinner
- StatCard
- ProgressBar
- ThemeToggle
- RoleBadge

## Component quality rules

- Button: primary, secondary, ghost, danger, success, warning, loading ve disabled
- Input/Select/Textarea: label, helper, validation error ve disabled
- Modal/Dialog: focus trap, Escape close, initial focus ve scroll lock
- Her interactive element: hover, focus-visible, active, disabled ve loading durumu
- Formlar: erişilebilir label ve error association
- Icon-only buttonlar: erişilebilir isim/tooltip
- Table ve chartlar: responsive fallback ve text alternative
- Empty/error/loading durumları: gerçek API stateinden türetilir

## No dead or fake actions

Her buton aşağıdakilerden tam olarak birini yapmalıdır:

- Route navigation
- Modal/drawer açma
- Form submit
- Facade action çağrısı
- Local UI/theme state toggle
- Görünür ve gerçek bir nedenle disabled olma

Backend desteği bekleyen özellikler uygulamada Coming Soon olarak gösterilmez. `docs/DEFERRED_FEATURES.md` içinde tutulur.

Fake successful API call, mock mutation toast, demo navigation ve kullanıcı sahipliği içeren hard-coded veri yasaktır.
