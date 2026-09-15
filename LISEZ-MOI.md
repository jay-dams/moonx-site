# MOONX, paquet de mise en ligne

Racine du site. Zero commentaire dans le code publie.

## Google Analytics, branche derriere le consentement
Identifiant G-Z2QVDGTL5P, pose dans `assets/js/ga.js`. La balise fournie par Google n'a PAS
ete collee telle quelle: elle charge gtag immediatement, donc avant toute reponse de
l'utilisateur. Contraire a ce que dit privacy.html, et illegal en France.

Le mecanisme du site fait la meme chose, dans le bon ordre:

    Consent Mode v2 en refus total    AVANT tout chargement
    une banniere demande              rien ne part tant qu'on n'a pas repondu
    ACCEPT                            consentement accorde, gtag charge, IP anonymisee
    DECLINE                           rien ne charge, jamais
    retour sur le site                la reponse precedente est respectee

La reponse vit dans localStorage sous `moonx.consent`, pas dans un cookie: poser un cookie
pour se souvenir qu'on refuse les cookies serait une blague.

Teste, cinq etats:
    sans repondre     banniere affichee, aucune requete Google
    ACCEPT            requete vers googletagmanager avec G-Z2QVDGTL5P
    DECLINE           aucune requete
    retour + refus    aucune requete, pas de banniere
    retour + accord   requete, pas de banniere

`build_dist.py` refuse de construire si privacy.html affirme encore qu'il n'y a aucun
analytics alors que GA_ID est rempli. La construction est passee, les textes sont coherents.

## Le bandeau des preuves
Un controle de sortie ecarte toute carte qui ne repond pas a "quoi a ete pris, et qu'est-ce
qui s'est passe". Les enchainements sont mis en forme jambe par jambe, 40 caracteres chacune.
Les trois nombres affiches (multiple, prix, retour sur 100 $) se redonnent l'un l'autre.

## Mobile
Marge sous le badge Polymarket, bandeau du hero pleine largeur, defilement des cartes libere,
telephone du parcours agrandi, plein ecran du jeu reecrit, multi-touch et notes tenues.

## Cote Supabase
La derniere version de `refresh-proofs` est dans la conversation: verrous de resolution a
0.999, lowDays a 1.1, plancher de qualite a 25.
