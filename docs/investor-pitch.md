# Assistia — Pitch investisseur

## 1. Vision

Assistia veut devenir l’assistant personnel conversationnel des professionnels qui vivent déjà dans WhatsApp.

Le problème n’est pas le manque d’outils. Les professionnels utilisent déjà Gmail, Google Calendar, Slack, Outlook, WhatsApp et plusieurs dashboards métier. Le vrai problème est que l’information utile est dispersée et que chaque action simple demande d’ouvrir plusieurs applications.

Assistia résout ce problème en plaçant une couche d’assistance intelligente au-dessus des outils existants. L’utilisateur écrit dans WhatsApp, Assistia lit les informations autorisées, résume, prépare une action et demande confirmation quand l’action est sensible.

Pourquoi maintenant :

- Les usages professionnels sur WhatsApp sont déjà massifs, notamment chez les indépendants, entrepreneurs, commerciaux et petites équipes.
- Les APIs Gmail, Google Calendar, WhatsApp Business Cloud API et Stripe permettent aujourd’hui de construire un produit SaaS fiable autour de ce canal.
- Les modèles IA rendent possible une interface naturelle : l’utilisateur n’a pas besoin de connaître une commande exacte.
- Les professionnels cherchent à réduire le temps passé à naviguer entre des outils, sans remplacer toute leur stack.

## 2. Problème

Une journée de travail simple est fragmentée.

Un utilisateur reçoit des emails dans Gmail, suit ses rendez-vous dans Google Calendar, discute avec ses clients sur WhatsApp, répond à son équipe sur Slack ou Outlook, puis doit maintenir son attention entre tous ces espaces.

Les frictions concrètes :

- Trouver les emails importants du jour demande d’ouvrir Gmail, filtrer, lire, trier, puis résumer mentalement.
- Savoir si l’après-midi est libre demande d’ouvrir Calendar, changer de vue, vérifier les détails des événements.
- Décaler un rendez-vous demande d’identifier le bon événement, choisir un horaire, modifier l’événement, puis parfois prévenir quelqu’un.
- Préparer une réponse client demande de retrouver le mail, comprendre le contexte et rédiger.
- Chaque micro-tâche provoque un changement de contexte.

Pourquoi c’est un problème business :

- Les indépendants et dirigeants perdent du temps sur des tâches de coordination à faible valeur.
- Les commerciaux ratent ou retardent des réponses client parce que l’information est dispersée.
- Les petites équipes n’ont pas toujours d’assistant humain, mais ont les mêmes besoins opérationnels.
- Les outils de productivité actuels ajoutent souvent une application de plus au lieu de réduire le nombre d’interfaces.

## 3. Solution

Assistia est un assistant personnel accessible depuis WhatsApp.

L’utilisateur peut écrire des demandes simples :

- “J’ai quoi aujourd’hui ?”
- “J’ai des rendez-vous cet après-midi ?”
- “Résume mes mails d’aujourd’hui”
- “Quels sont mes mails importants ?”
- “Décale mon rendez-vous avec Paul à demain 15h”
- “Prépare une réponse à ce mail”
- “Envoie-moi mon planning de la journée”

Assistia comprend la demande, appelle les bons outils internes, puis répond dans WhatsApp.

L’avantage clé de WhatsApp :

- Il n’y a pas de nouvelle app à apprendre.
- Le canal est déjà utilisé au quotidien par les utilisateurs ciblés.
- L’expérience est rapide : une question, une réponse, une confirmation.
- L’usage mobile est naturel, notamment pour les entrepreneurs, freelances et commerciaux en déplacement.

Assistia ne cherche pas à remplacer Gmail ou Calendar. Il réduit la friction d’accès et d’action.

## 4. Produit

Le MVP actuel couvre une chaîne produit complète : acquisition, inscription, connexion des outils, abonnement, traitement WhatsApp, agent IA et sécurité.

### Fonctionnalités réelles

Résumé des mails :

- Récupération des emails reçus aujourd’hui via Gmail API.
- Récupération des emails non lus.
- Résumé des emails importants.
- Recherche d’un email par expéditeur, sujet ou requête.

Gestion calendrier :

- Liste des événements du jour via Google Calendar API.
- Liste des événements de l’après-midi.
- Recherche d’un événement par nom.
- Proposition de déplacement d’un rendez-vous.
- Modification Calendar uniquement après confirmation explicite.

Réponses automatiques :

- Préparation d’un brouillon de réponse à un email.
- Le produit ne l’envoie pas automatiquement.
- L’utilisateur garde le contrôle avant toute action sensible.

