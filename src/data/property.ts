import exterior from '../assets/homes/mariehamn-exterior.jpeg';
import terrace from '../assets/homes/mariehamn-terrace.jpeg';
import livingRoom from '../assets/homes/mariehamn-living-room.jpeg';
import kitchen from '../assets/homes/mariehamn-kitchen.jpeg';
import bedroom from '../assets/homes/mariehamn-bedroom.jpeg';
import bedroomTwo from '../assets/homes/mariehamn-bedroom-2.jpeg';
import bathroom from '../assets/homes/mariehamn-bathroom.jpeg';
import droneOverviewWest from '../assets/homes/mariehamn-drone-overview-west.jpg';
import dronePropertyWest from '../assets/homes/mariehamn-drone-property-west.jpg';
import entrance from '../assets/homes/garden-flower.jpeg';
import sauna from '../assets/homes/sauna.jpeg';
import bedroomThree from '../assets/homes/mariehamn-bedroom-3.jpeg';

export const property = {
  id: '8ac83c98-0249-4b07-a657-0e29cc101001',
  slug: '4-rum-och-kok-i-parhus-i-mariehamn',
  title: '4 rum och kök i parhus i Mariehamn',
  location: 'Svärtesgränd, Västernäs, Mariehamn',
  rent: 1290,
  salePrice: 245000,
  listingTypes: ['sale', 'rent'],
  rooms: '4 rum och kök',
  area: 'cirka 94,1 m²',
  totalArea: '97 m² inklusive förråd',
  bedrooms: 3,
  available: 'Tillgänglig för dialog och visning nu. Uthyres från 1 januari 2027 eller enligt överenskommelse.',
  tenure: 'Till salu och för uthyrning',
  intro: 'Ett bekvämt boende i ett plan med ljusa sociala ytor, tre separata sovrum, egen uteplats med bastu (gemensam i bolaget som består av två lägenheter) och ett lugnt läge vid återvändsgränd i Västernäs Mariehamn.',
  facts: [
    ['Bolag', 'Bostads Ab Svärtan i Mariehamn'],
    ['Inflyttningsår', '2016'],
    ['Våningsplan', '2'],
    ['Möblering', 'Uthyres omöblerad'],
    ['Uteplats', 'Egen uteplats i västerläge'],
    ['Värme', 'Vattenburen golvvärme via fjärrvärme'],
    ['Ventilation', 'Mekanisk ventilation'],
    ['Vatten och avlopp', 'Anslutning till stadens nät'],
    ['Fiber', 'Anslutning till Ålcoms fibernät'],
    ['Bilplats', 'En bilplats med eluttag'],
  ] as const,
  gallery: [
    { src: droneOverviewWest, alt: 'Drönarvy rakt ovanifrån över parhusområdet i Västernäs' },
    { src: dronePropertyWest, alt: 'Drönarvy över parhuset, den egna uteplatsen och trädgården i västerläge' },
    { src: entrance, alt: 'Entrén till bostaden med stenläggning och blommande grönska' },
    { src: sauna, alt: 'Den fristående gemensamma bastun med träpanel, lavar och elaggregat' },
    { src: bedroom, alt: 'Sovrum fotograferat med tidigare möblering; bostaden hyrs ut omöblerad men vissa möbler kan ingå enligt överenskommelse' },
    { src: exterior, alt: 'Parhusets mörka träfasad och den egna gräsmattan' },
    { src: terrace, alt: 'Stenlagd uteplats i västerläge, fotograferad med tidigare möblering; bostaden hyrs ut omöblerad men vissa möbler kan ingå enligt överenskommelse' },
    { src: livingRoom, alt: 'Ljust vardagsrum och matplats i öppen planlösning, fotograferat med tidigare möblering; bostaden hyrs ut omöblerad men vissa möbler kan ingå enligt överenskommelse' },
    { src: kitchen, alt: 'Vitt kök med arbetsbänk, keramikhäll och fönster; lös inredning på bilden ingår inte' },
    { src: bedroomThree, alt: 'Sovrum 3 fotograferat med tidigare möblering; bostaden hyrs ut omöblerad men vissa möbler kan ingå enligt överenskommelse' },
    { src: bedroomTwo, alt: 'Mindre sovrum fotograferat med tidigare möblering; bostaden hyrs ut omöblerad men vissa möbler kan ingå enligt överenskommelse' },
    { src: bathroom, alt: 'Badrum med kakel, klinker, glasdusch och belyst spegel; lös inredning på bilden ingår inte' },
  ],
} as const;

export type Property = typeof property;
