---
name: blog-article
description: Rédige et publie un article de blog SEO complet sur le portfolio de Mahefa (site statique GitHub Pages). Utiliser ce skill dès que l'utilisateur demande un article de blog, donne un thème/mot-clé à traiter ("écris un article sur…", "rédige le post kajabi vers ghl", "nouvel article blog"), veut alimenter le blog du site, ou parle de contenu SEO pour mahefatech.com — même s'il ne prononce pas le mot "blog". Le skill gère tout, de la recherche de mots-clés jusqu'à la page HTML prête à pousser.
---

# Blog Article — Portfolio Mahefa Tech

Tu rédiges un article pour le blog de Mahefa Ramaharavo, freelance no-code/WordPress/GHL (Madagascar, clients FR/CA/ES). Objectif de chaque article : se positionner sur UNE requête Google précise et amener le lecteur vers un premier rendez-vous gratuit.

## Contexte du site

- Repo : `/Users/user/Desktop/Tech/Porfolio` (racine = GitHub Pages, https://mahefatech.com)
- Design partagé : `/assets/styles.css` (classes `.article-*` et `.blog-*` déjà présentes), JS `/assets/main.js`
- Pages services pour le maillage interne : `/services/automatisation-no-code/`, `/services/go-high-level/`, `/services/developpement-wordpress/`, `/services/email-marketing/`, `/services/integration-pixel-perfect/`, `/services/chef-de-projet/`, `/services/assistant-technique/`
- Catégories du blog (slug → label) :
  - `gohighlevel` → GoHighLevel
  - `automatisation-ia` → Automatisation & IA
  - `wordpress` → WordPress
  - `conseils-freelance` → Conseils & Freelance

## Workflow

### 1. Cadrage SEO
Identifie la requête cible exacte (si l'utilisateur donne juste un thème, propose le mot-clé principal + 2-3 variantes). Si utile, fais une recherche web rapide pour vérifier l'intention de recherche et ce que font les 3 premiers résultats — l'article doit faire mieux : plus concret, plus actionnable, avec l'expérience réelle de Mahefa.

### 2. Rédaction (en français)
- **1 200 à 1 800 mots**, ton direct et concret, tutoiement interdit (vouvoyer le lecteur), première personne (« je ») car Mahefa parle de son expérience.
- Structure : intro qui **répond à la question dès les 2 premières phrases** (featured snippet), puis H2 logiques, listes, tableaux comparatifs quand pertinent, et une section FAQ de 3 questions en fin d'article.
- **E-E-A-T** : ancre l'article dans le vécu de Mahefa — missions réelles mentionnables : migration Kajabi→GHL, compte agence GHL de 10+ sous-comptes, base email de 250 000 contacts, flux Make créant des sites WordPress depuis Tally, agent IA de support client n8n+OpenAI, 10 sites WordPress livrés via agences (voir les pages services pour les détails exacts). Ne jamais inventer de chiffres ou de noms de clients.
- **Règles éditoriales du site** : jamais de tarif chiffré, jamais de délai ferme ; l'argument commercial est toujours « le premier rendez-vous est gratuit ». Pas de noms de clients sous NDA.
- **Maillage interne** : au moins 1 lien vers la page service correspondante + 1 lien vers un autre article s'il en existe (regarde `/blog/`).

### 3. Génération de la page
- Slug court en kebab-case dérivé du mot-clé (ex. `migrer-kajabi-vers-gohighlevel`).
- Copie `assets/template.html` (dans ce dossier de skill) vers `/blog/<slug>/index.html` et remplace les placeholders `{{…}}` :
  - `TITLE` ≤ 60 caractères avec le mot-clé ; `META_DESC` ≤ 155 caractères incitative ; `TITLE_JSON`/`META_DESC_JSON` = versions échappées JSON (guillemets inclus)
  - `H1` = mot-clé principal formulé naturellement ; `DATE_ISO` (AAAA-MM-JJ) et `DATE_FR` (ex. « 4 juillet 2026 ») = date du jour ; `READING_TIME` = mots/220 arrondi
  - `CATEGORY_LABEL` selon la catégorie ; `CONTENT` = corps HTML (h2/h3/p/ul/table — pas de h1) ; la FAQ visible utilise des `<h3>` sous un `<h2>FAQ</h2>`
  - `FAQ_JSON` = les 3 mêmes questions/réponses au format `{"@type": "Question", "name": …, "acceptedAnswer": {"@type": "Answer", "text": …}}` séparées par des virgules — le schema doit refléter exactement la FAQ visible
  - `CTA_TITLE`/`CTA_TEXT`/`CTA_LINK` : CTA lié au sujet, lien vers `/?service=<cta>#contact` (cta : automation, ghl, wordpress, email, pixel, gestion, assistant)
- Valide que le JSON-LD parse (`python3 -c "import json,re; …"`) avant de continuer.

### 4. Index du blog et navigation
- Si `/blog/index.html` n'existe pas : le créer depuis `assets/blog-index-template.html` (dans ce dossier de skill), **et activer le lien Blog dans la nav de toutes les pages** : remplacer le lien mort `Blog · Bientôt` de `index.html` par `<li><a href="/blog/" data-fr="Blog" data-en="Blog">Blog</a></li>`, et vérifier que les pages services ont un lien Blog (sinon l'ajouter après Témoignages).
- Ajouter la carte de l'article dans la grille (marqueur `<!-- ARTICLES -->`), la plus récente en premier :
```html
    <a class="blog-card" href="/blog/<slug>/">
      <div class="cat">CATEGORY_LABEL</div>
      <h2>Titre de l'article</h2>
      <p>Meta description ou accroche.</p>
      <div class="meta">DATE_FR · X min</div>
    </a>
```

### 5. Sitemap et vérification
- Ajouter `https://mahefatech.com/blog/<slug>/` (et `/blog/` au premier article) dans `sitemap.xml` avec `<lastmod>` du jour.
- Vérifier le rendu dans l'aperçu navigateur (serveur `portfolio` de `.claude/launch.json`) : page article + index, aucune erreur console.
- Annoncer le mot-clé ciblé et proposer le commit + push (message : `Blog : <titre>`), puis rappeler de demander l'indexation dans Search Console.

## Exemple d'invocation

Input : « écris l'article kajabi vers ghl »
Output : `/blog/migrer-kajabi-vers-gohighlevel/index.html` (~1 500 mots, catégorie GoHighLevel, FAQ schema, CTA vers `/?service=ghl#contact`), carte ajoutée sur `/blog/`, sitemap mis à jour, proposition de push.
