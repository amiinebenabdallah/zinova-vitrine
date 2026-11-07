# Zinova : site vitrine

Page de présentation statique de Zinova (HTML et CSS, aucune dépendance, aucun traceur, aucun service externe).
Polices Sora et Manrope servies par le site (licence SIL OFL 1.1, fichiers dans `fonts/`).
Publiée par GitHub Pages sur `zinova.tn`. En phase d'essai : non indexée (`noindex`, `robots.txt`).

Contenu : plateforme de marque du 07/11/2026 (promesse « Le terrain, le jour même. » ; en anglais « The field, the same day. »). Aucun chiffre public, aucun témoignage ni client cité, tarifs sur demande ; seules les fonctions livrées sont présentées.

Deux langues, sans détection automatique du navigateur : français à la racine (`index.html`), anglais dans `en/index.html`. Le sélecteur FR / EN de l'en-tête est un simple lien (`hreflang`, `lang` du document). Les deux pages partagent `site.css` et `site.js` ; chacune porte son propre texte, y compris les messages du formulaire (objet `window.ZT`, dans la page). Un changement de texte se fait donc dans les deux pages.

**Limite connue : le formulaire de contact n'envoie rien.** Il contrôle les champs en ligne (téléphone tunisien à 8 chiffres compris), puis affiche un message qui renvoie vers `contact@zinova.tn`. Aucune donnée ne quitte la page. Brancher l'envoi est une décision à prendre.
