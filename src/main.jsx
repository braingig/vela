import React, { createContext, lazy, Suspense, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, useLocation, useSearchParams } from 'react-router-dom';
import { articles, image, neighborhoodPropertiesLink, neighborhoods, portfolio, properties, questions } from './content';
import './styles.css';

const PropertyMap = lazy(() => import('./property-map'));
const links = [
  ['Home', '/'], ['About', '/about'], ['Properties', '/properties'],
  ['Past Transactions', '/past-transactions'], ['Neighborhoods', '/neighborhoods'], ['Journal', '/journal'],
  ['Free Appraisal', '/appraisal'], ['Saved Homes', '/saved'], ['Let’s Connect', '/contact'],
];

const savedHomesKey = 'vela.saved-homes';
const SavedHomesContext = createContext(null);

function readSavedHomes() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(savedHomesKey));
    return Array.isArray(saved) ? properties.filter(item => saved.includes(item.slug)).map(item => item.slug) : [];
  } catch {
    return [];
  }
}

function SavedHomesProvider({ children }) {
  const [saved, setSaved] = useState(readSavedHomes);

  useEffect(() => {
    try {
      window.localStorage.setItem(savedHomesKey, JSON.stringify(saved));
    } catch {
      // The shortlist is still available for this visit when storage is disabled.
    }
  }, [saved]);

  function toggle(slug) {
    setSaved(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  }

  return <SavedHomesContext.Provider value={{ saved, toggle }}>{children}</SavedHomesContext.Provider>;
}

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
    heart: 'M20.8 8.7c0 4.1-8.8 9.8-8.8 9.8S3.2 12.8 3.2 8.7a4.7 4.7 0 0 1 8.8-2.1 4.7 4.7 0 0 1 8.8 2.1Z',
    pin: 'M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 0-6 0 3 3 0 0 0 6 0Z',
    search: 'M15.5 15.5 21 21M17.5 10.5a7 7 0 1 0-14 0 7 7 0 0 0 14 0Z',
    filter: 'M3 6h5m4 0h9M3 12h11m4 0h3M3 18h2m4 0h12M8 4v4m6 2v4M5 16v4',
    link: 'M10 13a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2m3 5a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2',
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
  const { saved } = useContext(SavedHomesContext);
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
    <header className={'header' + (/^\/properties\/?$/.test(location.pathname) ? ' header-light' : '')}>
      <Brand />
      <nav aria-label="Primary" className="top-links">
        {[links[2], links[4], links[6]].map(([name, href]) => <Link key={href} to={href}>{name}</Link>)}
      </nav>
      <Link className="saved-nav" to="/saved" aria-current={location.pathname === '/saved' ? 'page' : undefined}>
        <Icon name="heart" size={19} /><span>Saved</span>{saved.length > 0 && <span className="saved-count">{saved.length}</span>}
      </Link>
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
      {home && <div className="hero-actions hero-rise" style={{ '--delay': '450ms' }}><Button to="/appraisal" variant="white">Request a Free Appraisal <Icon name="arrow" size={17} /></Button><Button to="/properties" variant="outline">Browse Properties</Button></div>}
    </div>
    {home && <a href="#seller-services" className="hero-down" aria-label="Explore seller services"><Icon name="double" size={29} /></a>}
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

function SaveButton({ item, compact = false }) {
  const { saved, toggle } = useContext(SavedHomesContext);
  const active = saved.includes(item.slug);
  return <button
    type="button"
    className={'save-home' + (compact ? ' save-home-compact' : '')}
    aria-label={'Save home: ' + item.name}
    aria-pressed={active}
    onClick={() => toggle(item.slug)}
  >
    <Icon name="heart" size={20} />{!compact && <span>Save home</span>}
  </button>;
}

function PropertyCard({ item, index = 0, onShowMap, selected }) {
  return <Reveal delay={Math.min(index, 3) * 85} className={'property-tile' + (selected ? ' property-tile-selected' : '')}><Link to={(item.status ? '/past-transactions/' : '/properties/') + item.slug} className="property-card">
    <div className="property-image"><Photo name={item.image} alt={item.alt} /><span className="status">{item.status || 'For Sale'} <i /></span><span className="card-arrow"><Icon name="diagonal" /></span></div>
    <div className="property-copy"><h3>{item.name}</h3><p>{item.location}</p><Specs item={item} /><strong>{money.format(item.price)}</strong></div>
  </Link>{!item.status && <SaveButton item={item} compact />}
    {onShowMap && <button type="button" className="card-map-button" onClick={() => onShowMap(item.slug)} aria-label={'Show on map: ' + item.name}><Icon name="pin" size={16} /> Map</button>}
  </Reveal>;
}

function PropertyGrid({ items, onShowMap, selected }) {
  return <div className="property-grid">{items.map((item, index) => <PropertyCard key={item.slug} item={item} index={index} onShowMap={onShowMap} selected={selected === item.slug} />)}</div>;
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
      <div className="market-grid">{neighborhoods.map((area, index) => <div key={area.slug}><Link to={'/neighborhoods/' + area.slug}><span>0{index + 1}</span><p>{area.name} <Icon name="diagonal" size={17} /></p></Link></div>)}</div>
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

function Closing({ property, appraisal = false }) {
  return <section className="image-band closing">
    <Photo name={property?.image || 'hero'} sizes="100vw" /><div className="band-shade" />
    <Reveal className="container band-content"><Title eyebrow={property ? 'See it in person' : 'Your next chapter'}>{property ? 'Come Take a Closer Look' : 'Make Your Next Move'}</Title>
      <div className="hero-actions"><Button to={property ? '/contact?property=' + property.slug : appraisal ? '/appraisal' : '/contact'} variant="white">{property ? 'Request a Tour' : appraisal ? 'Request a Free Appraisal' : 'Let’s Connect'}</Button>
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
        <div><h3>Resources</h3><Link to="/appraisal">Free Appraisal</Link><Link to="/journal">Journal</Link><Link to="/saved">Saved Homes</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link></div>
      </Reveal>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Vela Real Estate.</p><a href="#top">Back to top ↑</a></div>
    </div>
  </footer>;
}

function SellerServices() {
  return <section className="section muted" id="seller-services">
    <div className="container seller-grid">
      <Reveal className="seller-photo"><Photo name="villaInterior" alt="Warm, neutral furniture in a sunlit living room" /></Reveal>
      <Reveal className="seller-copy">
        <Title eyebrow="For sellers">Free home styling</Title>
        <p>Show buyers how your home lives. We’ll walk through the rooms with you and suggest simple changes to layout, lighting, and furnishings before photography.</p>
        <Link className="back-link" to="/journal/prepare-to-list">See how to prepare for listing photos <Icon name="arrow" size={17} /></Link>
        <Button to="/appraisal">Request a Free Appraisal</Button>
      </Reveal>
    </div>
  </section>;
}

function SellerStories() {
  return <section className="section container seller-stories">
    <Reveal><Title eyebrow="Seller experiences">What the process can feel like</Title></Reveal>
    <div className="story-grid">
      <Reveal><figure><blockquote>“The appraisal helped us decide when to sell. We left the first meeting with a much clearer idea of what to do next.”</blockquote><figcaption>Example testimonial · Appraisal</figcaption></figure></Reveal>
      <Reveal><figure><blockquote>“A few thoughtful changes made the rooms feel more inviting. When the photos came back, the house still felt like ours.”</blockquote><figcaption>Example testimonial · Home styling</figcaption></figure></Reveal>
    </div>
  </section>;
}

function Home() {
  return <>
    <Hero home title="What’s your home worth?" eyebrow="California Coast & Wine Country" subtitle="Start with a free, no-obligation appraisal and get a clearer picture of your next move." />
    <SellerServices />
    <SellerStories />
    <Services />
    <Bio />
    <MarketBand />
    <section className="section container"><Reveal><Title eyebrow="Selected for you">Explore Properties</Title></Reveal><PropertyGrid items={properties.slice(0, 3)} /><div className="center"><Button to="/properties">View All Properties</Button></div></section>
    <Approach />
    <section className="section muted"><div className="container"><Reveal><Title eyebrow="Notes from the field">The Real Estate Journal</Title></Reveal><JournalGrid /><div className="center"><Button to="/journal">View All</Button></div></div></section>
    <FAQ />
    <Closing appraisal />
  </>;
}

function SoldListings() {
  return <><Hero title="Past Transactions" eyebrow="A look back" photo="sonoma" />
    <section className="section container"><Reveal><Title eyebrow="Property portfolio">Recently Sold</Title></Reveal><PropertyGrid items={portfolio} /></section><Closing /></>;
}

const filterOptions = {
  beds: ['2', '3', '4', '5'].map(value => [value, value + '+ beds']),
  price: [2000000, 3000000, 4000000, 5000000, 6000000, 7500000].map(value => [String(value), money.format(value)]),
  baths: ['2', '3', '4', '5'].map(value => [value, value + '+ baths']),
  area: ['2000', '3000', '4000', '5000'].map(value => [value, number.format(value) + '+ sq ft']),
  style: [...new Set(properties.map(item => item.style))].sort().map(value => [value, value]),
  sort: [['price-asc', 'Price, low to high'], ['price-desc', 'Price, high to low'], ['area-desc', 'Largest first']],
};

function FilterSelect({ name, label, placeholder, value, onChange }) {
  return <div className="filter-field">
    <label htmlFor={'listing-' + name}>{label}</label>
    <select id={'listing-' + name} value={value} onChange={event => onChange(name, event.target.value)}>
      <option value="">{placeholder}</option>
      {filterOptions[name].map(([key, text]) => <option key={key} value={key}>{text}</option>)}
    </select>
  </div>;
}

function PropertySearch() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState('list');
  const [mapArea, setMapArea] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const query = params.get('q') || '';
  const location = neighborhoods.find(area => area.location === params.get('location'))?.location || '';
  const validOption = key => filterOptions[key].find(([value]) => value === params.get(key))?.[0] || '';
  const beds = validOption('beds');
  const price = validOption('price');
  const baths = validOption('baths');
  const area = validOption('area');
  const style = validOption('style');
  const sort = validOption('sort');
  const extraFilters = [baths, area, style].filter(Boolean).length;
  const hasFilters = Boolean(query || location || beds || price || extraFilters || sort || mapArea);
  const matching = useMemo(() => {
    const search = query.trim().toLowerCase();
    return properties.filter(item =>
      (!location || item.location === location) &&
      (!style || item.style === style) &&
      (!price || item.price <= Number(price)) &&
      item.beds >= Number(beds) && item.baths >= Number(baths) && item.area >= Number(area) &&
      [item.name, item.location, item.style, ...item.features].join(' ').toLowerCase().includes(search)
    );
  }, [query, location, beds, price, baths, area, style]);
  const items = matching.filter(item => !mapArea || mapArea.contains(item.coordinates));
  if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  if (sort === 'area-desc') items.sort((a, b) => b.area - a.area);

  function updateFilter(key, value) {
    // Read the current URL in case a previous filter change is still rendering.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === 'location') setMapArea(null);
    setParams(next, { replace: true });
  }

  function resetFilters() {
    const next = new URLSearchParams(window.location.search);
    for (const key of ['q', 'location', ...Object.keys(filterOptions)]) next.delete(key);
    setMapArea(null);
    setSelectedSlug(null);
    setParams(next, { replace: true });
  }

  function showOnMap(slug) {
    setSelectedSlug(slug);
    setView('map');
  }

  return <div className="property-explorer">
    <div className="explorer-intro container"><p className="eyebrow">California Coast & Wine Country</p><h1>Properties</h1><p>Explore homes from the Pacific coast to Sonoma wine country.</p></div>
    <div className="container explorer-content">
      <div className="explorer-filters" role="search" aria-label="Find a property">
        <div className="filter-bar">
          <label className="explorer-search"><Icon name="search" size={20} /><span className="sr-only">Search homes</span><input type="search" value={query} placeholder="Search homes or features" onChange={event => updateFilter('q', event.target.value)} /></label>
          <FilterSelect name="beds" label="Bedrooms" placeholder="Any beds" value={beds} onChange={updateFilter} />
          <FilterSelect name="price" label="Max price" placeholder="Any price" value={price} onChange={updateFilter} />
          <FilterSelect name="sort" label="Sort by" placeholder="Recommended" value={sort} onChange={updateFilter} />
        </div>
        <details className="extra-filters">
          <summary><Icon name="filter" size={18} /> More filters{extraFilters ? ' (' + extraFilters + ')' : ''}</summary>
          <div className="extra-filter-fields">
            <FilterSelect name="baths" label="Bathrooms" placeholder="Any bathrooms" value={baths} onChange={updateFilter} />
            <FilterSelect name="area" label="Interior area" placeholder="Any size" value={area} onChange={updateFilter} />
            <FilterSelect name="style" label="Architecture" placeholder="Any style" value={style} onChange={updateFilter} />
          </div>
        </details>
        <div className="location-filters" role="group" aria-label="Location">
          <button type="button" aria-pressed={!location} onClick={() => updateFilter('location', '')}>All locations</button>
          {neighborhoods.map(item => <button key={item.slug} type="button" aria-pressed={location === item.location} onClick={() => updateFilter('location', item.location)}><Icon name="pin" size={15} /> {item.name}</button>)}
        </div>
      </div>
      <div className="explorer-results">
        <p role="status"><strong>{items.length} {items.length === 1 ? 'property' : 'properties'}</strong>{mapArea ? ' in this map area' : ' · Sample listings'}</p>
        {hasFilters && <button className="text-button" type="button" onClick={resetFilters}>Reset filters</button>}
        <div className="explorer-view" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
          <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Map</button>
        </div>
      </div>
      <div className="explorer-split" data-view={view}>
        <section className="explorer-list" aria-label="Property results">
          {items.length > 0 ? <PropertyGrid items={items} onShowMap={showOnMap} selected={selectedSlug} /> : <div className="listing-empty"><h2>No matching properties</h2><p>Try widening your search or resetting the filters.</p></div>}
        </section>
        <Suspense fallback={<p className="map-pane map-note" role="status">Loading map…</p>}>
          <PropertyMap items={items} fitItems={matching} selected={items.find(item => item.slug === selectedSlug)} onSelect={setSelectedSlug} onSearchArea={setMapArea} areaActive={Boolean(mapArea)} />
        </Suspense>
      </div>
    </div>
  </div>;
}

const comparisonRows = [
  ['Location', item => item.location],
  ['Asking price', item => money.format(item.price)],
  ['Bedrooms', item => item.beds],
  ['Bathrooms', item => item.baths],
  ['Interior area', item => number.format(item.area) + ' sq ft'],
  ['Garage spaces', item => item.garage],
  ['Architecture', item => item.style],
];

function SavedHomes() {
  const { saved } = useContext(SavedHomesContext);
  const items = properties.filter(item => saved.includes(item.slug));

  return <><Hero title="Saved Homes" eyebrow="Your shortlist" photo="sonoma" />
    <section className="section container">
      <Title eyebrow="Keep exploring">Your Shortlist</Title>
      <div className="listing-results">
        <p role="status">{items.length} {items.length === 1 ? 'home' : 'homes'} saved in this browser</p>
        {items.length > 1 && <a className="text-button" href="#comparison-title">Jump to comparison <Icon name="down" size={16} /></a>}
      </div>
      {items.length > 0 ? <PropertyGrid items={items} /> : <div className="listing-empty">
        <h3>Your shortlist is empty.</h3><p>Tap the heart on a listing to save it here.</p><Button to="/properties">Browse Homes</Button>
      </div>}
      {items.length > 1 && <section className="property-comparison">
        <h2 id="comparison-title">Compare Saved Homes</h2>
        <div className="comparison-scroll" role="region" aria-labelledby="comparison-title" tabIndex={0}>
          <table aria-labelledby="comparison-title">
            <thead><tr><th scope="col">At a glance</th>{items.map(item => <th scope="col" key={item.slug}><Link to={'/properties/' + item.slug}>{item.name}</Link></th>)}</tr></thead>
            <tbody>{comparisonRows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th>{items.map(item => <td key={item.slug}>{value(item)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>}
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
      <div className="gallery-thumbs" aria-label="Choose a photo">{photos.map(([name], index) => <button key={name} type="button" aria-label={index === 0 ? 'Show exterior' : 'Show interior'} aria-pressed={index === active} onClick={() => setActive(index)}><Photo name={name} sizes="95px" /></button>)}</div>
    </Reveal>
  </section>;
}

function ShareProperty({ item, sold }) {
  const [copyStatus, setCopyStatus] = useState('');
  const url = new URL((sold ? '/past-transactions/' : '/properties/') + item.slug, window.location.origin).href;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('manual');
    }
  }

  return <div className="share-property">
    <button className="text-button" type="button" onClick={copyLink}><Icon name="link" size={17} /> Copy listing link</button>
    <a className="text-button" href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">Share on Facebook <Icon name="diagonal" size={15} /></a>
    {copyStatus === 'copied' && <p role="status">Listing link copied.</p>}
    {copyStatus === 'manual' && <label>Listing link<input value={url} readOnly onFocus={event => event.target.select()} /></label>}
  </div>;
}

function ListingDetail({ slug, sold = false }) {
  const item = (sold ? portfolio : properties).find(property => property.slug === slug);
  if (!item) return <NotFound />;
  const neighborhood = neighborhoods.find(area => area.location === item.location);
  return <><Hero title={item.name} eyebrow={item.status || 'Sample property · For sale'} photo={item.image} />
    <section className="section container detail"><Reveal>
      <Link className="back-link" to={sold ? '/past-transactions' : '/properties'}><Icon name="left" size={17} /> All {sold ? 'transactions' : 'properties'}</Link>
      <Title eyebrow={item.location} className="detail-price">{money.format(item.price)}</Title>
      <div className="detail-facts"><Specs item={item} />{item.style && <span>{item.style}</span>}</div>
      <p className="lede">{item.details}</p>
      <div className="detail-feature"><h3>Property highlights</h3><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div>
      {neighborhood && <Link className="back-link detail-area" to={'/neighborhoods/' + neighborhood.slug}><Icon name="pin" size={17} /> Explore {neighborhood.name} <Icon name="arrow" size={17} /></Link>}
    </Reveal><Reveal className="detail-side"><Photo name="agent" alt="Maren Ellis" /><h3>Maren Ellis</h3><p>California Real Estate</p>
      <div className="detail-actions"><Button to={sold ? '/contact' : '/contact?property=' + item.slug}>{sold ? 'Let’s Connect' : 'Request a Tour'}</Button>{!sold && <SaveButton item={item} />}</div>
      <ShareProperty item={item} sold={sold} />
    </Reveal></section>
    {item.interior && <Gallery item={item} />}
    <Closing property={sold ? undefined : item} /></>;
}

function Neighborhoods({ slug }) {
  const area = neighborhoods.find(item => item.slug === slug);
  if (slug && !area) return <NotFound />;
  if (area) return <><Hero title={area.name} eyebrow="Neighborhood guide" photo={area.photo} />
    <article className="section reading container">
      <Link className="back-link" to="/neighborhoods"><Icon name="left" size={17} /> All neighborhoods</Link>
      <p className="lede">{area.intro}</p>
      {area.notes.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
      <div className="neighborhood-actions"><Button to={neighborhoodPropertiesLink(area.location)}>Browse Homes in {area.name}</Button><Button to="/appraisal">Request a Free Appraisal</Button></div>
    </article><Closing /></>;
  return <><Hero title="Neighborhoods" eyebrow="California Coast & Wine Country" photo="carmel" />
    <section className="section container">
      <Title eyebrow="Local guides">Find the right place to live</Title>
      <div className="journal-grid">{neighborhoods.map(item => <Reveal key={item.slug}><Link className="journal-card" to={'/neighborhoods/' + item.slug}>
        <div className="journal-image"><Photo name={item.photo} /><span className="card-arrow"><Icon name="diagonal" /></span></div>
        <p>{item.location}</p><h3>{item.name}</h3><p>{item.intro}</p>
      </Link></Reveal>)}</div>
    </section><Closing /></>;
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

function Contact({ appraisal = false }) {
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
      appraisal ? 'Free appraisal request' : property ? 'Tour inquiry: ' + property.name : 'Real estate inquiry',
      'Name: ' + values.get('name'),
      'Email: ' + values.get('email'),
      ...(appraisal ? ['Property address: ' + values.get('address'), 'City or suburb: ' + values.get('suburb')] : ['Interest: ' + values.get('interest')]),
      '',
      values.get('message'),
    ].join('\n'));
  }

  useEffect(() => { if (draft) draftRef.current?.focus(); }, [draft]);

  async function copy() {
    try { await navigator.clipboard.writeText(draft); setCopied(true); }
    catch { draftRef.current?.select(); }
  }

  const title = appraisal ? 'Request a Free Appraisal' : 'Get in Touch';
  return <><Hero title={title} eyebrow={appraisal ? 'For homeowners' : 'Let’s connect'} photo="montecito" /><section className="section container contact">
    <Reveal><Title eyebrow={appraisal ? 'Complimentary and obligation-free' : property ? 'Private showing' : 'Start the conversation'}>{appraisal ? 'Tell us about your home' : property ? 'Request a Tour' : 'Tell Me What You Have in Mind'}</Title>
      {appraisal && <p className="appraisal-note">Share a few details about the property to prepare your appraisal request. This demo creates a draft you can copy.</p>}
      {!appraisal && property && <p className="inquiry-property">{property.name} · {property.location}</p>}
      <form onSubmit={prepare}>
        <label>Name<input name="name" autoComplete="name" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        {appraisal ? <>
          <label>Property address<input name="address" autoComplete="street-address" required /></label>
          <label>City or suburb<input name="suburb" autoComplete="address-level2" required /></label>
        </> : <label>I’m interested in<select name="interest" defaultValue={property ? 'Private showing' : ''} required><option value="" disabled>Select an option</option><option>Buying</option><option>Selling</option><option>Private showing</option><option>Relocating</option></select></label>}
        <label>{appraisal ? 'Anything else we should know? (optional)' : property ? 'Preferred times or questions' : 'Your message'}<textarea name="message" rows="4" required={!appraisal} /></label>
        <button className="button olive" type="submit">{appraisal ? 'Prepare Appraisal Request' : 'Prepare Inquiry'}</button>
      </form>
      {draft && <div className="draft"><p>{appraisal ? 'Your appraisal request is ready to copy.' : 'Your inquiry is ready to copy.'}</p><label>{appraisal ? 'Appraisal request draft' : 'Inquiry draft'}<textarea ref={draftRef} rows="7" readOnly value={draft} /></label><button className="button olive" onClick={copy}>{copied ? 'Copied' : appraisal ? 'Copy Request' : 'Copy Inquiry'}</button><span className="sr-only" role="status">{copied ? 'Draft copied' : 'Draft ready'}</span></div>}
    </Reveal>
    <Reveal className="contact-image"><Photo name="agent" alt="Maren Ellis" /></Reveal>
  </section></>;
}

function Privacy() {
  return <><Hero title="Privacy" eyebrow="Website information" /><section className="section container reading"><p>The inquiry form prepares a draft in your browser. Your name, email, and message stay in the page until you copy them or close it.</p><p>Saved Homes stores your shortlist in this browser.</p></section></>;
}

function NotFound() {
  return <><Hero title="Page Not Found" eyebrow="404" /><section className="section container center"><Button to="/">Back to Home</Button></section></>;
}

const titles = { '/about': 'About', '/properties': 'Properties', '/past-transactions': 'Past Transactions', '/neighborhoods': 'Neighborhoods', '/journal': 'Journal', '/contact': 'Contact', '/appraisal': 'Free Appraisal', '/privacy': 'Privacy', '/saved': 'Saved Homes' };

function App() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '') || '/';
  const { hash } = location;
  const parts = pathname.split('/').filter(Boolean);
  const slug = parts[1];
  let page;
  if (parts.length === 0) page = <Home />;
  else if (parts.length > 2) page = <NotFound />;
  else if (parts[0] === 'properties') page = slug ? <ListingDetail slug={slug} /> : <PropertySearch />;
  else if (parts[0] === 'past-transactions') page = slug ? <ListingDetail slug={slug} sold /> : <SoldListings />;
  else if (parts[0] === 'neighborhoods') page = <Neighborhoods slug={slug} />;
  else if (parts[0] === 'journal') page = slug ? <Article slug={slug} /> : <Journal />;
  else if (pathname === '/about') page = <><Hero title="About Vela" eyebrow="Get to know us" photo="hero" /><Bio full /><MarketBand /><Closing /></>;
  else if (pathname === '/contact') page = <Contact />;
  else if (pathname === '/appraisal') page = <Contact appraisal />;
  else if (pathname === '/privacy') page = <Privacy />;
  else if (pathname === '/saved') page = <SavedHomes />;
  else page = <NotFound />;

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    const record = [...properties, ...portfolio, ...articles, ...neighborhoods].find(item => item.slug === slug);
    const title = record?.name || record?.title || titles[pathname] || (pathname === '/' ? 'California Real Estate' : 'Page Not Found');
    document.title = pathname === '/' ? 'Vela | ' + title : title + ' | Vela';
  }, [pathname, slug]);

  return <div id="top"><div className="scroll-progress" aria-hidden="true" /><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" key={pathname}>{page}</main><Footer /></div>;
}

createRoot(document.getElementById('root')).render(<BrowserRouter><SavedHomesProvider><App /></SavedHomesProvider></BrowserRouter>);
