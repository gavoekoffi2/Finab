'use strict';
(() => {
  const form = document.querySelector('#demo-form');
  const steps = [...form.querySelectorAll('[data-step]')];
  const next = document.querySelector('#next');
  const previous = document.querySelector('#previous');
  const reset = document.querySelector('#reset');
  const error = document.querySelector('#form-error');
  const result = document.querySelector('#demo-result');
  const country = document.querySelector('#country');
  const other = document.querySelector('#other-country');
  const nav = document.querySelector('#main-nav');
  const menu = document.querySelector('.menu-toggle');
  const fields = {
    lastName: 'last-name', firstName: 'first-name', country: 'country', otherCountry: 'other-country', city: 'city', whatsapp: 'whatsapp', email: 'email', linkedin: 'linkedin',
    diplomas: 'diplomas', profession: 'profession', experience: 'experience', skills: 'skills', achievements: 'achievements',
    banks: 'banks', insurance: 'insurance', microfinance: 'microfinance', investors: 'investors', opportunities: 'opportunities',
    exploratory: 'exploratory', hours: 'hours', toolComputer: 'tool-computer', toolPhone: 'tool-phone', toolInternet: 'tool-internet', tools: 'tools',
    motivation: 'motivation', plan: 'plan', results: 'results', truth: 'truth', privacy: 'privacy', consent: 'consent'
  };
  let current = 0;
  let pending = false;
  let completed = false;
  let submissionId = null;
  let snapshot = null;
  let controller = null;
  let generation = 0;
  let collectionOpen = false;
  let privacyVersion = '';
  let configLoaded = false;
  let paymentSessionId = null;
  let configuredFeeCad = '';
  let paymentVerified = false;
  const pendingDraftKey = 'finab-afrique-payment-draft';
  let hasPendingPaymentDraft = false;

  function syncCountry() {
    const needed = country.value === 'Autre pays africain';
    document.querySelector('#other-country-field').hidden = !needed;
    other.disabled = !needed;
    other.required = needed;
    if (!needed) { other.value = ''; other.setCustomValidity(''); }
  }
  function showStep(index, focus = true) {
    current = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
      step.disabled = i !== index || !collectionOpen;
    });
    document.querySelectorAll('#steps-list li').forEach((item, i) => {
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    document.querySelector('#step-counter').textContent = `ÉTAPE ${index + 1} SUR 6`;
    document.querySelector('#progress').value = index + 1;
    previous.hidden = index === 0;
    next.textContent = index === steps.length - 1 ? (collectionOpen ? (paymentVerified ? 'Envoyer ma candidature' : (paymentSessionId ? 'Vérifier le paiement' : `Payer ${configuredFeeCad || '60,42'} $ CAD et envoyer`)) : 'Candidatures fermées') : 'Continuer →';
    next.disabled = !configLoaded || (index === steps.length - 1 && !collectionOpen);
    reset.disabled = false;
    error.hidden = true;
    result.hidden = true;
    if (focus) {
      steps[index].querySelector('legend').focus({ preventScroll: true });
      form.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
  function validateCurrent() {
    const controls = [...steps[current].querySelectorAll('input, select, textarea')].filter(el => !el.disabled);
    controls.forEach(el => {
      if (el.required && ['text', 'textarea'].includes(el.type)) {
        el.setCustomValidity(el.value.trim() ? '' : 'Renseignez ce champ.');
      }
      if (el.id === 'linkedin') el.setCustomValidity(!el.value || /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_%.-]+\/?$/.test(el.value.trim()) ? '' : 'Indiquez une adresse de profil LinkedIn : https://www.linkedin.com/in/…');
    });
    const invalid = controls.find(el => !el.checkValidity());
    if (!invalid) return true;
    invalid.setAttribute('aria-invalid', 'true');
    invalid.setAttribute('aria-describedby', [...new Set([...(invalid.getAttribute('aria-describedby') || '').split(' ').filter(Boolean), 'form-error'])].join(' '));
    error.textContent = 'Vérifiez les champs obligatoires et leur format avant de continuer.';
    error.hidden = false;
    invalid.focus();
    invalid.reportValidity();
    return false;
  }
  function clearDemo(focus = true) {
    generation += 1;
    controller?.abort();
    pending = false; completed = false; submissionId = null; snapshot = null; paymentSessionId = null; paymentVerified = false;
    HTMLFormElement.prototype.reset.call(form);
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.setCustomValidity(''); el.removeAttribute('aria-invalid');
    });
    result.textContent = '';
    previous.disabled = false;
    form.removeAttribute('aria-busy');
    syncCountry(); showStep(0, focus);
    if (!collectionOpen) {
      error.textContent = 'Les candidatures ne sont pas ouvertes. Vous pouvez consulter les six étapes sans saisir ni envoyer de données.';
      error.hidden = false;
    }
  }
  function collectFields() {
    return Object.fromEntries(Object.entries(fields).map(([name, id]) => {
      const el = document.getElementById(id);
      return [name, el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value.trim()];
    }));
  }
  async function sendTest() {
    if (pending || completed || !collectionOpen || !paymentVerified || !paymentSessionId) return;
    // Revalidate every section, not just the final declarations.
    for (let i = 0; i < steps.length; i += 1) {
      showStep(i, false);
      if (!validateCurrent()) { steps[i].scrollIntoView({ block: 'start' }); return; }
    }
    const data = collectFields();
    const serialized = JSON.stringify(data);
    if (snapshot !== serialized || !submissionId) {
      submissionId = crypto.randomUUID(); snapshot = serialized;
    }
    const id = submissionId;
    const token = generation;
    pending = true;
    next.disabled = true; previous.disabled = true; reset.disabled = true;
    steps[current].disabled = true;
    next.textContent = 'Envoi en cours…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true; result.hidden = true;
    controller = new AbortController();
    const timeout = setTimeout(() => controller?.abort(), 60000);
    try {
      const response = await fetch('/api/afrique/recrutement', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': id },
        body: JSON.stringify({ submissionId: id, ...data, paymentSessionId, website: document.querySelector('#website').value, privacyVersion }), credentials: 'omit',
        cache: 'no-store', redirect: 'error', signal: controller.signal
      });
      if (!response.ok || !(response.headers.get('content-type') || '').toLowerCase().includes('application/json')) throw new Error('unconfirmed');
      const body = await response.json();
      if (body.ok !== true || body.reference !== `FA27-${id}`) throw new Error('unconfirmed');
      if (token !== generation) return;
      completed = true;
      HTMLFormElement.prototype.reset.call(form);
      snapshot = null; submissionId = null;
      sessionStorage.removeItem(pendingDraftKey);
      hasPendingPaymentDraft = false;
      result.textContent = `Votre candidature a été enregistrée. Référence : ${body.reference}. Conservez cette référence. Cette confirmation ne garantit pas la réception du courriel ni votre sélection.`;
      result.hidden = false; result.focus();
    } catch (failure) {
      if (token !== generation) return;
      error.textContent = failure.name === 'AbortError'
        ? 'Délai de 60 secondes dépassé. Le résultat n’est pas confirmé. Réessayez sans modifier les champs : le même identifiant sera réutilisé.'
        : 'L’enregistrement n’est pas confirmé. Aucune réussite ne peut être annoncée. Réessayez sans modifier les champs : le paiement confirmé reste lié à cette candidature.';
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      if (token === generation) {
        pending = false; form.removeAttribute('aria-busy');
        next.disabled = completed; previous.disabled = completed; reset.disabled = false;
        steps[current].disabled = completed;
        next.textContent = completed ? 'Candidature enregistrée' : (paymentSessionId ? 'Réessayer l’envoi' : 'Réessayer le paiement');
      }
    }
  }
  function savePendingDraft(data, id, sessionId = paymentSessionId) {
    try {
      sessionStorage.setItem(pendingDraftKey, JSON.stringify({ submissionId: id, data, privacyVersion, sessionId: sessionId || '' }));
      hasPendingPaymentDraft = true;
      return true;
    } catch { return false; }
  }
  function readPendingDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem(pendingDraftKey) || 'null');
      return draft && typeof draft === 'object' && draft.data && typeof draft.data === 'object' ? draft : null;
    } catch { return null; }
  }
  function restorePendingDraft(draft) {
    if (!draft || draft.privacyVersion !== privacyVersion || typeof draft.submissionId !== 'string') return false;
    Object.entries(fields).forEach(([name, id]) => {
      const element = document.getElementById(id);
      if (!element || !(name in draft.data)) return;
      if (element.type === 'checkbox') element.checked = draft.data[name] === true;
      else element.value = String(draft.data[name] ?? '');
    });
    submissionId = draft.submissionId;
    paymentSessionId = /^cs_(?:test|live)_[A-Za-z0-9]+$/.test(String(draft.sessionId || '')) ? String(draft.sessionId) : null;
    paymentVerified = false;
    hasPendingPaymentDraft = true;
    syncCountry();
    snapshot = JSON.stringify(collectFields());
    return true;
  }
  async function verifyReturnedPayment(sessionId, id) {
    const response = await fetch(`/api/afrique/recrutement/payment?sessionId=${encodeURIComponent(sessionId)}&submissionId=${encodeURIComponent(id)}`, {
      cache: 'no-store', credentials: 'omit', redirect: 'error'
    });
    if (!response.ok || !(response.headers.get('content-type') || '').toLowerCase().includes('application/json')) throw new Error('verification');
    const body = await response.json();
    return body.ok === true && body.paid === true && body.sessionId === sessionId && body.submissionId === id;
  }
  async function startPayment() {
    if (pending || completed || !collectionOpen) return;
    for (let i = 0; i < steps.length; i += 1) {
      showStep(i, false);
      if (!validateCurrent()) { steps[i].scrollIntoView({ block: 'start' }); return; }
    }
    const data = collectFields();
    const serialized = JSON.stringify(data);
    if (hasPendingPaymentDraft && snapshot && snapshot !== serialized) {
      error.textContent = 'Les réponses ont changé depuis la création du paiement. Pour éviter un paiement en double, restaurez les réponses précédentes ou contactez FINAB avant toute nouvelle tentative.';
      error.hidden = false;
      return;
    }
    if (snapshot !== serialized || !submissionId) submissionId = crypto.randomUUID();
    snapshot = serialized;
    if (!savePendingDraft(data, submissionId)) {
      error.textContent = 'Le navigateur ne peut pas conserver temporairement votre formulaire pour revenir du paiement. Aucun paiement n’a été lancé.';
      error.hidden = false;
      return;
    }
    if (paymentVerified && paymentSessionId) {
      await sendTest();
      return;
    }
    if (paymentSessionId) {
      pending = true;
      next.disabled = true; previous.disabled = true; reset.disabled = true;
      form.setAttribute('aria-busy', 'true');
      try {
        if (await verifyReturnedPayment(paymentSessionId, submissionId)) {
          paymentVerified = true;
          pending = false; form.removeAttribute('aria-busy');
          await sendTest();
          return;
        }
        paymentSessionId = null; paymentVerified = false;
        savePendingDraft(data, submissionId, '');
      } catch {
        error.textContent = 'Vérification indisponible. Aucun nouveau paiement n’a été lancé. Réessayez pour vérifier le même paiement.';
        error.hidden = false;
        return;
      } finally {
        pending = false; form.removeAttribute('aria-busy');
        next.disabled = completed; previous.disabled = completed; reset.disabled = false;
        if (!completed) next.textContent = paymentVerified ? 'Réessayer l’envoi' : (paymentSessionId ? 'Vérifier le paiement' : 'Réessayer le paiement');
      }
    }
    pending = true;
    next.disabled = true; previous.disabled = true; reset.disabled = true;
    next.textContent = 'Préparation du paiement…';
    form.setAttribute('aria-busy', 'true');
    error.hidden = true;
    try {
      const response = await fetch('/api/afrique/recrutement/payment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId }), credentials: 'omit', cache: 'no-store', redirect: 'error'
      });
      if (!response.ok) {
        let failureBody = {};
        try { failureBody = await response.json(); } catch { /* generic failure below */ }
        if (failureBody.code === 'PAIEMENT_A_VERIFIER') throw new Error('manual_review');
        throw new Error('checkout');
      }
      if (!(response.headers.get('content-type') || '').toLowerCase().includes('application/json')) throw new Error('checkout');
      const body = await response.json();
      if (body.ok !== true || !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(String(body.sessionId || ''))) throw new Error('checkout');
      paymentSessionId = String(body.sessionId);
      paymentVerified = false;
      savePendingDraft(data, submissionId, paymentSessionId);
      if (body.alreadyPaid === true) {
        if (!(await verifyReturnedPayment(paymentSessionId, submissionId))) throw new Error('verification');
        paymentVerified = true;
        pending = false; form.removeAttribute('aria-busy');
        await sendTest();
        return;
      }
      const checkout = new URL(String(body.url || ''));
      if (checkout.protocol !== 'https:' || checkout.hostname !== 'checkout.stripe.com') throw new Error('checkout');
      window.location.assign(checkout.toString());
    } catch (failure) {
      error.textContent = failure instanceof Error && failure.message === 'manual_review'
        ? 'Le statut du prestataire exige une vérification manuelle. Ne repayer pas; contactez FINAB avec votre reçu avant toute nouvelle tentative.'
        : 'Le paiement n’a pas pu être préparé. Aucun paiement n’est confirmé et votre candidature n’a pas été envoyée. Réessayez.';
      error.hidden = false;
      paymentSessionId = null; paymentVerified = false;
      savePendingDraft(data, submissionId, '');
    } finally {
      pending = false; form.removeAttribute('aria-busy');
      if (!completed) {
        next.disabled = false; previous.disabled = false; reset.disabled = false;
        next.textContent = paymentVerified ? 'Réessayer l’envoi' : (paymentSessionId ? 'Vérifier le paiement' : 'Réessayer le paiement');
      }
    }
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') {
      event.target.setCustomValidity(''); event.target.removeAttribute('aria-invalid');
    }
    result.hidden = true;
  });
  country.addEventListener('change', syncCountry);
  next.addEventListener('click', () => {
    if (pending || completed || !configLoaded) return;
    if (collectionOpen && !validateCurrent()) return;
    if (current < steps.length - 1) return showStep(current + 1);
    if (!collectionOpen) return;
    void startPayment();
  });
  previous.addEventListener('click', () => { if (!pending && !completed) showStep(Math.max(0, current - 1)); });
  reset.addEventListener('click', () => {
    if (pending) return;
    if (hasPendingPaymentDraft && !window.confirm('Effacer les réponses ? Un lien de paiement déjà créé peut rester actif et ce bouton ne peut pas l’annuler.')) return;
    sessionStorage.removeItem(pendingDraftKey); hasPendingPaymentDraft = false; clearDemo();
  });
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
    }
  });
  window.addEventListener('pagehide', () => clearDemo(false));
  window.addEventListener('pageshow', event => { if (event.persisted) void initialize(); });
  clearDemo(false);
  // Public navigation does not depend on localhost. Collection is fail-closed.
  async function initialize() {
    const policyNode = document.querySelector('#payment-policy');
    let config = null;
    let approvedCountries = [];
    try {
      const response = await fetch('/api/afrique/recrutement', {cache:'no-store', credentials:'omit', redirect:'error'});
      if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw new Error('closed');
      config = await response.json();
      approvedCountries = Array.isArray(config.collectionCountries)
        ? [...new Set(config.collectionCountries.filter(name => typeof name === 'string' && name.trim()).map(name => name.trim()))]
        : [];
      collectionOpen = config.open === true && config.paymentReady === true && approvedCountries.length > 0
        && typeof config.notice === 'string' && config.notice.trim().length > 0
        && typeof config.privacyVersion === 'string' && config.privacyVersion.length > 0
        && typeof config.paymentTerms === 'string' && config.paymentTerms.trim().length > 0
        && typeof config.paymentTermsVersion === 'string' && config.paymentTermsVersion.length > 0;
      privacyVersion = collectionOpen ? config.privacyVersion : '';
      if (collectionOpen) {
        document.querySelector('#privacy-notice').textContent = config.notice;
        document.querySelector('#consent-notice').textContent = config.notice;
        document.querySelector('#notice-version').textContent = `Version de la notice : ${privacyVersion}`;
        if (policyNode) policyNode.textContent = `${config.paymentTerms} (version ${config.paymentTermsVersion}).`;
        const publishedTerms = document.querySelector('#public-fee-conditions');
        const feeFaq = document.querySelector('#fee-faq');
        if (publishedTerms) publishedTerms.textContent = config.paymentTerms;
        if (feeFaq) feeFaq.textContent = config.paymentTerms;
        const countryPlaceholder = country.querySelector('option[value=""]')?.cloneNode(true);
        country.replaceChildren(...(countryPlaceholder ? [countryPlaceholder] : []));
        approvedCountries.forEach(name => {
          const option = document.createElement('option');
          option.value = name; option.textContent = name;
          country.append(option);
        });
        const countriesList = document.querySelector('#countries-list');
        if (countriesList) countriesList.replaceChildren(...approvedCountries.map(name => {
          const item = document.createElement('li'); item.textContent = name; return item;
        }));
      }
    } catch { collectionOpen = false; }
    const amountCad = config && /^\d+\.\d{2}$/.test(String(config.feeCad)) ? String(config.feeCad).replace('.', ',') : '60,42';
    configuredFeeCad = amountCad;
    const amountXof = config && Number(config.feeXof) === 25000 ? Number(config.feeXof).toLocaleString('fr-FR') : '25 000';
    const cadNode = document.querySelector('#fee-cad');
    const xofNode = document.querySelector('#fee-xof');
    const cadStepNode = document.querySelector('#fee-cad-step');
    const xofStepNode = document.querySelector('#fee-xof-step');
    const rateNode = document.querySelector('#fee-rate');
    const rateStepNode = document.querySelector('#fee-rate-step');
    const feeOpenStatus = document.querySelector('#fee-open-status');
    const conditionsTitle = document.querySelector('#fee-conditions-title');
    const heroLead = document.querySelector('#hero-lead');
    if (cadNode) cadNode.textContent = `${amountCad} $ CAD`;
    if (xofNode) xofNode.textContent = `${amountXof} F CFA`;
    if (cadStepNode) cadStepNode.textContent = `${amountCad} $ CAD`;
    if (xofStepNode) xofStepNode.textContent = `${amountXof} F CFA`;
    if (feeOpenStatus) feeOpenStatus.textContent = collectionOpen
      ? 'Le paiement éventuel sera effectué en CAD sur la page sécurisée Stripe; les candidatures sont ouvertes.'
      : 'Non payable actuellement; aucune candidature ni aucun paiement n’est accepté sur ce site.';
    if (conditionsTitle) conditionsTitle.textContent = collectionOpen
      ? `Conditions approuvées · version ${config.paymentTermsVersion}`
      : 'Montant de référence indicatif — non payable à ce stade';
    if (heroLead && collectionOpen) heroLead.textContent = 'Les candidatures sont ouvertes. Consultez les conditions, la notice de confidentialité et les pays admissibles avant de commencer votre parcours.';
    if (rateNode) rateNode.textContent = collectionOpen
      ? `Montant de référence : ${amountXof} XOF; le débit Stripe est fixe en CAD à ${amountCad} $. Les frais éventuels de la banque peuvent varier.`
      : `Montant indicatif proposé au taux de référence du 10 novembre 2026 (1 CAD = 413,80 XOF). Le site est actuellement fermé et n’accepte aucun paiement.`;
    if (rateStepNode) rateStepNode.textContent = collectionOpen
      ? `Référence métier : ${amountXof} XOF. Le montant débité reste fixe en CAD à ${amountCad} $, sans conversion dynamique par Stripe.`
      : `Référence métier proposée : ${amountXof} XOF. Équivalence indicative au taux de référence du 10 novembre 2026; aucun paiement n’est accepté tant que les validations et l’ouverture ne sont pas confirmées.`;
    configLoaded = true;
    document.querySelector('#availability').textContent = collectionOpen
      ? 'Candidatures ouvertes · frais d’étude obligatoires avant envoi'
      : 'Candidatures temporairement fermées · consultation du parcours uniquement';
    document.querySelector('#demo-warning').textContent = collectionOpen
      ? `Frais obligatoires d’étude de dossier : ${amountCad} $ CAD (${amountXof} F CFA). Vos réponses restent temporairement dans ce navigateur et ne sont transmises à FINAB qu’après confirmation du paiement Stripe côté serveur. Le paiement ne garantit ni sélection ni recrutement.`
      : `Candidatures temporairement fermées. Montant de référence envisagé : ${amountCad} $ CAD (${amountXof} F CFA), à titre indicatif et sous réserve de validations dans chaque pays. Aucune candidature ni aucun paiement n’est accepté actuellement.`;
    clearDemo(false);
    const params = new URLSearchParams(location.search);
    const isReturn = params.get('payment') === 'return';
    const isCancel = params.get('payment') === 'cancel';
    const draft = readPendingDraft();
    if (!collectionOpen) return;
    if (!draft) {
      if (isReturn) {
        error.textContent = 'Retour de paiement reçu, mais le brouillon de candidature est introuvable dans cette session. Ne repayer pas : contactez FINAB avec votre reçu.';
        error.hidden = false;
        clearPaymentQuery();
      }
      return;
    }
    if (!restorePendingDraft(draft)) {
      error.textContent = 'Le brouillon ne correspond plus à la notice de confidentialité active. Ne repayer pas; contactez FINAB avant toute nouvelle tentative.';
      error.hidden = false;
      return;
    }
    showStep(steps.length - 1, false);
    const callbackId = params.get('id') || params.get('sessionId') || params.get('session_id') || paymentSessionId;
    const callbackSubmission = params.get('submissionId');
    if (isReturn && callbackSubmission && callbackSubmission !== submissionId) {
      error.textContent = 'La référence de paiement ne correspond pas à ce brouillon. Ne repayer pas; contactez FINAB.';
      error.hidden = false;
      clearPaymentQuery();
      return;
    }
    if (isReturn && /^cs_(?:test|live)_[A-Za-z0-9]+$/.test(String(callbackId || ''))) {
      paymentSessionId = String(callbackId);
      paymentVerified = false;
      savePendingDraft(collectFields(), submissionId, paymentSessionId);
    }
    if (isCancel) {
      clearPaymentQuery();
      error.textContent = 'Paiement annulé : aucun montant n’a été débité. Vos réponses sont conservées; appuyez sur le bouton pour reprendre le paiement.';
      error.hidden = false;
      return;
    }
    if (paymentSessionId) {
      try {
        const paid = await verifyReturnedPayment(paymentSessionId, submissionId);
        clearPaymentQuery();
        if (paid) {
          paymentVerified = true;
          await sendTest();
          return;
        }
        error.textContent = 'Le prestataire ne confirme pas encore le paiement. Aucun statut du navigateur n’est accepté comme preuve. Si vous avez payé, ne payez pas une seconde fois; appuyez sur le bouton pour revérifier.';
        error.hidden = false;
      } catch {
        error.textContent = 'La vérification du paiement est momentanément indisponible. Ne repayer pas; appuyez sur le bouton pour revérifier.';
        error.hidden = false;
      }
    }
  }
  function clearPaymentQuery() {
    const clean = new URL(location.href);
    ['payment','id','sessionId','session_id','status','submissionId'].forEach(key => clean.searchParams.delete(key));
    history.replaceState({}, '', `${clean.pathname}${clean.search}${clean.hash}`);
  }
  void initialize();
})();
