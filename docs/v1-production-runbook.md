# Assistia Reply - Runbook production v1

## Objectif

Mettre en ligne la v1 Gmail-only avec une URL Vercel temporaire, Supabase réel, OpenAI réel et extension Chrome prête à soumettre.

## Etat actuel

- Projet Vercel : `assistia-reply`
- URL production temporaire : `https://assistia-reply.vercel.app`
- Dernier deploiement production : pret
- Pages testees en production : `/`, `/tool`, `/privacy`, `/terms`
- Supabase : configure sur le projet de production actuel
- API `/api/reply/generate` : fonctionnelle avec comptes reels ; repasse en brouillon demo si `OPENAI_API_KEY` manque

Variables deja ajoutees dans Vercel :

```env
APP_URL=https://assistia-reply.vercel.app
OPENAI_MODEL=gpt-4o-mini
NEXT_PUBLIC_SUPPORT_EMAIL=contact@assistia.ai
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
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
STRIPE_PRICE_ESSENTIAL=
STRIPE_PRICE_PRO=
```

Plans v1 prévus :

- Free : 0 €, 3 réponses / jour, blocage 24h quand le quota est atteint
- Essential : 4,99 €/mois, 40 réponses / jour
- Pro : 19,99 €/mois, 200 réponses / jour

## Supabase

1. Vérifier que `supabase/schema.sql` est bien appliqué.
2. Activer Email/Password dans Auth.
3. Pour la bêta, désactiver la confirmation email ou utiliser Google OAuth.
4. Ajouter l’URL de callback : `https://<url-vercel>/auth/callback`.
5. Copier les clés dans Vercel si le projet change.

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
2. Soumettre `dist/assistia-reply-chrome-v0.3.7.zip`.
3. Utiliser `docs/chrome-store-v1.md` pour la fiche et les justifications.
4. Renseigner l’URL `/privacy`.
5. Après création de la fiche, copier l’ID extension et l’URL publique dans Vercel.

## Vérification locale

```bash
pnpm lint
pnpm build
pnpm check:prod
```
