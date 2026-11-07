import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { articles, portfolio, properties } from '../src/content.js';

const html = await readFile('dist/index.html', 'utf8');
const routes = [
  ['about', 'About'], ['contact', 'Contact'], ['privacy', 'Privacy'],
  ['properties', 'Featured Properties'], ['past-transactions', 'Past Transactions'], ['journal', 'Journal'],
  ...properties.map(item => ['properties/' + item.slug, item.name]),
  ...portfolio.map(item => ['past-transactions/' + item.slug, item.name]),
  ...articles.map(item => ['journal/' + item.slug, item.title]),
];

for (const [route, title] of routes) {
  await mkdir('dist/' + route, { recursive: true });
  await writeFile('dist/' + route + '/index.html', html.replace(/<title>.*?<\/title>/, '<title>' + title.replaceAll('&', '&amp;') + ' | Maren Ellis</title>'));
}
await writeFile('dist/404.html', html.replace(/<title>.*?<\/title>/, '<title>Page Not Found | Maren Ellis</title>'));
