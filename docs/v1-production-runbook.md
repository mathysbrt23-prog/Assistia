# Assistia Reply - Runbook production v1

## Objectif

Mettre en ligne la v1 Gmail-only avec une URL Vercel temporaire, Supabase réel, OpenAI réel et extension Chrome prête à soumettre.

## Etat actuel

- Projet Vercel : `assistia-reply`
- URL production temporaire : `https://assistia-reply.vercel.app`
- Dernier deploiement production : pret
- Pages testees en production : `/`, `/tool`, `/privacy`, `/terms`
- API `/api/reply/generate` : fonctionnelle en mode demo local tant que Supabase/OpenAI ne sont pas configures

Variables deja ajoutees dans Vercel :

```env
APP_URL=https://assistia-reply.vercel.app
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_SUPPORT_EMAIL=contact@assistia.ai
```

## Variables Vercel obligatoires

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
APP_URL=https://assistia-reply.vercel.app
NEXT_PUBLIC_SUPPORT_EMAIL=contact@assistia.ai
```

Variables à ajouter après publication Chrome Web Store :

```env
NEXT_PUBLIC_CHROME_EXTENSION_URL=
NEXT_PUBLIC_CHROME_EXTENSION_ID=
```

Variables Stripe à laisser vides tant que le paiement est reporté :

```env
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_PRO=
STRIPE_PRICE_BUSINESS=
```

## Supabase

1. Créer un projet Supabase.
2. Exécuter `supabase/schema.sql` dans SQL Editor.
3. Activer Email/Password dans Auth.
4. Pour la bêta, désactiver la confirmation email ou utiliser Google OAuth.
5. Ajouter l’URL de callback : `https://<url-vercel>/auth/callback`.
6. Copier les clés dans Vercel.

## OpenAI

1. Créer une clé API.
2. Ajouter `OPENAI_API_KEY` dans Vercel.
3. Garder `OPENAI_MODEL=gpt-4o-mini` pour la v1.

## Vercel

1. Projet deja lie : `assistia-reply`.
2. Ajouter les variables d’environnement manquantes : Supabase + OpenAI.
3. Redeployer en production.
4. Vérifier :
   - `/`
   - `/tool`
   - `/privacy`
   - `/terms`
   - inscription et connexion
   - génération de réponse avec OpenAI réel
   - génération de clé extension

## Chrome Web Store

1. Créer le compte Chrome Web Store Developer.
2. Soumettre `dist/assistia-reply-chrome-v0.3.1.zip`.
3. Utiliser `docs/chrome-store-v1.md` pour la fiche et les justifications.
4. Renseigner l’URL `/privacy`.
5. Après création de la fiche, copier l’ID extension et l’URL publique dans Vercel.

## Vérification locale

```bash
pnpm lint
pnpm build
pnpm check:prod
```
