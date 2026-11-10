import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { image, neighborhoods } from './content';

const compactPrice = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2,
});

function pinIcon(label, active) {
  const text = document.createElement('span');
  text.textContent = label;
  return L.divIcon({
    html: text,
    className: 'property-pin' + (active ? ' property-pin-active' : ''),
    iconSize: [58, 28],
    iconAnchor: [29, 14],
  });
}

export default function PropertyMap({ items, fitItems, selected, onSelect, onSearchArea, areaActive }) {
  const node = useRef(null);
  const mapRef = useRef(null);
  const markerLayer = useRef(null);
  const selectedRef = useRef(null);
  const [regionalView, setRegionalView] = useState(true);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    const map = L.map(node.current, { scrollWheelZoom: false, minZoom: 5, maxZoom: 17 }).setView([36.5, -121.2], 6);
    const updateZoom = () => setRegionalView(map.getZoom() < 11);
    map.on('zoomend', updateZoom);
    const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });
    tiles.on('tileerror', () => setTilesUnavailable(true));
    tiles.on('tileload', () => setTilesUnavailable(false));
    tiles.addTo(map);
    markerLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    let fitted = false;
    const resize = () => {
      if (!node.current.clientWidth || !node.current.clientHeight) return;
      map.invalidateSize();
      if (!fitted) {
        if (selectedRef.current) map.setView(selectedRef.current.coordinates, 14, { animate: false });
        else if (fitItems.length) map.fitBounds(fitItems.map(item => item.coordinates), { padding: [45, 55], maxZoom: 14, animate: false });
        fitted = true;
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(node.current);
    return () => observer.disconnect();
  }, [fitItems]);

  useEffect(() => {
    const map = mapRef.current;
    const markers = markerLayer.current;
    markers.clearLayers();
    const groups = regionalView
      ? neighborhoods.map(area => items.filter(item => item.location === area.location)).filter(group => group.length)
      : items.map(item => [item]);

    for (const group of groups) {
      const [item] = group;
      const multiple = group.length > 1;
      const active = group.some(home => home.slug === selected?.slug);
      const label = multiple ? group.length + ' homes' : compactPrice.format(item.price);
      const title = multiple ? group.length + ' homes in ' + item.location : item.name + ', ' + label;
      L.marker(item.coordinates, { icon: pinIcon(label, active), title, alt: title, zIndexOffset: active ? 300 : 0 })
        .on('click', () => {
          if (multiple) {
            map.fitBounds(group.map(home => home.coordinates), { padding: [45, 55], maxZoom: 14, animate: false });
          } else {
            onSelect(item.slug);
          }
        })
        .addTo(markers)
        .getElement().setAttribute('aria-label', title);
    }
  }, [items, onSelect, regionalView, selected]);

  useEffect(() => {
    if (selected) {
      const map = mapRef.current;
      map.invalidateSize();
      map.setView(selected.coordinates, Math.max(map.getZoom(), 13), { animate: false });
    }
  }, [selected]);

  return <aside className="map-pane" aria-label="Property map">
    <div className="map-surface">
      <div ref={node} className="map-canvas" aria-label="Map of sample listings" />
      <div className="map-toolbar">
        <button type="button" onClick={() => onSearchArea(mapRef.current.getBounds())}>Search this area</button>
        {areaActive && <button type="button" onClick={() => onSearchArea(null)}>Clear map filter</button>}
      </div>
      {tilesUnavailable && <p className="map-unavailable" role="status">Map tiles are temporarily unavailable. Listing pins still work.</p>}
      {selected && <div className="map-preview">
        <img src={image(selected.image, true)} alt="" />
        <div><p>{selected.location}</p><Link to={'/properties/' + selected.slug}>{selected.name}</Link></div>
        <button type="button" aria-label="Close map preview" onClick={() => onSelect(null)}>×</button>
      </div>}
    </div>
    <p className="map-note">Pins show approximate locations for sample properties.</p>
  </aside>;
}
