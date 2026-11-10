import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { articles, image, neighborhoods, portfolio, properties } from '../src/content.js';

const html = await readFile('dist/index.html', 'utf8');
const siteUrl = process.env.VELA_PUBLIC_URL || 'https://maren-ellis-estates.braingigllc.chatgpt.site';
const routes = [
  ['about', 'About'], ['contact', 'Contact'], ['privacy', 'Privacy'], ['saved', 'Saved Homes'],
  ['properties', 'Properties', 'Browse sample homes in Carmel Highlands, Montecito, and Sonoma with an interactive map and filters.'],
  ['past-transactions', 'Past Transactions'], ['journal', 'Journal'],
  ['appraisal', 'Free Appraisal', 'Prepare a free, no-obligation home appraisal request with Vela Real Estate.'],
  ['neighborhoods', 'Neighborhoods', 'Explore local guides to Carmel Highlands, Montecito, and Sonoma.'],
  ...properties.map(item => ['properties/' + item.slug, item.name, item.details, item.image]),
  ...portfolio.map(item => ['past-transactions/' + item.slug, item.name, item.details, item.image]),
  ...articles.map(item => ['journal/' + item.slug, item.title]),
  ...neighborhoods.map(item => ['neighborhoods/' + item.slug, item.name + ' Neighborhood Guide', item.intro, item.photo]),
];

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

for (const [route, title, description, photo] of routes) {
  let page = html.replace(/<title>.*?<\/title>/, () => '<title>' + escape(title) + ' | Vela</title>');
  if (description) {
    page = page.replace(/<meta name="description"[^>]*>/, () => '<meta name="description" content="' + escape(description) + '" />');
  }
  if (photo) {
    const socialTags = [
      ['og:title', title + ' | Vela'],
      ['og:description', description],
      ['og:image', new URL(image(photo), siteUrl).href],
    ].map(([property, value]) => '<meta property="' + property + '" content="' + escape(value) + '" />');
    page = page.replace('</head>', () => '  ' + socialTags.join('\n    ') + '\n  </head>');
  }
  await mkdir('dist/' + route, { recursive: true });
  await writeFile('dist/' + route + '/index.html', page);
}
await writeFile('dist/404.html', html.replace(/<title>.*?<\/title>/, '<title>Page Not Found | Vela</title>'));
