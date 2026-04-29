# Assistia Reply - Préparation Chrome Web Store v1

## Positionnement v1

Assistia Reply est une extension Chrome pour Gmail.

Objectif unique :

> Générer ou reformuler un brouillon professionnel à partir du mail Gmail visible et de l’intention écrite par l’utilisateur.

La v1 ne couvre pas WhatsApp Web, LinkedIn ou Outlook. Ces intégrations restent des pistes futures.

## Description courte

Génère ou reformule des brouillons professionnels directement dans Gmail.

## Description longue

Assistia Reply ajoute un panneau discret dans Gmail pour aider à répondre plus vite et mieux aux emails professionnels.

L’utilisateur ouvre un email, écrit en quelques mots ce qu’il souhaite répondre, choisit un ton, puis Assistia génère un brouillon. Le brouillon peut être copié ou inséré dans Gmail. Assistia n’envoie jamais l’email automatiquement : l’utilisateur relit, ajuste et clique lui-même sur Envoyer.

## Single purpose

Assistia Reply helps Gmail users generate and rewrite professional email reply drafts from the currently visible email context and the user’s own instruction.

## Permissions à justifier

| Permission | Justification |
| --- | --- |
| `storage` | Stocker localement l’URL de l’application Assistia et la clé de connexion de l’extension. |
| `activeTab` | Permettre au popup de demander au content script d’ouvrir le panneau Assistia dans l’onglet Gmail actif. |
| `https://mail.google.com/*` | Afficher le panneau Assistia dans Gmail, lire le contenu visible du mail et insérer le brouillon uniquement après action utilisateur. |
| Domaine app Assistia | Appeler les API Assistia pour générer une réponse et vérifier la connexion extension. |

## Déclarations de confidentialité

Assistia traite :

- email du compte Assistia ;
- contenu visible ou sélectionné du mail Gmail ouvert ;
- instruction écrite par l’utilisateur ;
- brouillon généré ;
- métadonnées d’usage et quotas ;
- clé d’extension stockée sous forme de hash côté serveur.

Assistia ne fait pas :

- pas d’envoi automatique d’email ;
- pas de suppression de mail ;
- pas de modification des paramètres Gmail ;
- pas de lecture de toute la boîte Gmail ;
- pas de revente des données utilisateur.

## Liens requis

- Politique de confidentialité : `/privacy`
- Conditions d’utilisation : `/terms`
- Page d’essai / onboarding : `/tool`

## Test instructions pour reviewer Chrome

1. Installer l’extension.
2. Ouvrir l’application Assistia et créer un compte.
3. Depuis `/tool`, connecter l’extension ou coller la clé dans le popup.
4. Ouvrir Gmail.
5. Ouvrir un email.
6. Cliquer sur le bouton Assistia.
7. Écrire une intention de réponse.
8. Générer le brouillon.
9. Vérifier que le texte est inséré seulement après clic sur “Insérer dans Gmail”.

## Avant soumission

- Remplacer `contact@assistia.ai` par l’email de support définitif si besoin.
- Renseigner `NEXT_PUBLIC_CHROME_EXTENSION_URL` après création de la fiche Chrome Web Store.
- Renseigner `NEXT_PUBLIC_CHROME_EXTENSION_ID` après obtention de l’ID d’extension.
- Ajouter les screenshots et icônes Chrome Store.
