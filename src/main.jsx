import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, useLocation, useSearchParams } from 'react-router-dom';
import { articles, image, portfolio, properties, questions } from './content';
import './styles.css';

const links = [
  ['Home', '/'], ['Buy', '/buy'], ['About', '/about'], ['Featured Properties', '/properties'],
  ['Past Transactions', '/past-transactions'], ['Journal', '/journal'], ['Let’s Connect', '/contact'],
];

function Icon({ name, size = 22 }) {
  const paths = {
    arrow: 'M4 12h15m-6-6 6 6-6 6',
    diagonal: 'M5 19 19 5M7 5h12v12',
    down: 'm5 9 7 7 7-7',
    double: 'm3 7 9 9 9-9M3 13l9 9 9-9',
    left: 'M20 12H5m6-6-6 6 6 6',
    bed: 'M3 18v-6m18 6v-6M3 16h18M5 12V7h14v5M3 12h18M12 7v5',
    bath: 'M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2Zm3 7-1 2m13-2 1 2M6 12V6a2 2 0 0 1 4 0v1',
    car: 'M4 17v3m16-3v3M3 12l2-5h14l2 5v5H3v-5Zm0 0h18M7 15h1m8 0h1',
    area: 'M4 4h16v16H4zM7 17l10-10m-5 0h5v5',
    mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function Brand() {
  return <Link to="/" className="brand" aria-label="Vela home">
    <svg width="28" height="29" viewBox="0 0 28 29" aria-hidden="true"><path d="M1 2h8l8 19-4 7ZM21 2h6L18 19l-2-5Z" fill="currentColor" /></svg>
    <span>Vela</span>
  </Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const panel = dialog.current;
    if (open && !panel.open) panel.showModal();
    if (!open && panel.open) panel.close();
    if (!open) return;
    document.body.classList.add('menu-open');
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  function closeMenu() {
    setOpen(false);
    trigger.current?.focus();
  }

  return <>
    <header className="header">
      <Brand />
      <nav aria-label="Primary" className="top-links">
        {links.filter(([, href]) => ['/buy', '/about', '/properties', '/contact'].includes(href)).map(([name, href]) => <Link key={href} to={href} aria-current={location.pathname === href ? 'page' : undefined}>{name}</Link>)}
      </nav>
      <button ref={trigger} type="button" className="menu-toggle" aria-label="Open menu" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>
    </header>
    <dialog ref={dialog} className="menu-panel" id="site-menu" aria-label="Site menu" onCancel={event => { event.preventDefault(); closeMenu(); }}>
      <div className="menu-head"><Brand /><button className="menu-toggle menu-close" aria-label="Close menu" onClick={closeMenu}><span /><span /></button></div>
      <div className="menu-body">
        <nav aria-label="All pages">{links.map(([name, href], index) => <Link key={href} to={href} aria-current={location.pathname === href ? 'page' : undefined} style={{ '--i': index }} onClick={() => setOpen(false)}>{name}</Link>)}</nav>
        <p className="menu-note">California Coast & Wine Country</p>
      </div>
    </dialog>
  </>;
}

function Button({ to, children, variant = 'olive' }) {
  return <Link className={'button ' + variant} to={to}><span>{children}</span></Link>;
}

function Photo({ name, alt = '', className, eager = false, sizes = '(max-width: 640px) 100vw, 50vw' }) {
  return <img className={className} src={image(name)} srcSet={image(name, true) + ' 768w, ' + image(name) + ' 1500w'} sizes={sizes} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" />;
}

function Title({ eyebrow, children, level = 2, className = '' }) {
  const Tag = 'h' + level;
  return <div className={'section-title ' + className}>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <Tag>{children}</Tag>
  </div>;
}

function Hero({ title, eyebrow, photo = 'hero', subtitle, home = false }) {
  return <section className={'hero ' + (home ? 'hero-home' : 'hero-inner')}>
    <div className="hero-image-layer"><Photo name={photo} className="hero-photo" sizes="100vw" eager /></div>
    <div className="hero-shade" />
    <div className="hero-content">
      <p className="eyebrow hero-rise" style={{ '--delay': '120ms' }}>{eyebrow}</p>
      <h1 aria-label={title}>{title.split(' ').map((word, index) => <span className="hero-word" key={index}><span className="hero-rise" style={{ '--delay': (190 + index * 65) + 'ms' }}>{word}</span></span>)}</h1>
      {subtitle && <p className="hero-subtitle hero-rise" style={{ '--delay': '340ms' }}>{subtitle}</p>}
      {home && <div className="hero-actions hero-rise" style={{ '--delay': '450ms' }}><Button to="/buy" variant="white">Buy a Home</Button><Button to="/contact" variant="outline">Let’s Connect</Button></div>}
    </div>
    {home && <a href="#services" className="hero-down" aria-label="Explore our services"><Icon name="double" size={29} /></a>}
  </section>;
}

function Reveal({ children, className = '', delay = 0 }) {
  const node = useRef(null);
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window)) { setReady(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect(); }
    }, { rootMargin: '0px 0px -45px 0px' });
    observer.observe(node.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={node} className={'reveal ' + (ready ? '' : 'pending ') + className} style={{ '--reveal-delay': delay + 'ms' }}>{children}</div>;
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US');

function Specs({ item }) {
  const specs = [['bed', item.beds, 'bedrooms'], ['bath', item.baths, 'bathrooms'], ['car', item.garage, 'garage spaces'], ['area', number.format(item.area), 'sq ft']];
  return <ul className="specs" aria-label="Property features">{specs.map(([icon, value, label]) =>
    <li key={icon}><Icon name={icon} size={19} /><span>{value}{icon === 'area' ? ' SQ FT' : <span className="sr-only"> {label}</span>}</span></li>)}</ul>;
}

function PropertyCard({ item, index = 0 }) {
  return <Reveal delay={index * 85} className="property-tile"><Link to={(item.status ? '/past-transactions/' : '/properties/') + item.slug} className="property-card">
    <div className="property-image"><Photo name={item.image} alt={item.alt} /><span className="status">{item.status || 'For Sale'} <i /></span><span className="card-arrow"><Icon name="diagonal" /></span></div>
    <div className="property-copy"><h3>{item.name}</h3><p>{item.location}</p><Specs item={item} /><strong>{money.format(item.price)}</strong></div>
  </Link></Reveal>;
}

function PropertyGrid({ items }) {
  return <div className="property-grid">{items.map((item, index) => <PropertyCard key={item.slug} item={item} index={index} />)}</div>;
}

function Services() {
  const services = [
    ['Our Properties', '/properties', 'carmel'],
    ['Past Transactions', '/past-transactions', 'montecito'],
    ['Let’s Connect', '/contact', 'sonoma'],
  ];
  return <section className="section container" id="services">
    <Reveal><Title eyebrow="How can we help?">Find Your Next Move</Title></Reveal>
    <div className="service-grid">{services.map(([name, href, photo], index) =>
      <Reveal key={href} className="service-tile" delay={index * 85}>
        <Link to={href} className="service-card"><Photo name={photo} /><span className="service-shade" /><span className="service-label">{name}<Icon name="diagonal" /></span></Link>
      </Reveal>
    )}</div>
  </section>;
}

function Bio({ full = false }) {
  return <section className={'section container bio ' + (full ? 'bio-full' : '')}>
    <Reveal className="bio-copy"><Title eyebrow="Meet your agent">About Maren</Title>
      <p>I’m Maren Ellis. I help buyers and sellers find their footing in some of California’s most distinctive communities, from the Carmel coast to Sonoma wine country.</p>
      <p>My approach starts with listening. I want to understand how you live now, what you hope will change, and what makes a place feel like yours.</p>
      {full && <p>For sellers, that means looking closely at how the home is presented and what buyers need to know. For buyers, it means taking the time to explore the neighborhoods and homes that fit your day-to-day life.</p>}
      <Button to={full ? '/contact' : '/about'}>{full ? 'Let’s Connect' : 'Learn More'}</Button>
    </Reveal>
    <Reveal className="bio-image"><Photo name="agent" alt="Maren Ellis in a sunlit interior" /></Reveal>
  </section>;
}

function MarketBand() {
  return <section className="image-band markets">
    <Photo name="carmel" sizes="100vw" /><div className="band-shade" />
    <Reveal className="container band-content">
      <Title eyebrow="Where I work">From Coast to Wine Country</Title>
      <div className="market-grid">{[['01','Carmel'], ['02','Montecito'], ['03','Sonoma']].map(([index, name]) => <div key={name}><span>{index}</span><p>{name}</p></div>)}</div>
    </Reveal>
  </section>;
}

const approach = [
  ['Start with the way you want to live.', 'For buyers', 'carmel'],
  ['Give the details that make your home special room to breathe.', 'For sellers', 'montecito'],
  ['Spend time in the neighborhood before deciding where to land.', 'For relocations', 'sonoma'],
];

function Approach() {
  const [active, setActive] = useState(0);
  const [quote, label, photo] = approach[active];
  return <section className="approach">
    <Photo key={photo} name={photo} className="approach-photo" sizes="100vw" /><div className="band-shade" />
    <Reveal className="approach-content container">
      <p className="eyebrow">The Vela Approach</p>
      <div className="approach-slide" key={active} aria-live="polite"><h2>{quote}</h2><p>{label}</p></div>
      <div className="slide-buttons"><button aria-label="Previous slide" onClick={() => setActive((active + approach.length - 1) % approach.length)}><Icon name="left" /></button><button aria-label="Next slide" onClick={() => setActive((active + 1) % approach.length)}><Icon name="arrow" /></button></div>
    </Reveal>
  </section>;
}

function JournalGrid() {
  return <div className="journal-grid">{articles.map((item, index) => <Reveal key={item.slug} delay={index * 70}><Link className="journal-card" to={'/journal/' + item.slug}>
    <div className="journal-image"><Photo name={item.image} /><span className="card-arrow"><Icon name="diagonal" /></span></div>
    <p>{item.date}</p><h3>{item.title}</h3>
  </Link></Reveal>)}</div>;
}

function FAQ() {
  const [active, setActive] = useState(null);
  return <section className="section container faq">
    <Reveal><Title eyebrow="Good to know">Frequently<br /> Asked Questions</Title></Reveal>
    <div className="faq-list">{questions.map(([question, answer], index) => <Reveal className="faq-item" key={question}>
      <h3><button aria-expanded={active === index} aria-controls={'answer-' + index} onClick={() => setActive(active === index ? null : index)}>{question}<Icon name="down" /></button></h3>
      <div id={'answer-' + index} className={'faq-answer ' + (active === index ? 'expanded' : '')} aria-hidden={active !== index}><div><p>{answer}</p></div></div>
    </Reveal>)}</div>
  </section>;
}

function Closing({ property }) {
  return <section className="image-band closing">
    <Photo name={property?.image || 'hero'} sizes="100vw" /><div className="band-shade" />
    <Reveal className="container band-content"><Title eyebrow={property ? 'See it in person' : 'Your next chapter'}>{property ? 'Come Take a Closer Look' : 'Make Your Next Move'}</Title>
      <div className="hero-actions"><Button to={property ? '/contact?property=' + property.slug : '/contact'} variant="white">{property ? 'Request a Tour' : 'Let’s Connect'}</Button>
      {!property && <Button to="/properties" variant="outline">View Properties</Button>}</div>
    </Reveal>
  </section>;
}

function Footer() {
  return <footer className="footer">
    <div className="container">
      <Reveal className="footer-top"><div><p className="eyebrow">California Real Estate</p><h2>Let’s talk about your next move.</h2></div><Button to="/contact" variant="outline">Get in Touch</Button></Reveal>
      <Reveal className="footer-grid"><div><Brand /><p>California Coast &amp; Wine Country</p></div>
        <div><h3>Explore</h3>{links.slice(1, 5).map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}</div>
        <div><h3>Resources</h3><Link to="/journal">Journal</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link></div>
      </Reveal>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Vela Real Estate.</p><a href="#top">Back to top ↑</a></div>
    </div>
  </footer>;
}

function Home() {
  return <>
    <Hero home title="Vela" eyebrow="A place to call your own" subtitle="California Real Estate" />
    <Services />
    <Bio />
    <MarketBand />
    <section className="section container"><Reveal><Title eyebrow="Selected for you">Featured Listings</Title></Reveal><PropertyGrid items={properties} /><div className="center"><Button to="/properties">View All</Button></div></section>
    <Approach />
    <section className="section muted"><div className="container"><Reveal><Title eyebrow="Notes from the field">The Real Estate Journal</Title></Reveal><JournalGrid /><div className="center"><Button to="/journal">View All</Button></div></div></section>
    <FAQ />
    <Closing />
  </>;
}

function Listings({ sold = false }) {
  return <><Hero title={sold ? 'Past Transactions' : 'Featured Properties'} eyebrow={sold ? 'A look back' : 'A place to call your own'} photo={sold ? 'sonoma' : 'carmel'} />
    <section className="section container"><Reveal><Title eyebrow={sold ? 'Property portfolio' : 'Selected for you'}>{sold ? 'Recently Sold' : 'Homes for Sale'}</Title></Reveal><PropertyGrid items={sold ? portfolio : properties} /></section><Closing /></>;
}

const buyerSteps = [
  ['Define your search', 'Decide which neighborhoods, features, and price range fit the way you want to live.'],
  ['Visit your shortlist', 'Open a listing to see the details, then request a private tour of any home you’d like to visit.'],
  ['Plan your next move', 'Talk through your timing, questions, and what you’d want to know before making an offer.'],
];

function Buy() {
  const [query, setQuery] = useState('');
  const [budget, setBudget] = useState('');
  const search = query.trim().toLowerCase();
  const matches = properties.filter(item =>
    (item.name + ' ' + item.location).toLowerCase().includes(search) &&
    (!budget || item.price <= Number(budget))
  );

  return <>
    <Hero title="Buy a Home" eyebrow="California coast & wine country" photo="carmel" />
    <section className="section container">
      <Reveal><Title eyebrow="Explore available properties">Find Your Next Home</Title></Reveal>
      <Reveal className="buyer-filters">
        <label>Search by name or location<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Carmel or Sonoma" /></label>
        <label>Maximum price<select value={budget} onChange={event => setBudget(event.target.value)}>
          <option value="">Any price</option>
          {[5000000, 5500000, 6000000, 7000000].map(price => <option value={price} key={price}>{money.format(price)}</option>)}
        </select></label>
        <button className="button olive" type="button" onClick={() => { setQuery(''); setBudget(''); }}>Clear Filters</button>
      </Reveal>
      <p className="buyer-results" role="status">{matches.length === 1 ? '1 home found' : matches.length + ' homes found'}</p>
      {matches.length > 0 ? <PropertyGrid items={matches} /> : <p className="buyer-empty">No homes match those filters. Try a different location or price range.</p>}
    </section>
    <section className="section muted">
      <div className="container">
        <Reveal><Title eyebrow="The buying process">From Search to Showing</Title></Reveal>
        <ol className="buyer-steps">
          {buyerSteps.map(([title, description], index) => <li key={title}>
            <Reveal delay={index * 85}><p className="eyebrow">Step 0{index + 1}</p><h3>{title}</h3><p>{description}</p></Reveal>
          </li>)}
        </ol>
        <Reveal className="center"><Button to="/contact?interest=buying">Start a Buyer Inquiry</Button></Reveal>
      </div>
    </section>
  </>;
}

function Gallery({ item }) {
  const [active, setActive] = useState(0);
  const photos = [[item.image, item.alt], [item.interior, 'Living spaces inside ' + item.name]];
  const [photo, alt] = photos[active];
  const step = () => setActive(index => (index + 1) % photos.length);

  return <section className="container detail-gallery" aria-label={item.name + ' photo gallery'}>
    <Reveal>
      <figure>
        <div className="gallery-image"><Photo name={photo} alt={alt} key={photo} sizes="90vw" /></div>
        <figcaption>
          <button aria-label="Previous photo" onClick={step}><Icon name="left" /></button>
          <span aria-live="polite">{active === 0 ? 'Exterior' : 'Interior'} · {active + 1} of {photos.length}</span>
          <button aria-label="Next photo" onClick={step}><Icon name="arrow" /></button>
        </figcaption>
      </figure>
    </Reveal>
  </section>;
}

function ListingDetail({ slug, sold = false }) {
  const item = (sold ? portfolio : properties).find(property => property.slug === slug);
  if (!item) return <NotFound />;
  return <><Hero title={item.name} eyebrow={item.status || 'For Sale'} photo={item.image} />
    <section className="section container detail"><Reveal>
      <Link className="back-link" to={sold ? '/past-transactions' : '/properties'}><Icon name="left" size={17} /> All {sold ? 'transactions' : 'properties'}</Link>
      <Title eyebrow={item.location}>{money.format(item.price)}</Title>
      <p className="lede">{item.details}</p><Specs item={item} />
      <div className="detail-feature"><h3>Property highlights</h3><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div>
    </Reveal><Reveal className="detail-side"><Photo name="agent" alt="Maren Ellis" /><h3>Maren Ellis</h3><p>California Real Estate</p><Button to={sold ? '/contact' : '/contact?property=' + item.slug}>{sold ? 'Let’s Connect' : 'Request a Tour'}</Button></Reveal></section>
    {item.interior && <Gallery item={item} />}
    <Closing property={sold ? undefined : item} /></>;
}

function Journal() {
  return <><Hero title="The Journal" eyebrow="Real estate notes" photo="sonoma" /><section className="section container"><Reveal><Title eyebrow="For buyers and sellers">Guides &amp; Perspectives</Title></Reveal><JournalGrid /></section><Closing /></>;
}

function Article({ slug }) {
  const item = articles.find(article => article.slug === slug);
  if (!item) return <NotFound />;
  return <><Hero title={item.title} eyebrow={item.date} photo={item.image} /><article className="section reading container">
    <Link className="back-link" to="/journal"><Icon name="left" size={17} /> Back to the journal</Link>
    <Reveal><p className="lede">{item.intro}</p></Reveal>
    {item.sections.map(([heading, body]) => <section key={heading}><Reveal><h2>{heading}</h2><p>{body}</p></Reveal></section>)}
  </article><Closing /></>;
}

function Contact() {
  const [params] = useSearchParams();
  const property = properties.find(item => item.slug === params.get('property'));
  const buying = params.get('interest') === 'buying';
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const draftRef = useRef(null);

  function prepare(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setCopied(false);
    setDraft([
      property ? 'Tour inquiry: ' + property.name : 'Real estate inquiry',
      'Name: ' + values.get('name'),
      'Email: ' + values.get('email'),
      'Interest: ' + values.get('interest'),
      '',
      values.get('message'),
    ].join('\n'));
  }

  useEffect(() => { if (draft) draftRef.current?.focus(); }, [draft]);

  async function copy() {
    try { await navigator.clipboard.writeText(draft); setCopied(true); }
    catch { draftRef.current?.select(); }
  }

  return <><Hero title="Get in Touch" eyebrow="Let’s connect" photo="montecito" /><section className="section container contact">
    <Reveal><Title eyebrow={property ? 'Private showing' : 'Start the conversation'}>{property ? 'Request a Tour' : buying ? 'Tell Me About Your Home Search' : 'Tell Me What You Have in Mind'}</Title>
      {property && <p className="inquiry-property">{property.name} · {property.location}</p>}
      <form onSubmit={prepare}>
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>I’m interested in<select name="interest" defaultValue={property ? 'Private showing' : buying ? 'Buying' : ''} required><option value="" disabled>Select an option</option><option>Buying</option><option>Selling</option><option>Private showing</option><option>Relocating</option></select></label>
        <label>{property ? 'Preferred times or questions' : 'Your message'}<textarea name="message" rows="4" required /></label>
        <button className="button olive" type="submit">Prepare Inquiry</button>
      </form>
      {draft && <div className="draft"><p>Your inquiry is ready to copy.</p><label>Inquiry draft<textarea ref={draftRef} rows="7" readOnly value={draft} /></label><button className="button olive" onClick={copy}>{copied ? 'Copied' : 'Copy Inquiry'}</button><span className="sr-only" role="status">{copied ? 'Inquiry copied' : 'Inquiry draft ready'}</span></div>}
    </Reveal>
    <Reveal className="contact-image"><Photo name="agent" alt="Maren Ellis" /></Reveal>
  </section></>;
}

function Privacy() {
  return <><Hero title="Privacy" eyebrow="Website information" /><section className="section container reading"><p>The inquiry form prepares a draft in your browser. Your name, email, and message stay in the page until you copy them or close it.</p></section></>;
}

function NotFound() {
  return <><Hero title="Page Not Found" eyebrow="404" /><section className="section container center"><Button to="/">Back to Home</Button></section></>;
}

const titles = { '/buy': 'Buy a Home', '/about': 'About', '/properties': 'Featured Properties', '/past-transactions': 'Past Transactions', '/journal': 'Journal', '/contact': 'Contact', '/privacy': 'Privacy' };

function App() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const { hash } = location;
  const parts = pathname.split('/').filter(Boolean);
  const slug = parts[1];
  let page;
  if (parts.length === 0) page = <Home />;
  else if (parts.length > 2) page = <NotFound />;
  else if (parts[0] === 'properties') page = slug ? <ListingDetail slug={slug} /> : <Listings />;
  else if (parts[0] === 'past-transactions') page = slug ? <ListingDetail slug={slug} sold /> : <Listings sold />;
  else if (parts[0] === 'journal') page = slug ? <Article slug={slug} /> : <Journal />;
  else if (pathname === '/buy') page = <Buy />;
  else if (pathname === '/about') page = <><Hero title="About Vela" eyebrow="Get to know us" photo="hero" /><Bio full /><MarketBand /><Closing /></>;
  else if (pathname === '/contact') page = <Contact key={location.search} />;
  else if (pathname === '/privacy') page = <Privacy />;
  else page = <NotFound />;

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    const record = [...properties, ...portfolio, ...articles].find(item => item.slug === slug);
    const title = record?.name || record?.title || titles[pathname] || (pathname === '/' ? 'California Real Estate' : 'Page Not Found');
    document.title = pathname === '/' ? 'Vela | ' + title : title + ' | Vela';
  }, [pathname, slug]);

  return <div id="top"><div className="scroll-progress" aria-hidden="true" /><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" key={pathname}>{page}</main><Footer /></div>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
