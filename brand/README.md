# brand

**Règle d'usage (10 septembre):** le chapeau seul sert au favicon et aux icônes, rien d'autre. Le lockup avec le chapeau est réservé au jeu Moon Rodeo (écran d'accueil, page du jeu). La 404 garde son chapeau à la dérive, c'est l'exception voulue. Le reste du site, les mails, les cartes de partage et tout autre support utilisent le wordmark seul (`moonx-wordmark-blanka.svg`, le MOONX de la nav).

Généré par `python3 tools/make_brand.py`. Le chapeau est dessiné en courbes (pas tracé depuis le PNG): bandeau bleu de l'ancien logo, badge marine à liseré, et dans le badge la fusée pixel du site elle-même (celle qui traverse le ciel de la home, mêmes rectangles, mêmes couleurs). Le wordmark est vectorisé depuis `brand-src/moonx-logo.png` (l'ancien logo, garde hors du dossier servi).

    svg/moonx-hat.svg                 le chapeau seul dans un carré, fond transparent (figé le 9 septembre)
    svg/moonx-hat-wide.svg            le chapeau seul dans sa boîte 1000x520 (pour l'inline dans une page)
    svg/moonx-favicon.svg             variante à bord court, non utilisée: le favicon est le chapeau entier
    svg/moonx-wordmark.svg            MOONX, lettrage de l'ancien logo (tracé)
    svg/moonx-wordmark-blanka.svg     MOONX en Blanka, la fonte du site, en tracés (celui de la nav et du footer)
    svg/moonx-logo.svg                lockup vertical: chapeau au-dessus de MOONX (celui du jeu)
    svg/moonx-logo-horizontal.svg     lockup horizontal: chapeau à gauche de MOONX en Blanka
    svg/*-dark.svg                    les mêmes sur carré sombre #03050C à coins arrondis
    png/<marque>-<variante>-<taille>.png
        chapeau: 16 32 48 64 96 128 180 192 256 384 512 1024 (carré); favicon-16/32/48/64
        wordmark et logo: largeurs 512 1024 2048 4096
    ../favicon.ico (16+32+48), favicon.svg, apple-touch-icon.png (180), icon-192.png, icon-512.png,
    icon-maskable-512.png (zone sûre 80 %): tous sur le chapeau entier; og-image.png (1200x630, lockup)

Le blanc sur transparent disparaît sur fond clair: pour un support clair, prendre la variante -dark. Le logomark Monad est dans `assets/monad.svg` (kit officiel, violet #6E54FF).
