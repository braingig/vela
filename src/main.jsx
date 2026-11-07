import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, useLocation, useSearchParams } from 'react-router-dom';
import { articles, image, portfolio, properties, questions } from './content';
import './styles.css';

const links = [
  ['Home', '/'], ['About', '/about'], ['Featured Properties', '/properties'],
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
  return <Link to="/" className="brand" aria-label="Maren Ellis home">
    <svg width="28" height="29" viewBox="0 0 28 29" aria-hidden="true"><path d="M1 1h8v27H1zM11 4l7 10-7 10zm8-3h8v27h-8l6-14z" fill="currentColor" /></svg>
    <span>Maren Ellis</span>
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
        {[links[2], links[1], links[5]].map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}
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
    <Photo name={photo} className="hero-photo" sizes="100vw" eager />
    <div className="hero-shade" />
    <div className="hero-content">
      <p className="eyebrow hero-rise" style={{ '--delay': '120ms' }}>{eyebrow}</p>
      <h1 aria-label={title}>{title.split(' ').map((word, index) => <span className="hero-word" key={index}><span className="hero-rise" style={{ '--delay': (190 + index * 65) + 'ms' }}>{word}</span></span>)}</h1>
      {subtitle && <p className="hero-subtitle hero-rise" style={{ '--delay': '340ms' }}>{subtitle}</p>}
      {home && <div className="hero-actions hero-rise" style={{ '--delay': '450ms' }}><Button to="/properties" variant="white">View Properties</Button><Button to="/contact" variant="outline">Let’s Connect</Button></div>}
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
  return <Reveal delay={index * 70} className="property-tile"><Link to={(item.status ? '/past-transactions/' : '/properties/') + item.slug} className="property-card">
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
    <Reveal className="service-grid">{services.map(([name, href, photo]) => <Link key={href} to={href} className="service-card"><Photo name={photo} /><span className="service-shade" /><span className="service-label">{name}<Icon name="diagonal" /></span></Link>)}</Reveal>
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
    <div className="approach-content container">
      <p className="eyebrow">The Maren Ellis Approach</p>
      <div className="approach-slide" key={active} aria-live="polite"><h2>{quote}</h2><p>{label}</p></div>
      <div className="slide-buttons"><button aria-label="Previous slide" onClick={() => setActive((active + approach.length - 1) % approach.length)}><Icon name="left" /></button><button aria-label="Next slide" onClick={() => setActive((active + 1) % approach.length)}><Icon name="arrow" /></button></div>
    </div>
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
    <Reveal className="faq-list">{questions.map(([question, answer], index) => <div className="faq-item" key={question}>
      <h3><button aria-expanded={active === index} aria-controls={'answer-' + index} onClick={() => setActive(active === index ? null : index)}>{question}<Icon name="down" /></button></h3>
      <div id={'answer-' + index} className={'faq-answer ' + (active === index ? 'expanded' : '')} aria-hidden={active !== index}><div><p>{answer}</p></div></div>
    </div>)}</Reveal>
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
      <div className="footer-top"><div><p className="eyebrow">California Real Estate</p><h2>Let’s talk about your next move.</h2></div><Button to="/contact" variant="outline">Get in Touch</Button></div>
      <div className="footer-grid"><div><Brand /><p>California Coast &amp; Wine Country</p></div>
        <div><h3>Explore</h3>{links.slice(1, 4).map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}</div>
        <div><h3>Resources</h3><Link to="/journal">Journal</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Maren Ellis Real Estate.</p><a href="#top">Back to top ↑</a></div>
    </div>
  </footer>;
}

function Home() {
  return <>
    <Hero home title="Maren Ellis" eyebrow="A place to call your own" subtitle="California Real Estate" />
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
    <p className="lede">{item.intro}</p>{item.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}
  </article><Closing /></>;
}

function Contact() {
  const [params] = useSearchParams();
  const property = properties.find(item => item.slug === params.get('property'));
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
    <Reveal><Title eyebrow={property ? 'Private showing' : 'Start the conversation'}>{property ? 'Request a Tour' : 'Tell Me What You Have in Mind'}</Title>
      {property && <p className="inquiry-property">{property.name} · {property.location}</p>}
      <form onSubmit={prepare}>
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>I’m interested in<select name="interest" defaultValue={property ? 'Private showing' : ''} required><option value="" disabled>Select an option</option><option>Buying</option><option>Selling</option><option>Private showing</option><option>Relocating</option></select></label>
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

const titles = { '/about': 'About', '/properties': 'Featured Properties', '/past-transactions': 'Past Transactions', '/journal': 'Journal', '/contact': 'Contact', '/privacy': 'Privacy' };

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
  else if (pathname === '/about') page = <><Hero title="About Maren" eyebrow="Get to know me" photo="hero" /><Bio full /><MarketBand /><Closing /></>;
  else if (pathname === '/contact') page = <Contact />;
  else if (pathname === '/privacy') page = <Privacy />;
  else page = <NotFound />;

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    const record = [...properties, ...portfolio, ...articles].find(item => item.slug === slug);
    const title = record?.name || record?.title || titles[pathname] || (pathname === '/' ? 'California Real Estate' : 'Page Not Found');
    document.title = pathname === '/' ? 'Maren Ellis | ' + title : title + ' | Maren Ellis';
  }, [pathname, slug]);

  return <div id="top"><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" key={pathname}>{page}</main><Footer /></div>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><App /></BrowserRouter>);
