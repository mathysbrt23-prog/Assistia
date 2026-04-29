# Journal de bord - Assistia

Derniere mise a jour : 29 avril 2026

## Regle de travail

Ce fichier sert de memoire commune du projet. Il doit etre mis a jour au fur et a mesure que nous avancons ensemble, en particulier quand :

- une decision produit importante est prise ;
- une fonctionnalite est ajoutee, retiree ou mise en pause ;
- l'idee principale evolue ;
- un document important est cree ;
- une nouvelle tache devient prioritaire.

## Idee actuelle

Assistia evolue vers un assistant de reponses integre directement dans les conversations et les emails.

Le produit vise a aider l'utilisateur a :

- generer une reponse a partir du contexte visible ;
- reformuler une intention simple en message professionnel ;
- adapter le ton : professionnel, direct, chaleureux, ferme, court, commercial ;
- rester dans l'app ou la conversation en cours, sans copier-coller dans une app separee ;
- garder le controle : Assistia propose ou insere un brouillon, mais n'envoie pas a la place de l'utilisateur.

Positionnement simple :

> Ecris la bonne reponse, au bon endroit, sans changer d'app.

## Decision de pivot

L'idee initiale etait un agent personnel accessible via WhatsApp, capable de lire Gmail, gerer Google Calendar, deplacer des rendez-vous et repondre depuis WhatsApp.

Nous avons decide de pivoter, au moins pour le MVP, parce que :

- l'agent WhatsApp complet est techniquement complexe ;
- l'integration WhatsApp Business Cloud API ajoute beaucoup de friction ;
- les actions Gmail/Calendar demandent OAuth, scopes sensibles, confirmations et gestion d'erreurs ;
- des acteurs comme Hostinger peuvent proposer des assistants generalistes a bas prix ;
- le besoin de "bien repondre vite" est plus simple, plus frequent et plus facile a tester.

## Direction recommandee

Commencer par une extension navigateur desktop.

Priorite MVP :

1. Gmail web
2. WhatsApp Web
3. LinkedIn ou Outlook Web

Fonctions MVP :

- bouton Assistia pres du champ de reponse ;
- action "Generer une reponse" ;
- action "Reformuler mon brouillon" ;
- choix du ton ;
- insertion du texte dans le champ, avec validation humaine ;
- limites d'usage via abonnement Stripe ;
- dashboard simple avec usage et preferences.

Mobile :

- a garder dans la vision ;
- ne pas commencer par mobile natif ;
- explorer plus tard un clavier iOS/Android si le MVP desktop prouve l'usage.

## Etat actuel du dossier

Le dossier projet est sur le Bureau :

`/Users/mathys/Desktop/Codex`

Un lien existe aussi depuis l'ancien chemin pour que Codex retrouve le projet :

`/Users/mathys/Documents/Codex -> /Users/mathys/Desktop/Codex`

Le dossier a ete nettoye :

- anciens pitchs WhatsApp retires ;
- page `/pitch` retiree ;
- documents ranges dans `docs/` ;
- script de generation range dans `scripts/documents/` ;
- references principales renommees de WhatsAgent vers Assistia ;
- `.next`, `.DS_Store` et fichiers Python temporaires ignores/nettoyes.

## Documents importants

- `docs/product/assistia-reply-analyse-produit.docx`
  Analyse produit de la nouvelle piste Assistia Reply : MVP, faisabilite, architecture, risques, pricing et roadmap.

- `docs/investor/assistia-reply-pitch-investisseur.docx`
  Pitch investisseur complet : marche, concurrence, business model, projections, ask et annexes VC.

- `docs/README.md`
  Index des documents conserves.

## Etat technique actuel

Projet existant :

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth / Database
- Stripe Checkout / Webhooks
- OpenAI API
- API Assistia Reply pour generer ou reformuler des reponses
- debut de dossier `extension/` Chrome Manifest V3
- landing page Assistia dark, premium, style Apple

Point important :

Le backend a ete simplifie autour du nouveau produit. Les modules Google Calendar, Gmail API serveur, WhatsApp Business API et agent WhatsApp ont ete retires du code actif.

## Historique

### 27 avril 2026

- Creation du projet SaaS initial appele WhatsAgent.
- Mise en place de l'architecture Next.js, Supabase, Stripe, Google, WhatsApp et OpenAI.
- Creation du schema Supabase et du README d'installation.

### 28 avril 2026