Actions via WhatsApp :

- Webhook WhatsApp Business Cloud API pour recevoir les messages.
- Réponse envoyée directement dans WhatsApp.
- Association entre numéro WhatsApp et utilisateur Supabase.
- Sauvegarde des messages entrants et sortants.

Sécurité et contrôle :

- Confirmation obligatoire avant modification d’événement Calendar.
- Table `pending_confirmations` pour stocker les actions en attente.
- Table `action_logs` pour tracer les actions sensibles.
- RLS Supabase pour isoler les données utilisateur.
- Tokens Google chiffrés côté serveur.

### Exemples d’usage

Exemple 1 — Planning du jour :

Utilisateur : “J’ai quoi aujourd’hui ?”

Assistia répond avec la liste des rendez-vous Google Calendar du jour.

Exemple 2 — Emails importants :

Utilisateur : “Quels sont mes mails importants ?”

Assistia récupère les emails importants et produit un résumé court avec les points d’attention.

Exemple 3 — Déplacement de réunion :

Utilisateur : “Décale mon rendez-vous avec Paul à demain 15h”

Assistia cherche l’événement, prépare le déplacement, puis répond :

“Déplacer ‘Call avec Paul’ du 28 avril 10h00 au 29 avril 15h00. Confirmer ? Réponds OUI pour valider.”

La modification n’est exécutée qu’après réception de “OUI”.

## 5. Démo utilisateur

Scénario réaliste :

### Matin

L’utilisateur ouvre WhatsApp et écrit :

“Envoie-moi mon planning de la journée”

Assistia répond :

“Voici ton programme :

- 10h : Call avec Paul
- 14h : Rendez-vous client
- 17h : Suivi projet

Tu as aussi 4 emails importants reçus ce matin.”

### Demande d’information client

L’utilisateur écrit :

“Tu as reçu le mail de Léo ?”

Assistia recherche dans Gmail et répond :

“Oui. Léo confirme son intérêt et indique être prêt à investir 10 000 €. Je peux te préparer une réponse.”

### Action préparée

L’utilisateur écrit :

“Prépare une réponse”

Assistia génère un brouillon :

“Bonjour Léo, merci pour ton retour. Ravi de voir ton intérêt. Je te propose un échange demain pour cadrer les prochaines étapes et répondre à tes questions.”

Assistia précise que le message n’a pas été envoyé automatiquement.

### Action sensible

L’utilisateur écrit :

“Décale le call avec Paul à demain 15h”

Assistia répond :

“Je peux déplacer ‘Call avec Paul’ à demain 15h. Confirmer ? Réponds OUI pour valider.”

L’événement est modifié uniquement après confirmation.

## 6. Marché

Utilisateur cible initial :

- Freelances qui gèrent clients, rendez-vous et emails eux-mêmes.
- Entrepreneurs et dirigeants de petites structures.
- Commerciaux et account managers qui répondent vite depuis mobile.
- Consultants qui coordonnent plusieurs clients.
- Profils opérationnels qui utilisent déjà WhatsApp comme canal de travail.

Cas d’usage principaux :

- Résumé de la journée.
- Priorisation des emails.
- Préparation de réponses client.
- Vérification rapide du calendrier.
- Déplacement de rendez-vous.
- Assistant personnel léger pour utilisateurs sans assistant humain.

Le marché initial n’est pas celui des grandes suites enterprise. Il est plus direct : professionnels mobiles, petites équipes, indépendants et fonctions commerciales qui veulent un gain de temps immédiat.

## 7. Business model

Assistia est monétisable par abonnement SaaS.

La logique de pricing repose sur :

- Un plan gratuit ou d’entrée pour tester l’usage.
- Un plan individuel payant pour un volume régulier de messages WhatsApp.
- Un plan business pour des volumes plus élevés, historique complet et support prioritaire.

Le projet intègre déjà :

- Stripe Checkout pour souscrire.
- Stripe Billing Portal pour gérer l’abonnement.
- Stripe Webhooks pour synchroniser le statut d’abonnement.
- Blocage de l’agent si l’abonnement n’est pas actif.
- Quota mensuel de messages selon le plan.

Pricing commercial possible pour la version Assistia :

- Découverte : 0 €/mois pour tester.
- Pro : 9 €/mois pour un usage individuel.
- Business : 29 €/mois pour usage plus intensif.

La structure technique permet de faire évoluer les prix sans changer le cœur du produit.

## 8. Différenciation

Assistia est différent d’un outil de productivité classique.

Pas d’application supplémentaire :

