# WhatsAgent

WhatsAgent est un SaaS Next.js qui permet de piloter Gmail, Google Calendar et des actions confirmées depuis WhatsApp Business Cloud API.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Supabase Auth + Database + RLS
- Stripe Checkout, Billing Portal et webhooks
- Google OAuth, Gmail API, Google Calendar API
- WhatsApp Business Cloud API
- OpenAI API pour l’agent de compréhension
- Compatible Vercel

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
5. Optionnel : active Google comme provider Supabase Auth pour la connexion au compte SaaS.

Le schéma crée :

- `users_profiles`
- `subscriptions`
- `google_connections`
- `whatsapp_connections`
- `whatsapp_messages`
- `agent_requests`
- `pending_confirmations`
- `action_logs`

Toutes les tables sensibles ont RLS activé. Les webhooks et l’agent utilisent `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement.

## 2. Configurer Stripe

1. Crée 3 produits récurrents mensuels dans Stripe :
   - Starter : 19 €/mois
   - Pro : 49 €/mois
   - Business : 99 €/mois
2. Copie les price IDs dans :
   - `STRIPE_PRICE_STARTER`
   - `STRIPE_PRICE_PRO`
   - `STRIPE_PRICE_BUSINESS`
3. Ajoute `STRIPE_SECRET_KEY`.
4. Configure un webhook vers :

```text
https://ton-domaine.com/api/stripe/webhook
```

5. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copie le signing secret dans `STRIPE_WEBHOOK_SECRET`.

## 3. Configurer Google Cloud OAuth

1. Crée un projet Google Cloud.
2. Active Gmail API et Google Calendar API.
3. Crée un OAuth Client Web.
4. Ajoute l’URI de redirection :

```text
http://localhost:3000/api/google/callback
https://ton-domaine.com/api/google/callback
```

5. Remplis :
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`

Scopes demandés :

- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/calendar.readonly`
- `https://www.googleapis.com/auth/calendar.events`

Les tokens Google sont chiffrés côté serveur avec `TOKEN_ENCRYPTION_KEY`. Utilise une valeur longue et aléatoire en production.

## 4. Configurer WhatsApp Business Cloud API

1. Crée une app Meta for Developers.
2. Active WhatsApp Business Cloud API.
3. Récupère :
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_APP_SECRET`
4. Choisis un `WHATSAPP_VERIFY_TOKEN` long et aléatoire.
5. Configure le webhook Meta :

```text
https://ton-domaine.com/api/whatsapp/webhook
```

6. Abonne le webhook aux messages entrants.
7. Dans le dashboard WhatsAgent, enregistre le numéro WhatsApp utilisateur au format international sans `+`.

## 5. Configurer OpenAI

1. Ajoute `OPENAI_API_KEY`.
2. Optionnel : ajuste `OPENAI_MODEL`.

L’agent classe les demandes WhatsApp et appelle les tools internes :

- `getTodayCalendarEvents`
- `getAfternoonCalendarEvents`
- `summarizeTodayEmails`
- `searchEmails`
- `draftEmailReply`
- `findCalendarEvent`
- `proposeCalendarMove`
- `confirmCalendarMove`
- `sendWhatsAppMessage`

## 6. Déployer sur Vercel

1. Crée un nouveau projet Vercel depuis ce repo.
2. Ajoute toutes les variables de `.env.example`.
3. Mets `APP_URL=https://ton-domaine.com`.
4. Mets `GOOGLE_REDIRECT_URI=https://ton-domaine.com/api/google/callback`.
5. Déploie.
6. Reconfigure les webhooks Stripe et WhatsApp vers l’URL Vercel.

## 7. Tester le webhook WhatsApp

Vérification Meta :

```bash
curl "https://ton-domaine.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=TON_TOKEN&hub.challenge=12345"
```

La réponse doit être :

```text
12345
```

Ensuite, depuis le numéro associé dans le dashboard, envoie :

```text
J’ai quoi aujourd’hui ?
```

Le message entrant et la réponse sortante doivent apparaître dans `whatsapp_messages`.

## 8. Tester un abonnement Stripe

1. Connecte-toi.
2. Va sur `/pricing` ou `/dashboard`.
3. Clique sur un plan.
4. Utilise une carte de test Stripe.
5. Vérifie que `subscriptions.status` passe à `active`.

Sans abonnement actif, l’agent WhatsApp répond que l’accès est bloqué.

## 9. Tester Gmail et Calendar

1. Va dans `/dashboard`.
2. Clique sur “Connecter Google”.
3. Autorise les scopes demandés.
4. Envoie ces messages WhatsApp :

```text
Résume mes mails d’aujourd’hui
J’ai des rendez-vous cet après-midi ?
Envoie-moi mon planning de la journée
```

## 10. Tester une confirmation Calendar

Envoie :

```text
Décale mon rendez-vous avec Paul à demain 15h
```

WhatsAgent doit répondre avec un résumé clair et :

```text
Confirmer ? Réponds OUI pour valider.
```

L’événement Google Calendar n’est modifié qu’après réception exacte de :

```text
OUI
```

## Sécurité

- RLS Supabase activé sur toutes les tables utilisateur.
- Routes API authentifiées via Supabase lorsque nécessaire.
- Webhook Stripe validé avec `STRIPE_WEBHOOK_SECRET`.
- Webhook WhatsApp validé avec `WHATSAPP_APP_SECRET` si fourni.
- Tokens Google chiffrés avec AES-256-GCM.
- Actions sensibles journalisées dans `action_logs`.
- Modifications Calendar exécutées uniquement après confirmation explicite.

## Commandes

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```
