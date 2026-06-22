# Zadanie rekrutacyjne - Cosibella

**Live demo:** [adam1ak.github.io/coisbella-task](https://adam1ak.github.io/coisbella-task/)

Aplikacja katalogu produktów stworzona w czystym JavaScript (Vanilla JS ES6+) z modularną architekturą Sass. Pobiera dane z API i wyświetla je w interaktywnej siatce z filtrami, sortowaniem, paginacją i synchronizacją stanu przez URL.

---

## Uruchomienie projektu

### Wymagania
- Node.js ≥ 18
- npm ≥ 9

### Instalacja i uruchomienie

```bash
# 1. Sklonuj repozytorium
git clone https://github.com/adam1ak/coisbella-task.git

# 2. Przejdź do katalogu projektu
cd coisbella-task

# 3. Zainstaluj zależności
npm install

# 4. Uruchom serwer deweloperski
npm run dev
```

Aplikacja będzie dostępna pod adresem wyświetlonym w terminalu (domyślnie `http://localhost:5173`).

### Build produkcyjny

```bash
npm run build
npm run preview
```

---

## Struktura plików

```
cosibella-task/
├── index.html                      # Główny plik HTML (semantyczny, accessible)
├── package.json                    # Zależności: vite, sass (devDependencies only)
│
├── src/
│   ├── main.js                     # Entry point - inicjalizacja aplikacji
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── api.js              # Fetch danych z API
│   │   │   ├── state.js            # Scentralizowany stan (Single Source of Truth)
│   │   │   └── events.js           # Logika filtrów, sortowania, event listeners
│   │   │
│   │   ├── components/
│   │   │   ├── products.js         # Renderowanie kart produktów
│   │   │   ├── categories.js       # Dynamiczne generowanie kategorii (select)
│   │   │   ├── pagination.js       # Paginacja z nawigacją prev/next
│   │   │   └── modal.js            # Modal szczegółów produktu
│   │   │
│   │   └── utils/
│   │       ├── url.js              # Synchronizacja stanu ↔ URL (deep-linking)
│   │       └── utils.js            # Debounce, formatowanie cen (Intl API)
│   │
│   └── scss/
│       ├── main.scss               # Punkt wejścia SCSS (@use modules)
│       ├── _variables.scss         # Design tokens: kolory, fonty, radii, transitions
│       ├── _layout.scss            # Layout strony, header, footer, responsive
│       │
│       └── components/
│           ├── _cards.scss         # Karty produktów (grid, hover, focus)
│           ├── _filters.scss       # Filtry: select, input, reset
│           ├── _modal.scss         # Modal: glassmorphism, animacje
│           ├── _pagination.scss    # Paginacja
│           ├── _status.scss        # Loader, error, no-results
│           └── _stock.scss         # Komponent statusu dostępności
│
└── .gitignore
```

---

## Funkcjonalności

- **Siatka produktów** - responsywny CSS Grid z kartami zawierającymi ID, nazwę, kategorię, cenę i status dostępności
- **Filtrowanie** - po kategorii (dynamiczny select) oraz zakresie cenowym (inputy z debounce 300ms)
- **Sortowanie** - alfabetycznie (A-Z / Z-A z `localeCompare("pl")`), po cenie i dostępności
- **Paginacja** - 5 elementów na stronę, nawigacja prev/next z podświetleniem aktywnej strony
- **Deep-linking** - pełna synchronizacja filtrów, strony i otwartego modalu z URL przez `History API`
- **Walidacja URL** - graceful degradation przy nieprawidłowych parametrach (np. nieistniejący `productId`)
- **Modal szczegółów** - animowany z efektem glassmorphism (`backdrop-filter: blur`), opis, tagi, cena, dostępność
- **Stany UX** - spinner ładowania, komunikat `[SERVER_ERROR]` przy błędzie API, informacja o braku wyników
- **Accessibility** - `role="dialog"`, `aria-modal`, `aria-hidden`, `aria-live="polite"`, `.sr-only`, semantyczny HTML

---

## Stack techniczny

| Warstwa | Technologia |
|---------|-------------|
| **JavaScript** | Vanilla JS (ES6+ modules) - zero runtime dependencies |
| **CSS** | Dart Sass - moduły `@use`, zmienne, nesting, partials, BEM |
| **Bundler** | Vite - dev server + build produkcyjny |
| **Fonty** | Space Grotesk + IBM Plex Mono (Google Fonts) |

---

## Dane zgłoszeniowe

- **Imię i nazwisko:** Filip Adamiak
- **E-mail:** [f.admiakk@gmail.com](mailto:f.admiakk@gmail.com)
- **GitHub:** [adam1ak](https://github.com/adam1ak)