- Refonte de la landing page en version premium, minimaliste, dark, inspiree Apple.
- Renommage visuel vers Assistia.
- Ajout du logo Assistia dans le header et le mockup telephone.
- Creation de documents Word de pitch puis decision de ne plus centrer le projet sur le pitch WhatsApp initial.
- Analyse du risque produit : l'agent WhatsApp complet est trop complexe et trop concurrence.
- Pivot propose vers Assistia Reply : assistant de reponses integre aux mails et conversations.
- Creation du document Word `assistia-reply-analyse-produit.docx`.
- Nettoyage et rangement du dossier.
- Deplacement du projet sur le Bureau.
- Creation de ce journal de bord.
- Veille concurrentielle sur les assistants de reponses integres aux emails/conversations.
- Creation du rapport `docs/product/rapport-concurrence-assistia-reply.md`.
- Conclusion de la veille : le marche existe mais "generer une reponse IA" est deja banalise. Assistia doit se specialiser sur les reponses professionnelles en francais, Gmail + WhatsApp Web, cas d'usage concrets, sans auto-send.
- Decision de fonctionnement : les documents destines a etre lus par un humain doivent exister en Word, pas seulement en Markdown dans l'editeur.
- Creation du document maitre `LECTURE.docx`, qui regroupe le journal de bord, l'analyse produit, le rapport concurrence et les notes utiles.
- Refonte de la landing page pour le nouveau produit Assistia Reply.
- Conservation du style dark premium, du logo, du vert WhatsApp et des sections principales, mais adaptation du message vers l'extension Gmail/WhatsApp Web qui genere ou reformule des reponses professionnelles.
- Pivot technique du dossier complet vers Assistia Reply : README, env, schema Supabase, dashboard, onboarding, pricing, plans et metadonnees mis a jour.
- Ajout de l'API `/api/reply/generate` avec OpenAI, quotas par plan et historique leger dans `reply_requests`.
- Suppression du code actif lie a Google Calendar, Gmail API serveur, WhatsApp Business Cloud API et agent WhatsApp.
- Ajout d'un premier dossier `extension/` pour le prototype Chrome Manifest V3.
- Verification technique du pivot : `pnpm lint` et `pnpm build` passent avec le nouveau socle Assistia Reply.
- Creation du document Word `docs/investor/assistia-reply-pitch-investisseur.docx` : pitch investisseur complet avec marche, concurrence, business model, projections, ask et annexes VC.

### 29 avril 2026

- Passage de la landing au debut d'outil fonctionnel.
- Creation de la page `/tool`, reliee aux CTA de la landing, pour tester Assistia directement et installer l'extension.
- Ajout d'un mode local de demonstration quand Supabase/OpenAI ne sont pas encore configures, afin que la landing n'envoie jamais vers une erreur serveur.
- Ajout d'une connexion extension via cle generee depuis le dashboard, afin de ne pas dependre uniquement des cookies Supabase dans Chrome.
- Ajout des routes API `/api/extension/token` et `/api/extension/ping`.
- Mise a jour de `/api/reply/generate` pour accepter les appels authentifies depuis l'extension.
- Refonte du prototype Chrome : popup de configuration, panneau Assistia dans Gmail, lecture du mail visible, zone d'intention, generation/reformulation, copie et insertion dans Gmail sans envoi automatique.
- Mise a jour du schema Supabase pour stocker les cles extension sous forme de hash.
- Tous les boutons principaux de la landing ("Essayer", "Essayer gratuitement", "Commencer") pointent maintenant vers `/tool`.
- Sauvegarde de l'ancienne landing dans `app/page.previous-landing.tsx` pour pouvoir revenir en arriere.
- Nouvelle refonte complete de la landing : experience plus produit, plus conversion, avec un mock Gmail + extension Assistia des le hero.
- Conservation du lien entre la landing et l'outil : les CTA principaux continuent d'envoyer vers `/tool`.
- Refonte de la page `/tool` en parcours d'activation plus concret : test web, compte, installation extension, connexion, ouverture Gmail.
- Ajout d'un systeme de connexion automatique de l'extension depuis la web app quand l'extension Chrome publiee et son ID sont renseignes.
- Ajout d'un fallback propre par cle extension pour la beta locale, avec copie du chemin du dossier `extension/`.
- Correction du parcours auth : les redirections `next=/tool` sont conservees apres inscription email ou Google OAuth.
- Preparation v1 sans paiement ni assets Chrome Store : scope officiellement reduit a Gmail uniquement.
- Ajout des pages publiques `/privacy` et `/terms` pour la confiance utilisateur et la soumission Chrome Web Store.
- Recentrage du manifest Chrome et du content script sur Gmail uniquement.
- Creation du document `docs/chrome-store-v1.md` avec objectif unique, justifications de permissions, declarations de confidentialite et instructions reviewer.
- Ajout du runbook `docs/v1-production-runbook.md` pour configurer Supabase, OpenAI, Vercel et Chrome Store sans exposer de secrets.
- Ajout du script `pnpm check:prod` pour verifier la presence des pages legales, du schema Supabase, du ZIP Chrome, du manifest Gmail-only et des variables documentees.
- Tentative de deploiement via l'integration Vercel : l'integration demande la CLI `vercel deploy`, mais aucun projet `.vercel` n'est encore lie et la CLI Vercel n'est pas installee localement.
- Deploiement Vercel effectue avec le projet `assistia-reply`.
- URL de production temporaire : `https://assistia-reply.vercel.app`.
- Variables Vercel non sensibles ajoutees : `APP_URL`, `OPENAI_MODEL`, `NEXT_PUBLIC_SUPPORT_EMAIL`.
- Nouveau deploiement production effectue apres ajout des variables Vercel.
- Tests production valides : `/`, `/tool`, `/privacy`, `/terms` repondent en `200`.
- Test API production valide en mode demo : `/api/reply/generate` retourne une proposition locale tant que `OPENAI_API_KEY` n'est pas encore configuree.
- Correction du dashboard en mode production sans Supabase : `/dashboard` affiche maintenant un ecran de configuration propre au lieu d'une erreur `500`.
- Nouveau deploiement production effectue apres correction du dashboard.
- Tests production valides : `/dashboard`, `/tool`, `/signup` repondent en `200`, et `/api/reply/generate` fonctionne en mode demo.