- L’utilisateur agit depuis WhatsApp.
- Pas de nouveau dashboard à consulter au quotidien.

Centralisation :

- Gmail, Calendar et l’agent IA sont accessibles par une seule interface conversationnelle.
- Le dashboard existe pour configurer, connecter et auditer, pas pour remplacer l’usage WhatsApp.

Conversationnel :

- L’utilisateur formule une intention naturelle.
- Assistia choisit l’outil adapté.
- Les réponses sont courtes, directement exploitables.

Contrôle :

- Les actions sensibles ne sont pas exécutées automatiquement.
- La confirmation explicite “OUI” réduit le risque de modification non voulue.

## 9. Traction

À ce stade, Assistia dispose d’un MVP fonctionnel.

Éléments déjà construits :

- Landing page.
- Authentification Supabase.
- Dashboard utilisateur.
- Connexion Google OAuth.
- Intégration Gmail API.
- Intégration Google Calendar API.
- Intégration WhatsApp Business Cloud API.
- Agent IA avec intentions métier.
- Confirmation avant action sensible.
- Stripe Checkout et webhooks.
- Schéma Supabase sécurisé avec RLS.

Si aucune traction utilisateur n’est encore disponible, les premières métriques réalistes à suivre sont :

- Nombre d’inscriptions.
- Pourcentage d’utilisateurs qui connectent Google.
- Pourcentage d’utilisateurs qui associent leur numéro WhatsApp.
- Nombre moyen de demandes WhatsApp par utilisateur actif.
- Taux de demandes traitées avec succès.
- Taux de confirmation sur actions Calendar.
- Temps gagné estimé par semaine.
- Conversion gratuit vers payant.
- Rétention à 7 jours et 30 jours.

Hypothèse initiale réaliste :

Assistia doit d’abord prouver une fréquence d’usage. Le signal fort n’est pas seulement l’inscription, mais le fait que l’utilisateur envoie naturellement plusieurs demandes par semaine depuis WhatsApp.

## 10. Roadmap

Prochaines étapes produit :

1. Stabiliser l’onboarding complet.
2. Clarifier les plans commerciaux dans Stripe et dans la landing.
3. Ajouter une vue de suivi des quotas par utilisateur.
4. Améliorer les prompts et l’évaluation des intentions WhatsApp.
5. Ajouter la création d’événements Calendar avec confirmation.
6. Ajouter l’envoi d’emails uniquement après confirmation.
7. Ajouter des notifications proactives : résumé du matin, fin de journée, rappels.
8. Ajouter des intégrations CRM simples pour les profils sales.
9. Ajouter une gestion multi-utilisateurs pour les équipes.
10. Construire des analytics produit pour mesurer fréquence, valeur et conversion.

Features futures :

- Mémoire utilisateur contrôlée.
- Synthèse quotidienne automatique.
- Routage multi-comptes Google.
- Templates de réponses.
- Intégration Slack ou Outlook.
- Mode équipe avec règles de sécurité.

## 11. Tech stack

Résumé simple :

- Next.js : application web, landing, auth pages, dashboard et routes API.
- Tailwind CSS : interface responsive et rapide à itérer.
- Supabase Auth : inscription, connexion et sessions utilisateur.
- Supabase Database : stockage des profils, connexions, messages, demandes agent, confirmations et logs.
- Supabase RLS : isolation des données par utilisateur.
- Stripe : abonnements, checkout, portail client et webhooks.
- Google OAuth : connexion sécurisée du compte Google.
- Gmail API : lecture, recherche et résumé des emails.
- Google Calendar API : lecture et modification confirmée des événements.
- WhatsApp Business Cloud API : réception et envoi de messages WhatsApp.
- OpenAI API : compréhension des demandes et génération de résumés ou brouillons.
- Vercel : déploiement compatible serverless.

Ce stack permet de lancer vite, tester l’usage réel et itérer sans reconstruire l’infrastructure.

## 12. Conclusion et vision long terme

Assistia commence par un cas d’usage simple : gérer emails et calendrier depuis WhatsApp.

Mais la vision long terme est plus large : devenir un OS personnel conversationnel.

Un utilisateur ne devrait pas avoir à ouvrir cinq applications pour savoir quoi faire, retrouver une information, préparer une réponse ou déplacer un rendez-vous. Il devrait pouvoir exprimer une intention, recevoir une réponse fiable et valider les actions importantes.

Assistia peut devenir la couche d’exécution personnelle au-dessus des outils professionnels existants : légère, mobile, conversationnelle et contrôlée.

Le produit ne remplace pas les outils. Il remplace la friction entre eux.
