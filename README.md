# Assistia Reply

Assistia Reply est un SaaS Next.js qui aide à générer ou reformuler des réponses professionnelles directement dans Gmail, WhatsApp Web et, plus tard, LinkedIn/Outlook Web.

Le produit ne remplace pas les apps de messagerie. Il ajoute un copilote discret dans le champ de réponse : l’utilisateur écrit son intention, Assistia propose un brouillon, puis l’utilisateur relit et envoie lui-même.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth + Database + RLS
- Stripe Checkout, Billing Portal et webhooks
- OpenAI API pour la génération de réponses
- Extension Chrome Manifest V3 pour le MVP
- Compatible Vercel

## Fonctionnalités actuelles

- Landing page premium dark pour Assistia Reply
- Page `/tool` reliée aux CTA de la landing : test web + installation extension
- Inscription / connexion email-password et Google via Supabase Auth
- Dashboard utilisateur
- Préférences de réponse : ton, langue, rétention
- Plans Free, Pro et Business
- Stripe Checkout + webhook abonnement
- API `/api/reply/generate` pour générer ou reformuler une réponse
- Connexion extension via clé générée depuis le dashboard
- Historique léger des réponses générées
- Schéma Supabase orienté extension + usage

## Installation locale

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Si ton environnement macOS bloque le binaire natif SWC de Next, ajoute temporairement :

```bash
NEXT_TEST_WASM_DIR=$(pwd)/node_modules/@next/swc-wasm-nodejs pnpm build
```

## 1. Créer le projet Supabase

1. Crée un projet Supabase.
2. Récupère `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY`.
3. Dans SQL Editor, exécute [supabase/schema.sql](./supabase/schema.sql).
4. Active Email/Password dans Supabase Auth.
5. Optionnel : active Google comme provider Supabase Auth pour la connexion au SaaS.

Le schéma crée :

- `users_profiles`
- `subscriptions`
- `reply_requests`
- `usage_events`
- `reply_templates`
- `extension_installations`

Toutes les tables utilisateur ont RLS activé.

Si tu avais déjà exécuté une ancienne version du schéma, relance le fichier SQL complet : il ajoute
les colonnes nécessaires à la connexion extension (`install_token_hash`, `token_prefix`,
`revoked_at`, `label`).

## 2. Configurer Stripe

Crée deux produits récurrents :

- Pro — 9 €/mois
- Business — 29 €/mois

Renseigne ensuite :

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=
```

Webhook Stripe local :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Événements à écouter :

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Le plan Free ne passe pas par Stripe.

## 3. Configurer OpenAI

Renseigne :

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

L’API principale est :

```http
POST /api/reply/generate
```

Exemple de body :

```json
{
  "mode": "generate",
  "source": "gmail",
  "context": "Bonjour, le budget est un peu haut pour nous.",
  "instruction": "Réponds que je comprends, mais que la qualité justifie le prix. Propose un appel demain.",
  "tone": "professionnel",
  "language": "fr"
}
```

Réponse :

```json
{
  "reply": "Bonjour, je comprends totalement votre point...",
  "usage": {
    "used": 1,
    "limit": 20,
    "remaining": 19
  }
}
```

## 4. Déployer sur Vercel

1. Crée un projet Vercel.
2. Ajoute les variables d’environnement.
3. Déploie le projet.
4. Mets `APP_URL=https://ton-domaine.com`.
5. Mets à jour les URLs Stripe.

## 5. Tester le produit

1. Lance `pnpm dev`.
2. Clique sur “Essayer gratuitement” depuis la landing, ou va sur `/tool`.
3. Crée un compte si Supabase est configuré. Sans Supabase, `/tool` passe en mode local de démonstration.
4. Teste une réponse directement dans l’outil web.
5. Dans le bloc “Ajouter l’extension”, génère une clé extension.
6. Charge le dossier `extension/` dans Chrome depuis `chrome://extensions`.
7. Ouvre le popup Assistia, colle l’URL app et la clé extension, puis enregistre.
8. Ouvre un mail dans Gmail, clique sur Assistia, écris ton idée de réponse et génère.
9. Clique sur “Insérer dans Gmail” pour ajouter le brouillon sans envoi automatique.
10. Vérifie que la ligne apparaît dans `reply_requests`.

## 6. MVP extension Chrome

Le dossier `extension/` contient un premier prototype Chrome Manifest V3 avec :

- `manifest.json` Manifest V3
- content script Gmail
- bouton Assistia flottant dans Gmail
- popup Chrome pour enregistrer l’URL app et la clé extension
- panneau Gmail avec zone “Ton idée de réponse” et “Réponse proposée”
- appel à `/api/reply/generate`
- insertion du brouillon dans Gmail sans auto-send

Installation locale :

1. Va sur `chrome://extensions`.
2. Active le mode développeur.
3. Clique sur “Charger l’extension non empaquetée”.
4. Sélectionne le dossier `extension/`.
5. Clique sur l’icône Assistia dans Chrome.
6. Colle la clé extension générée dans le dashboard.

Ordre d’amélioration recommandé :

1. Gmail
2. WhatsApp Web
3. LinkedIn
4. Outlook Web

## Sécurité produit

- Pas d’envoi automatique.
- Pas de modification de données externes.
- Pas de Gmail API au MVP.
- L’extension lit uniquement le texte visible ou sélectionné.
- L’historique stocke un aperçu court et le brouillon généré.
- Les quotas empêchent les usages abusifs par plan.

## Documents projet

Le fichier de lecture principal est :

[LECTURE.docx](./LECTURE.docx)

Il regroupe le journal de bord, l’analyse produit et le rapport concurrence.
