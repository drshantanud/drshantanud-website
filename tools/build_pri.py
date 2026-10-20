"""Build the Protein-Rich India recipe pages from tools/data/*.txt.

Run from the site root:  python tools/build_pri.py
Writes recipes/protein-rich-india/ (listing + one page per recipe) and updates sitemap.xml.
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'recipes')
BASE = 'https://drshantanudeshpande.com'
SECTION = '/recipes/'
LASTMOD = '2026-10-20'

MEALS = [
    ('breakfast', 'Breakfast', 'Breakfasts'),
    ('lunch', 'Lunch', 'Lunches'),
    ('snack', 'Snack', 'Snacks'),
    ('dinner', 'Dinner', 'Dinners'),
    ('drink', 'Drink', 'Drinks'),
    ('dessert', 'Dessert', 'Desserts'),
]
INTRO = {
    'breakfast': 'These breakfasts give 12–25 g of protein per serving, about 18 g on average, almost entirely from dals, dairy and eggs. None needs protein powder. They keep familiar dishes like poha, dosa and paratha, but change the proportions: more dal in the batter, a dairy or pulse partner on the plate.',
    'lunch': 'Each lunch is shown twice: the dish alone and the full plate with its measured roti, rice or bhakri and a curd or vegetable side. Full plates average about 23 g protein and 510 kcal. Because grains lower protein per calorie, most plates are a "Good source" even when they give over 20 g.',
    'snack': 'These snacks give 8–18 g of protein per serving, about 13 g on average, at 155–290 kcal. A good protein snack either bridges a long gap between meals without becoming a second lunch, or tops up a day where meals fell short.',
    'dinner': 'Dinner plates average about 430 kcal and 22 g protein, around 90 kcal lighter than the lunches. Most are served with one roti or 40 g raw rice; the protein-led dish carries the meal and a salad or curd fills the gap.',
    'drink': 'Without whey, these drinks give 9–16 g of protein per glass, about 13 g on average. Whey is optional in six of them, always as a half scoop with its own nutrition line. Total sugars include lactose and fruit sugar, and no drink is presented as sugar-free.',
    'dessert': 'These desserts give 6–14 g of protein per serving, about 10 g on average. They remain desserts, not health foods: added sugar is stated for every recipe, and sugar is reduced from traditional versions, usually by half or more.',
}
TIER_HELP = ('High protein: at least 12 g protein per serving (20 g for a lunch or dinner plate) and at least 5 g per 100 kcal. '
             'Good source: at least 6 g per serving (10 g for a plate) that does not meet the High-protein test. '
             'These are this collection\'s own labels, not regulatory claims.')
DISC = ('Nutrition values are estimates calculated from the Indian Food Composition Tables 2017 (ICMR-NIN) and typical product labels. '
        'They have not been laboratory-analysed and will vary with your ingredients, brands and cooking. '
        'Recipes are for healthy adults and are general information only, not a substitute for advice from a doctor or qualified dietitian. '
        'If you are pregnant or breastfeeding, cooking for children, have food allergies, or live with kidney disease, diabetes or any other medical condition, please take professional advice about your diet.')
NUTCOLS = [('kcal', 'kcal', ''), ('Protein', 'Protein', ' g'), ('Carbs', 'Carbs', ' g'), ('Fat', 'Fat', ' g'),
           ('Sat fat', 'Sat fat', ' g'), ('Fibre', 'Fibre', ' g'), ('Total sugars', 'Total sugars', ' g'),
           ('Added sugar', 'Added sugar', ' g'), ('Protein per 100 kcal', 'Protein per 100 kcal', ' g')]


REGIONS = [('west', 'Western India', ['maharashtra', 'gujarat', 'goa', 'rajasthan']),
           ('north', 'Northern India', ['punjab', 'delhi', 'uttar pradesh', 'jammu', 'kashmir']),
           ('south', 'Southern India', ['tamil nadu', 'kerala', 'karnataka', 'andhra', 'telangana']),
           ('east', 'Eastern India', ['west bengal', 'odisha', 'bihar', 'jharkhand']),
           ('central', 'Central India', ['madhya pradesh', 'chhattisgarh']),
           ('ne', 'North-East and Himalayan', ['assam', 'sikkim', 'manipur', 'himalayan']),
           ('modern', 'Modern / pan-Indian', ['modern', 'pan-indian'])]
SOURCES = [('paneer', 'Paneer / chhena', ['paneer', 'chhena']), ('soy', 'Soy / tofu', ['tofu', 'soy ']),
           ('egg', 'Eggs', [' egg', 'eggs']),
           ('pulse', 'Dals and pulses', ['dal', 'moong', 'chana', 'rajma', 'matki', 'peas', 'urad', 'toor', 'masoor', 'besan', 'sattu', 'sprout', 'mangodi', 'chole', 'vatana', 'cherupayar', 'lentil']),
           ('dairy', 'Curd / milk', ['curd', 'milk', 'yogurt', 'chaas'])]


def region_of(r):
    t = r['region'].lower()
    best = None
    for k, _, words in REGIONS:
        for w in words:
            i = t.find(w)
            if i > -1 and (best is None or i < best[0]):
                best = (i, k)
    if not best:
        raise ValueError(r['region'])
    return best[1]


def sources_of(r):
    t = ' ' + ' '.join(r['ing']).lower() + ' '
    return [k for k, _, words in SOURCES if any(w in t for w in words)]


def esc(s):
    return html.escape(s, quote=True)


def slugify(t):
    t = t.lower().replace('&', 'and')
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return t


def parse():
    recipes = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'tools', 'data', '*.txt'))):
        cur = None
        for raw in open(f, encoding='utf-8').read().split('\n'):
            line = raw.rstrip()
            if not line.strip():
                continue
            if line.startswith('='):
                rid, meal, diet, tier = line[1:].split('|')
                cur = {'id': rid, 'meal': meal, 'diet': diet, 'tierl': tier,
                       'ing': [], 'step': [], 'prot': [], 'var': [], 'nut': []}
                recipes.append(cur)
                continue
            k, v = line.split(': ', 1)
            if k in ('ing', 'step', 'prot', 'var'):
                cur[k].append(v)
            elif k == 'nut':
                cur['nut'].append(v)
            elif k == 'tier':
                cur['tiernote'] = v
            else:
                cur[k] = v
    return recipes


def nutrows(r):
    rows = []
    for n in r['nut']:
        p = n.split('|')
        label = p[0]
        head = label.startswith('*')
        label = label.lstrip('*')
        vals = (p[1:] + [''] * 9)[:9]
        rows.append({'label': label, 'head': head, 'v': vals})
    if not any(x['head'] for x in rows):
        rows[0]['head'] = True
    return rows


def head_row(r):
    return next(x for x in r['rows'] if x['head'])


def num(s):
    try:
        float(s)
        return s
    except ValueError:
        return None


SHELL = None


def load_shell():
    s = open(os.path.join(ROOT, 'recipes', 'index.html'), encoding='utf-8').read()
    a = s.index('<link rel="preconnect"')
    b = s.index('<script type="application/ld+json">')
    fonts = s[a:b]
    c = s.index('<body>') + len('<body>')
    d = s.index('<main>')
    body_top = s[c:d]
    e = s.index('</main>')
    f = s.index('<script src="/assets/site.js')
    footer = s[e + len('</main>'):f]
    return fonts, body_top, footer


def page(title, desc, path, ld, main, extra_css='', extra_js=''):
    fonts, body_top, footer = SHELL
    url = BASE + path
    return ('<!DOCTYPE html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            '<title>%s</title><meta name="description" content="%s"><link rel="canonical" href="%s">\n'
            '<meta property="og:type" content="website"><meta property="og:site_name" content="Dr. Shantanu Deshpande"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s"><meta property="og:image" content="%s/assets/dr-shantanu-deshpande.jpg"><meta name="twitter:card" content="summary_large_image">\n'
            '%s<script type="application/ld+json">%s</script><link rel="stylesheet" href="/assets/site.css?v=11"><link rel="stylesheet" href="/assets/recipes.css?v=2"><link rel="stylesheet" href="/assets/pri.css?v=1"></head><body>%s<main>\n%s</main>%s'
            '<script src="/assets/site.js?v=3" defer></script>%s</body></html>\n') % (
        esc(title), esc(desc), url, esc(title), esc(desc), url, BASE, fonts, json.dumps(ld, ensure_ascii=False), body_top, main, footer, extra_js)


def mealname(m):
    return next(x[1] for x in MEALS if x[0] == m)


def dietname(d):
    return 'Vegetarian' if d == 'V' else 'Contains egg'


def unit(meal):
    return {'lunch': 'per plate', 'dinner': 'per plate', 'drink': 'per glass'}.get(meal, 'per serving')


def card(r):
    h = head_row(r)
    k, p = h['v'][0], h['v'][1]
    tierc = 'pri-hi' if r['tierl'].startswith('High') else 'pri-gs'
    return ('<li class="pri-card" data-i="%d" data-p="%s" data-k="%s" data-reg="%s" data-src="%s" data-diet="%s" data-hi="%d" data-s="%s"><a class="pri-ca" href="%s%s/">'
            '<span class="pri-id">%s</span><h3>%s</h3>'
            '<span class="pri-nn"><b>%s kcal</b> · <b>%s g protein</b> <small>%s</small></span>'
            '<span class="rf-chips"><span class="rf-chip %s">%s</span><span class="rf-chip">%s</span></span>'
            '<span class="pri-rg">%s</span></a></li>') % (
        r['n'], esc(p), esc(k), region_of(r), ' '.join(sources_of(r)),
        r['diet'], 1 if r['tierl'].startswith('High') else 0, esc((r['title'] + ' ' + r['region'] + ' ' + r['tags']).lower()),
        SECTION, r['slug'], r['id'], esc(r['title']), esc(k), esc(p), unit(r['meal']), tierc, esc(r['tierl']),
        dietname(r['diet']), esc(r['region'].split(' (')[0]))


def recipe_page(r, prev, nxt):
    h = head_row(r)
    mealn = mealname(r['meal'])
    title = '%s | Protein-Rich Indian Recipe | Dr. Shantanu Deshpande' % r['title']
    p_ = h['v'][1]
    desc = '%s (%s): about %s g protein and %s kcal %s. Ingredients in grams, method and estimated nutrition.' % (
        r['title'], r['region'].split(' (')[0], p_, h['v'][0], unit(r['meal']))
    url = BASE + SECTION + r['slug'] + '/'
    nutr = {'@type': 'NutritionInformation', 'servingSize': '1 ' + {'drink': 'glass', 'lunch': 'plate', 'dinner': 'plate'}.get(r['meal'], 'serving'),
            'calories': h['v'][0] + ' kcal'}
    for key, idx in (('proteinContent', 1), ('carbohydrateContent', 2), ('fatContent', 3), ('saturatedFatContent', 4), ('fiberContent', 5), ('sugarContent', 6)):
        if num(h['v'][idx]) is not None:
            nutr[key] = h['v'][idx] + ' g'
    steps = [{'@type': 'HowToStep', 'text': s} for s in r['step']]
    cat = {'breakfast': 'Breakfast', 'lunch': 'Lunch', 'snack': 'Snack', 'dinner': 'Dinner', 'drink': 'Drink', 'dessert': 'Dessert'}[r['meal']]
    rec = {'@context': 'https://schema.org', '@type': 'Recipe', 'name': r['title'], 'description': r['blurb'], 'url': url,
           'author': {'@type': 'Person', 'name': 'Dr. Shantanu Deshpande'}, 'datePublished': LASTMOD,
           'recipeCuisine': r['region'], 'recipeCategory': cat, 'recipeYield': r['serves'],
           'recipeIngredient': r['ing'], 'recipeInstructions': steps, 'nutrition': nutr}
    if r['diet'] == 'V':
        rec['suitableForDiet'] = 'https://schema.org/VegetarianDiet'
    bc = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'Protein Recipes', 'item': BASE + '/recipes/'},
        {'@type': 'ListItem', 'position': 3, 'name': r['title'], 'item': url}]}
    info = [('Region', r['region']), ('Status', r['status']), ('Diet label', r['label']), ('Time', r['time']),
            ('Serves', r['serves']), ('Difficulty', r['diff']), ('Good for', r['good']), ('Tags', r['tags']), ('Allergens', r['allergens'])]
    cols = [i for i in range(9) if any(x['v'][i] for x in r['rows'])]
    th = ''.join('<th>%s</th>' % esc(NUTCOLS[i][1]) for i in cols)
    trs = ''
    for x in r['rows']:
        cells = ''.join('<td>%s</td>' % (esc(x['v'][i] + (NUTCOLS[i][2] if x['v'][i] and (num(x['v'][i]) is not None or x['v'][i].startswith('<')) else '')) if x['v'][i] else '–') for i in cols)
        trs += '<tr%s><th scope="row">%s</th>%s</tr>' % (' class="pri-head"' if x['head'] and len(r['rows']) > 1 else '', esc(x['label']), cells)
    tiles = '<div><dt>Calories</dt><dd>%s kcal</dd></div><div><dt>Protein</dt><dd>%s g</dd></div><div><dt>Carbs</dt><dd>%s g</dd></div><div><dt>Fat</dt><dd>%s g</dd></div><div><dt>Fibre</dt><dd>%s g</dd></div>' % (
        esc(h['v'][0]), esc(h['v'][1]), esc(h['v'][2]), esc(h['v'][3]), esc(h['v'][5] or '–'))
    tierc = 'pri-hi' if r['tierl'].startswith('High') else 'pri-gs'
    nav = '<ul class="rf-np pri-pn">'
    if prev:
        nav += '<li>← <a href="%s%s/">%s</a></li>' % (SECTION, prev['slug'], esc(prev['title']))
    if nxt:
        nav += '<li><a href="%s%s/">%s</a> →</li>' % (SECTION, nxt['slug'], esc(nxt['title']))
    nav += '</ul>'
    main = ('<section class="diet-tool rf"><div class="w"><article class="rf-det" id="rf-print">'
            '<p class="rf-back rf-np"><a href="%s#%s">← All %s</a> · <a href="%s">Recipe finder</a></p>'
            '<h1 class="h2">%s</h1><div class="rf-chips"><span class="rf-chip">%s</span><span class="rf-chip">%s</span><span class="rf-chip %s">%s</span><span class="rf-chip">%s</span></div>'
            '<p class="pri-bl">%s</p>'
            '<div class="rf-acts rf-np"><button type="button" class="btn o s" id="rf-printbtn">Print / Save as PDF</button></div>'
            '<dl class="pri-info">%s</dl>'
            '<h2 class="rf-h3">Nutrition (estimated)</h2><dl class="rf-nut rf-nutbig">%s</dl><p class="rf-hint">%s</p>'
            '<div class="rf-tw"><table class="rf-table pri-nt"><thead><tr><th></th>%s</tr></thead><tbody>%s</tbody></table></div>'
            '<p class="rf-hint">%s</p>'
            '<h2 class="rf-h3">Ingredients</h2><ul class="pri-ing">%s</ul>'
            '<h2 class="rf-h3">Method</h2><ol class="rf-steps">%s</ol>'
            '<h2 class="rf-h3">Protein optimisation</h2><ul>%s</ul>'
            '<h2 class="rf-h3">Variations, serving and storage</h2><ul>%s</ul>'
            '<p class="rf-disc">%s From the collection <i>Protein-Rich India</i> by Dr. Shantanu Deshpande · drshantanudeshpande.com</p>'
            '</article>%s<p class="rf-np"><a class="btn s" href="%s">Browse and filter all 100 recipes</a></p></div></section>') % (
        SECTION, r['meal'], esc(next(x[2] for x in MEALS if x[0] == r['meal'])), SECTION,
        esc(r['title']), esc(mealn), dietname(r['diet']), tierc, esc(r['tierl']), esc(r['id']),
        esc(r['blurb']),
        ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (esc(a), esc(b)) for a, b in info),
        tiles, esc('Headline values are for the full plate.' if r['meal'] in ('lunch', 'dinner') and len(r['rows']) > 1 else 'Headline values are per serving, as written.'),
        th, trs, esc(r['tiernote']),
        ''.join('<li>%s</li>' % esc(x) for x in r['ing']),
        ''.join('<li>%s</li>' % esc(x) for x in r['step']),
        ''.join('<li>%s</li>' % esc(x) for x in r['prot']),
        ''.join('<li>%s</li>' % esc(x) for x in r['var']),
        esc(DISC), nav, SECTION)
    return page(title, desc, SECTION + r['slug'] + '/', [rec, bc], main)


def listing(recipes):
    total = len(recipes)
    tabs = '<a class="pri-tab" href="#all" data-t="all">All <small>%d</small></a>' % total
    secs = ''
    for key, one, many in MEALS:
        rs = [r for r in recipes if r['meal'] == key]
        tabs += '<a class="pri-tab" href="#%s" data-t="%s">%s <small>%d</small></a>' % (key, key, many, len(rs))
        secs += ('<section class="pri-sec" id="%s" data-t="%s"><h2 class="rf-h2">%s <small>(%d)</small></h2><p class="pri-in">%s</p><ul class="pri-grid">%s</ul></section>') % (
            key, key, many, len(rs), esc(INTRO[key]), ''.join(card(r) for r in rs))
    main = ('<section class="diet-tool rf"><div class="w"><h1 class="h2">Healthy Protein Recipe Finder: %d Recipes</h1>'
            '<p class="diet-intro">Vegetarian and egg recipes from every region of India, written by interventional cardiologist Dr. Shantanu Deshpande. Every recipe gives exact quantities and estimated calories, protein, carbohydrate, fat and fibre. Pick a meal type, then narrow by protein source, region, protein or calories.</p>'
            '<nav class="pri-tabs" aria-label="Recipe categories">%s</nav>'
            '<div class="pri-tools rf-np"><label class="pri-s"><span>Search recipes</span><input type="search" id="pri-q" placeholder="e.g. paneer, moong, Kerala" autocomplete="off"></label>'
            '<fieldset class="pri-f"><legend>Diet</legend><label><input type="radio" name="pri-d" value="all" checked> All</label><label><input type="radio" name="pri-d" value="V"> Vegetarian only</label><label><input type="radio" name="pri-d" value="E"> With egg</label></fieldset></div>'
            '<div class="pri-tools rf-np"><fieldset class="pri-f"><legend>Contains</legend>%s</fieldset></div>'
            '<div class="pri-tools rf-np"><label class="pri-s pri-sm"><span>Region</span><select id="pri-r"><option value="">All regions</option>%s</select></label>'
            '<label class="pri-s pri-sm"><span>Protein per serving or plate</span><select id="pri-mp"><option value="0">Any</option><option value="10">10 g or more</option><option value="15">15 g or more</option><option value="20">20 g or more</option><option value="25">25 g or more</option></select></label>'
            '<label class="pri-s pri-sm"><span>Calories per serving or plate</span><select id="pri-mk"><option value="0">Any</option><option value="250">250 kcal or fewer</option><option value="350">350 kcal or fewer</option><option value="450">450 kcal or fewer</option><option value="550">550 kcal or fewer</option></select></label>'
            '<label class="pri-s pri-sm"><span>Sort by</span><select id="pri-o"><option value="">Recipe order</option><option value="p">Protein, highest first</option><option value="k">Calories, lowest first</option></select></label>'
            '<label class="pri-h"><input type="checkbox" id="pri-h"> High protein only</label></div>'
            '<p class="rf-hint" id="pri-n" aria-live="polite"></p>%s'
            '<p class="rf-hint">%s</p><p class="rf-disc">%s</p>'
            '</div></section>') % (
        total, tabs, ''.join('<label><input type="checkbox" name="pri-src" value="%s"> %s</label>' % (k, n) for k, n, _ in SOURCES),
        ''.join('<option value="%s">%s</option>' % (k, n) for k, n, _ in REGIONS), secs, esc(TIER_HELP), esc(DISC))
    ld = [{'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': 'Healthy Protein Recipe Finder: 100 Recipes', 'url': BASE + SECTION,
           'description': 'One hundred vegetarian and egg recipes from every region of India with estimated nutrition, by Dr. Shantanu Deshpande.',
           'hasPart': [{'@type': 'Recipe', 'name': r['title'], 'url': BASE + SECTION + r['slug'] + '/'} for r in recipes]},
          {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
              {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE + '/'},
              {'@type': 'ListItem', 'position': 2, 'name': 'Protein Recipes', 'item': BASE + SECTION}]}]
    return page('Healthy Protein Recipe Finder: 100 Indian Recipes | Dr. Shantanu Deshpande',
                'Browse 100 vegetarian and egg high-protein Indian recipes by breakfast, lunch, snacks, dinner, drinks and desserts, with estimated nutrition for every recipe.',
                SECTION, ld, main, extra_js='<script src="/assets/pri.js?v=1" defer></script>')


def main():
    global SHELL
    SHELL = load_shell()
    recipes = parse()
    seen = set()
    for r in recipes:
        r['n'] = len(seen)
        r['slug'] = slugify(r['title'])
        assert r['slug'] not in seen, r['slug']
        seen.add(r['slug'])
        r['rows'] = nutrows(r)
    assert len(recipes) == 100, len(recipes)
    os.makedirs(OUT, exist_ok=True)
    assert not (seen & {'index', 'protein-rich-india'})
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(listing(recipes))
    for key, _, _ in MEALS:
        rs = [r for r in recipes if r['meal'] == key]
        for i, r in enumerate(rs):
            d = os.path.join(OUT, r['slug'])
            os.makedirs(d, exist_ok=True)
            open(os.path.join(d, 'index.html'), 'w', encoding='utf-8', newline='\n').write(
                recipe_page(r, rs[i - 1] if i else None, rs[i + 1] if i + 1 < len(rs) else None))
    # sitemap
    sp = os.path.join(ROOT, 'sitemap.xml')
    s = open(sp, encoding='utf-8').read()
    s = re.sub(r'<url><loc>%s[^<]*</loc>.*?</url>' % re.escape(BASE + SECTION), '', s)
    urls = ''.join('<url><loc>%s</loc><lastmod>%s</lastmod></url>' % (u, LASTMOD)
                   for u in [BASE + SECTION] + [BASE + SECTION + r['slug'] + '/' for r in recipes])
    s = s.replace('</urlset>', urls + '</urlset>')
    open(sp, 'w', encoding='utf-8', newline='\n').write(s)
    print('built', len(recipes), 'recipes')


if __name__ == '__main__':
    main()
