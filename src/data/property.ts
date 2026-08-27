import drone from '../assets/homes/mariehamn-drone.jpeg';
import exterior from '../assets/homes/mariehamn-exterior.jpeg';
import terrace from '../assets/homes/mariehamn-terrace.jpeg';
import livingRoom from '../assets/homes/mariehamn-living-room.jpeg';
import kitchen from '../assets/homes/mariehamn-kitchen.jpeg';
import bedroom from '../assets/homes/mariehamn-bedroom.jpeg';
import bedroomTwo from '../assets/homes/mariehamn-bedroom-2.jpeg';
import bathroom from '../assets/homes/mariehamn-bathroom.jpeg';

export const property = {
  slug: '4-rum-och-kok-i-parhus-i-mariehamn',
  title: '4 rum och kök i parhus i Mariehamn',
  location: 'Svärtesgränd, Västernäs, Mariehamn',
  rent: 1290,
  rooms: '4 rum och kök',
  area: 'cirka 94,1 m²',
  totalArea: '97 m² inklusive förråd',
  bedrooms: 3,
  available: 'Tillgänglig för dialog och visning nu. Uthyres från 1 januari 2027 eller enligt överenskommelse.',
  tenure: 'Hyresobjekt · kan även vara till salu enligt överenskommelse',
  intro: 'Ett bekvämt boende i ett plan med ljusa sociala ytor, tre sovrum, egen uteplats och ett lugnt läge vid en återvändsgränd i Västernäs.',
  facts: [
    ['Bolag', 'Bostads Ab Svärtan i Mariehamn'],
    ['Inflyttningsår', '2016'],
    ['Värme', 'Vattenburen golvvärme via fjärrvärme'],
    ['Ventilation', 'Mekanisk ventilation'],
    ['Vatten och avlopp', 'Anslutning till stadens nät'],
    ['Fiber', 'Anslutning till Ålcoms fibernät'],
    ['Bilplats', 'En bilplats med eluttag'],
  ] as const,
  gallery: [
    { src: drone, alt: 'Drönarvy över parhuset och det lugna bostadsområdet i Västernäs' },
    { src: exterior, alt: 'Parhusets mörka träfasad och den egna gräsmattan' },
    { src: terrace, alt: 'Stenlagd uteplats med matgrupp, planteringar och insynsskyddande häck' },
    { src: livingRoom, alt: 'Ljust vardagsrum och matplats i öppen planlösning' },
    { src: kitchen, alt: 'Vitt kök med arbetsbänk, keramikhäll och fönster' },
    { src: bedroom, alt: 'Sovrum med dubbelsäng, mörkblå textilier och fönster' },
    { src: bedroomTwo, alt: 'Mindre sovrum med enkelsäng och färgstark matta' },
    { src: bathroom, alt: 'Badrum med kakel, klinker, glasdusch och belyst spegel' },
  ],
} as const;

export type Property = typeof property;
