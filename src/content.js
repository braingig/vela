export const image = (name, compact = false) => '/images/' + name + (compact ? '-768' : '') + '.webp';

export const properties = [
  { slug: 'cypress-point', name: 'Cypress Point House', location: 'Carmel Highlands, CA', image: 'carmel', interior: 'hero', alt: 'Timber and stone home overlooking the Pacific', price: 6750000, beds: 4, baths: 4.5, garage: 2, area: 4160, style: 'Coastal modern', details: 'A low-slung timber and stone residence set into the Carmel Highlands. Broad windows open to the Pacific, while a sheltered terrace offers a quiet place to sit among the cypresses.', features: ['Ocean-facing terrace', 'Open living and dining room', 'Native coastal garden'] },
  { slug: 'olive-courtyard', name: 'The Olive Courtyard', location: 'Montecito, CA', image: 'montecito', interior: 'villaInterior', alt: 'White stucco home with tiled roof and an olive tree', price: 4850000, beds: 4, baths: 3.5, garage: 2, area: 3280, style: 'Spanish revival', details: 'Arched openings, hand-finished plaster, and a mature olive tree set the tone for this Montecito residence. The rooms look inward to a courtyard shaded in the afternoon.', features: ['Enclosed courtyard', 'Arched plaster entry', 'Covered outdoor dining'] },
  { slug: 'oak-ridge', name: 'Oak Ridge Estate', location: 'Sonoma, CA', image: 'sonoma', interior: 'ridgeInterior', alt: 'Wood and charcoal estate framed by oak trees', price: 5295000, beds: 5, baths: 4, garage: 3, area: 4725, style: 'Wine country contemporary', details: 'Designed around a stand of mature oaks, this Sonoma home pairs a dark timber exterior with bright living spaces. A courtyard connects the main residence to its guest wing.', features: ['Separate guest wing', 'Oak-lined courtyard', 'Indoor and outdoor entertaining'] },
];

export const portfolio = [
  { slug: 'oak-and-field', name: 'Oak & Field Residence', location: 'Sonoma County, CA', image: 'field', alt: 'Low timber ranch in a meadow with live oaks', price: 4100000, status: 'Sold', beds: 4, baths: 4, garage: 2, area: 3920, details: 'A low ranch built along the edge of an oak meadow. Pale timber, dry stone walls, and a long outdoor terrace connect the rooms to the landscape.', features: ['Wraparound terrace', 'Meadow and oak views', 'Single-level floor plan'] },
  { slug: 'olive-grove', name: 'Olive Grove House', location: 'Santa Barbara County, CA', image: 'grove', alt: 'Stucco hacienda and gravel drive framed by olive trees', price: 3750000, status: 'Sold', beds: 3, baths: 3.5, garage: 2, area: 2940, details: 'A Spanish colonial residence approached through rows of olive trees. The gravel drive opens onto a sheltered entry, and deep windows look into the garden.', features: ['Established olive grove', 'Sheltered entry courtyard', 'Traditional clay roof'] },
];

export const articles = [
  { slug:'walk-through', title:'What to look for on a first walk-through', date:'May 12, 2026', image:'hero', intro:'A few quiet observations can tell you more about a home than a long list of finishes.', sections:[
    ['Follow the light', 'Notice the direction of the windows and which rooms receive light at the time you would use them. If you can, return at a different hour to see how the atmosphere changes.'],
    ['Walk your daily routine', 'Imagine arriving with groceries or heading out in the morning. Pay attention to the routes you would use every day, the storage near entrances, and how the living spaces connect.'],
    ['Write down what you want to revisit', 'Record the details that matter to you while they’re fresh. Bring those questions to a second visit so you can focus on the home rather than trying to remember the first tour.'],
  ]},
  { slug:'prepare-to-list', title:'How to prepare your home for listing photography', date:'April 23, 2026', image:'montecito', intro:'A well-prepared space helps buyers see the architecture and picture their own routines.', sections:[
    ['Start with sight lines', 'Walk through your home as a photographer would. Clear the areas that interrupt views from room to room, especially entryways, kitchen counters, and the edges of windows.'],
    ['Use the natural light', 'Open curtains and clean glass before the shoot. Note when direct sun reaches the main rooms and plan the schedule around the light you want to capture.'],
    ['Edit the outdoor spaces', 'Set out a few pieces of furniture that suggest how the terrace is used and clear hoses, bins, and tools from view. A simple arrangement helps the outdoor space read clearly in photos.'],
  ]},
  { slug:'coast-or-country', title:'Finding your pace along the California coast', date:'March 19, 2026', image:'carmel', intro:'Before you choose a home, spend time in the places you would visit on an ordinary day.', sections:[
    ['Start with the neighborhood', 'Walk to the spots you expect to use most. Stop for coffee, time a trip to the grocery store, and see how the streets feel at the end of the workday.'],
    ['Spend a day inland', 'Wine country and the coast have different rhythms. Consider access to trails, the distance to the nearest town, and how often you expect to host overnight guests.'],
    ['Visit at different times', 'A Saturday afternoon can feel different from a Tuesday morning. A few visits help you see traffic, shade, and noise patterns that can be hard to judge during a single tour.'],
  ]},
];

export const questions = [
  ['How do I arrange a private showing?', 'Open the listing and choose Request a Tour. The inquiry will include the property name, and you can add your preferred days and times.'],
  ['Where do you work?', 'Maren focuses on the California coast and wine country, including Carmel, Montecito, and Sonoma.'],
  ['Can we talk before I’m ready to list?', 'Yes. An early conversation is a chance to discuss your timing, what buyers look for, and which preparations make sense for your home.'],
  ['Can you help with a relocation?', 'Yes. Start with the places you’ll need to reach regularly, the kind of neighborhood you prefer, and when you want to move. Maren can help you plan where to spend time on your first visit.'],
];
