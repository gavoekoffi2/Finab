# FINAB Afrique — préparation Stripe

Le parcours utilise **Stripe Checkout hébergé**, en **CAD**, avec paiement par carte. Le montant fixe approuvé est **60,42 $ CAD** (équivalent de référence : **25 000 F CFA / XOF**, au taux de référence du 10 novembre 2026). Le paiement est débité en CAD; il n’y a pas de conversion dynamique au moment du paiement.

## Variables privées (ne pas committer ni envoyer dans le chat)

- `STRIPE_SECRET_KEY` — clé secrète Stripe, d’abord `sk_test_…` ; `sk_live_…` uniquement après validation.
- `STRIPE_ENVIRONMENT` — `test` ou `live`, cohérent avec le préfixe de la clé.
- `STRIPE_WEBHOOK_SECRET` — secret de signature `whsec_…` de l’endpoint webhook.
- `FINAB_AFRIQUE_FEE_CAD_CENTS` — montant fixe en centimes CAD (`6042` = 60,42 $ CAD); minimum accepté par l’application : 50 cents.
- `FINAB_AFRIQUE_FEE_CAD_APPROVED` — laisser `false` jusqu’à approbation écrite du montant.
- `FINAB_STRIPE_ACCOUNT_COUNTRY` — pays légal du compte marchand Stripe, code ISO à deux lettres.
- `FINAB_STRIPE_ACCOUNT_COUNTRY_VERIFIED` — laisser `false` tant que l’éligibilité du compte marchand n’a pas été confirmée.
- `FINAB_AFRIQUE_PAYMENT_ENABLED` — `false` par défaut; activation seulement après tests et validations.
- `FINAB_AFRIQUE_PAYMENT_TERMS_TEXT`, `FINAB_AFRIQUE_PAYMENT_TERMS_VERSION`, `FINAB_AFRIQUE_PAYMENT_TERMS_APPROVED_SHA256` — conditions approuvées et leur empreinte SHA-256.
- `FINAB_AFRIQUE_COLLECTION_COUNTRIES_APPROVED` — accord pour les pays de recrutement concernés.
- `FINAB_AFRIQUE_PAYMENT_DOWNSTREAM_VERIFIED` — confirmation que l’enregistrement final des candidatures conserve correctement les champs de paiement.

La collecte reste fermée si l’un des prérequis manque. Stocker les clés uniquement dans le fichier privé d’environnement du service; ne jamais les écrire dans les logs ou le dépôt.

## Endpoint webhook à déclarer dans Stripe

`https://finablasolution.cloud/api/afrique/recrutement/payment/webhook`

Événement nécessaire : `checkout.session.completed`. Le webhook vérifie la signature Stripe et déduplique les événements; la candidature n’est toutefois validée qu’après récupération de la Checkout Session auprès de Stripe côté serveur, avec vérification de l’ID, du statut payé, du montant CAD, de la devise et de la référence de candidature.

## Avant l’activation

1. Confirmer le pays légal du compte Stripe et son admissibilité aux paiements Stripe.
2. Conserver le montant fixe approuvé de 60,42 $ CAD, correspondant à la référence de 25 000 XOF au taux documenté; ne pas recalculer le débit au moment du paiement. Présenter séparément les frais éventuels de banque.
3. Approuver les conditions de paiement, annulation et remboursement, ainsi que les pays concernés.
4. Configurer les clés Stripe de test dans l’environnement privé et tester sans encaissement réel.
5. Vérifier la réception réelle des candidatures et des métadonnées de paiement.
6. Passer en production uniquement après validation explicite; ne pas modifier le menu ni publier sans « publier ».