### 30 avril 2026

- Remplacement des derniers logos temporaires en lettre `A` par le vrai logo Assistia dans le popup Chrome et le panneau Gmail.
- Ajout des icones Chrome officielles dans `extension/icons/` et declaration dans `extension/manifest.json`.
- Ajout d'une initialisation explicite de l'icone de barre Chrome via `chrome.action.setIcon`.
- Ajout du vrai logo comme ressource accessible par le content script Gmail.
- Correction des logos de la landing et de `/tool` pour ne plus couper la pointe de la bulle.
- Regeneration du ZIP Chrome `dist/assistia-reply-chrome-v0.3.0.zip` avec les nouveaux assets.
- Deploiement Vercel effectue apres correction visuelle.
- Tests production valides : `/` et `/tool` repondent en `200`.
- Creation d'un asset rond detoure `public/assistia-logo-round.png` : cercle noir, exterieur transparent, pointe conservee.
- Remplacement du favicon `app/icon.png` par la version ronde detouree.
- Mise a jour des logos web pour utiliser la version ronde detouree.
- Regeneration des icones Chrome et du ZIP extension avec l'exterieur transparent.

## Ce qui reste a faire

Priorite courte :

- decider officiellement si Assistia Reply devient le nouveau produit principal ;
- valider le positionnement : "copilote de reponses professionnelles en francais pour emails et conversations client" ;
- tester l'API `/api/reply/generate` avec un vrai compte Supabase et une cle OpenAI ;
- installer l'extension Chrome en local et valider l'insertion dans Gmail ;
- generer une vraie cle extension depuis le dashboard et verifier le ping dans `extension_installations` ;
- publier l'extension sur le Chrome Web Store pour remplacer l'installation locale par un vrai bouton "Ajouter a Chrome" ;
- renseigner `NEXT_PUBLIC_CHROME_EXTENSION_URL` et `NEXT_PUBLIC_CHROME_EXTENSION_ID` pour activer le parcours client en quelques clics ;
- creer une capture ou petite demo video du nouveau parcours landing -> dashboard -> extension ;
- brancher Stripe live et finaliser les offres payantes quand on reprendra la partie paiement ;
- creer les assets Chrome Store : icones, screenshots, visuels et description finale.

MVP technique :

- renforcer l'extension Chrome Manifest V3 ;
- fiabiliser l'injection du bouton Assistia dans Gmail ;
- detecter le champ de reponse ;
- envoyer le contexte selectionne ou visible a une API Next.js ;
- generer ou reformuler une reponse avec OpenAI ;
- inserer le brouillon dans Gmail sans envoyer automatiquement ;
- connecter l'extension au compte Assistia ;
- appliquer les limites d'usage selon l'abonnement.

Ensuite :

- ajouter WhatsApp Web ;
- ajouter Outlook Web ou LinkedIn ;
- ajouter preferences de ton dans le dashboard ;
- ajouter historique d'usage sans stocker le contenu sensible par defaut ;
- tester une beta avec quelques utilisateurs reels.

## Questions ouvertes

- Est-ce que le MVP doit commencer uniquement sur Gmail, ou Gmail + WhatsApp Web des le debut ?
- Est-ce que le produit cible d'abord les freelances, commerciaux, fondateurs ou etudiants/professionnels ?
- Quel ton exact pour la marque : assistant premium, outil de productivite, ou copilote commercial ?

## Prochaine decision recommandee

Tester le nouveau socle produit en conditions reelles :

- creer un compte Supabase local ;
- executer le nouveau schema SQL ;
- renseigner OpenAI et Stripe ;
- charger l'extension Chrome en local ;
- verifier la generation d'une reponse dans Gmail.

Prochaine etape production immediate :

- creer le projet Supabase reel ;
- executer `supabase/schema.sql` ;
- ajouter dans Vercel `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` et `OPENAI_API_KEY` ;
- redeployer `https://assistia-reply.vercel.app` ;
- tester inscription, connexion, generation OpenAI reelle et cle extension.
