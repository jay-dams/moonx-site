# fonts
Inter.woff2, JetBrainsMono.woff2 (variables, tous les poids) et Michroma-Regular.woff2, sous licence SIL OFL, chargés par fonts.css. Rien ne vient de Google Fonts en production.
Déposer ici Elianto.woff2 (ou Elianto.otf), la fonte du wordmark MOONX fournie par JP: la page la préfère à Michroma dès qu'elle existe.
Regénérer depuis les TTF de github.com/google/fonts avec fontTools (`python3 -c "from fontTools.ttLib import TTFont; t=TTFont('X.ttf'); t.flavor='woff2'; t.save('X.woff2')"`).
