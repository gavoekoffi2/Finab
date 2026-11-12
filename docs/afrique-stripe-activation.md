# FINAB Afrique — activer le paiement Stripe

Page : https://finablasolution.cloud/afrique/recrutement
Montant : **60,42 $ CAD** (référence 25 000 F CFA), débité en CAD via Stripe Checkout.

## Comment ça marche

1. Le candidat remplit les 6 étapes puis clique sur « Payer 60,42 $ CAD et envoyer ».
2. Il paie sur la page sécurisée de Stripe (FINAB ne voit jamais la carte).
3. À son retour, le serveur **vérifie le paiement directement auprès de Stripe**, puis :
   - enregistre la candidature sur le serveur (`/opt/finablasolution/data/afrique-candidatures.json`) ;
   - envoie une copie au Google Sheet (Apps Script). Si le Google Sheet est en panne, la candidature reste enregistrée.
4. Le webhook Stripe confirme aussi le paiement si le candidat ferme son navigateur avant la fin.
5. Tout apparaît dans le tableau de bord : https://finablasolution.cloud/admin → section **Candidatures Afrique**
   (propriétaire et administrateurs), avec export Excel/CSV et alerte « paiement sans formulaire ».

## Activation (3 étapes)

### 1. Dans Stripe (https://dashboard.stripe.com)

- **Développeurs → Clés API** : copier la **clé secrète** (`sk_live_…`, ou `sk_test_…` pour un essai).
- **Développeurs → Webhooks → Ajouter un endpoint** :
  - URL : `https://finablasolution.cloud/api/afrique/recrutement/payment/webhook`
  - Événements : `checkout.session.completed` et `checkout.session.async_payment_succeeded`
  - Copier le **secret de signature** (`whsec_…`).
  - Attention : le mode test et le mode live ont chacun leur propre webhook et leur propre `whsec_…`.

### 2. Sur le VPS, dans `/opt/finablasolution/afrique.env`

Ne jamais mettre ces valeurs dans GitHub ni dans un chat.

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FINAB_AFRIQUE_PAYMENT_ENABLED=true
FINAB_AFRIQUE_OPEN=true
```

Si ces anciennes lignes existent, les mettre à `true` ou les supprimer, sinon elles bloquent :
`FINAB_AFRIQUE_FEE_CAD_APPROVED=false`, `FINAB_AFRIQUE_OPEN=false`.
`STRIPE_ENVIRONMENT` est facultatif ; s'il est présent il doit correspondre à la clé (`live` pour `sk_live_`, `test` pour `sk_test_`).
Les autres anciennes variables (empreintes SHA-256, pays, downstream…) ne sont plus nécessaires et sont ignorées.

Options facultatives :

| Variable | Rôle | Défaut |
| --- | --- | --- |
| `FINAB_AFRIQUE_FEE_CAD_CENTS` | Montant en centimes CAD | `6042` |
| `FINAB_AFRIQUE_PAYMENT_TERMS_TEXT` | Remplace le texte des conditions de paiement | texte intégré |
| `FINAB_AFRIQUE_NOTICE_TEXT` | Remplace l'avis de confidentialité | texte intégré |
| `FINAB_AFRIQUE_APPS_SCRIPT_ENABLED` | `false` pour ne plus copier vers le Google Sheet | activé |

### 3. Redéployer

Le conteneur ne relit les fichiers `.env` que lorsqu'il est **recréé** (un simple redémarrage ne suffit pas).

```
cd /home/finablasolution
git pull origin claude/ecstatic-hypatia-9c24ck
npm ci
npm run build
docker compose -f docker-compose.prod.yml up -d --build --force-recreate
```

Vérification : `curl -s https://finablasolution.cloud/api/afrique/recrutement` doit afficher `"open":true`.
Si `"paymentReady":false`, une des valeurs de l'étape 2 est manquante ou incohérente.

## Essai conseillé avant d'encaisser

1. Mettre d'abord une clé `sk_test_…` et le `whsec_…` du webhook **de test**.
2. Payer avec la carte de test `4242 4242 4242 4242`, date future, CVC quelconque.
3. Vérifier la candidature dans le tableau de bord admin.
4. Remplacer par la clé `sk_live_…` et le `whsec_…` du webhook **live**, puis refaire l'étape 3 (redéployer).

## Fermer temporairement

`FINAB_AFRIQUE_OPEN=false` dans `afrique.env`, puis `docker compose -f docker-compose.prod.yml up -d --force-recreate`.

## Tests automatiques

`npm test` (paiement, webhook, parcours complet avec Google Sheet en panne).
