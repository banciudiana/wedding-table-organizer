import mongoose from 'mongoose';
import Table from './models/Table.js';
import dotenv from 'dotenv';

dotenv.config();

const guestData = {
  1: [
    'DANIELA VASILE',
    'MIRCEA VASILE',
    'ANDREIA HERTIG',
    'PETRU HERTIG',
    'THEODOR VASILE',
    'BIRO RAZVAN ANDREI',
    'BIRO IULIA',
    'BIRO SOFIA si Andrei',
    'BIRO ANA MARIA'
  ],
  2: [
    'CLAUDIU VASILE',
    'SILVIA VASILE',
    'Stefan Florian Vasile',
    'TUDORA VASILE',
    'STEFAN VASILE',
    'ILIUTA NEAGU',
    'SORINELA NEAGU',
    'Ioana Neagu',
    'BIRO LADISLAU',
    'BIRO VASILICA',
    'BIRO ALEXANDRU',
    'BIRO AIDA',
    'LAZAR VASILE',
    'LAZAR ILONA',
    'Biro Tiberiu',
    'Biro Mihaela'
  ],
  3: [
    'Mariana Dutu',
    'Dan Dutu',
    'Adrian Dutu',
    'Iris Dutu',
    'Andreea Dutu',
    'Vlad Niculae',
    'Laurentiu Musteata',
    'Ioana Musteata',
    'Mihaita Musteata',
    'Ioana Musteata - Mishu',
    'Gelu Grosu',
    'Monica Drumariu - Prietena Gelu',
    'Teodora Ciurdea - fiica Monica',
    'Valentin Grosu',
    'Teodora Constantinescu - prietena Vali',
    'Alina Grosu',
    'Bogdan Grosu',
    'Maria Angela Grosu',
    'Prieten MAria Angela Grosu',
    'Dan Grosu'
  ],
  4: [
    'Marius Grigore',
    'Alexandra Grigore',
    'MIHAELA DUMITRESCU',
    'ANDA BADEA',
    'CATALIN BADEA',
    'Alexandru Badea',
    'Irina Greceanu',
    'Lucian Ilioiu',
    'Lorena Ilioiu',
    'DARIA ILIOIU',
    'DIANA Cotoranu',
    'Costin Cotoranu',
    'Viorel Negru',
    'Eliza Negru',
    'Latina (Nicoleta Antohe)',
    'Livia Mihalache',
    'Dan Mihalache (Magazie)'
  ],
  5: [
    'DANIEL FULGHECI',
    'ANA FULGHECI',
    'Mioara LAZAR',
    'Sorin LAZAR',
    'OANA SIMION',
    'ADI SIMION',
    'MATEI SIMION',
    'Evangelos Papathanassiou',
    'Eleni Manousiadi',
    'ROBERT DANE',
    'MADALINA DANE',
    'Ana Dane',
    'NICOLETA OCHIS',
    'GABRIEL OCHIS',
    'Iulica Bancianu',
    'Raluca Bancianu',
    'CRISTIAN TALPALARIU',
    'Getutza Dragan'
  ],
  6: [
    'Balaceanu Iulia',
    'Balaceanu Florin',
    'Marius Raicu',
    'Misha Raicu',
    'Stefan vecin',
    'Cristiana - sotie vecin',
    'Vali - prieteni Raicu',
    'Teodora - prieteni Raicu',
    'Adi Dragan'
  ],
  7: [
    'Ana Matache',
    'Rick Bartels',
    'Benzeffour Mounir',
    'sensei',
    'Mihai Theodora',
    'Ghionescu Petru David',
    'Podaru Adrian',
    'Doina Mihailov',
    'Ana Mihailov',
    'Mara',
    'Theo Tomescu',
    'Vărășteanu Andrada',
    'Paty'
  ],
  8: [
    'Anca Simion',
    'Ruxi',
    'Ispas',
    'Diana',
    'Chesim',
    'Sergiu Aparaschivei',
    'Edi',
    'Lorena',
    'Dori',
    'Alexandra Vaitus',
    'Ginger',
    'Alexandra Marin',
    'Adi Gandescu',
    'Delia Hoarca',
    'Simona Corlan'
  ],
  9: [
    'Dan Petre',
    'Iulia Petre',
    'Alexandra Olteanu',
    'Dragos (Alexandra)',
    'Fănel Bonciu - GL',
    'Mihaela Galati',
    'Adriana Cluj',
    'Kocsis Robert',
    'Denisa Anca',
    'Alexandru Miu',
    'Mona Ghunim',
    'Ciprian Popescu',
    'Gabriela Constantin',
    'Stelian Constantin'
  ],
  10: [
    'Bran adriana',
    'bran edi',
    'batros silviu',
    'batros cornelia',
    'Lungu mara',
    'lungu gioni',
    'oprea constantin',
    'oprea alina',
    'joghiu maria',
    'joghiu laurentiu',
    'opris romeo',
    'opris claudia'
  ],
  11: [
    'pantazica',
    'pantazica',
    'badita',
    'badita',
    'zbargiog',
    'zbargioc',
    'gimiga',
    'gimiga',
    'draganescu',
    'draganescu'
  ],
  12: [
    'lipan',
    'lipan',
    'suprovici',
    'suprovici',
    'virna',
    'virna',
    'foarfeca',
    'antohe',
    'antohe'
  ],
  13: [
    'petrescu',
    'petrescu valeriu',
    'petrescu marius',
    'petrescu',
    'firoiu razvan',
    'firoiu',
    'cretu',
    'cretu',
    'popa',
    'popa'
  ]
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Delete existing tables
    await Table.deleteMany({});
    console.log('Cleared existing tables');

    // Insert new tables with guests
    for (const [tableNumber, guests] of Object.entries(guestData)) {
      const guestList = guests
        .map(name => ({
          name: name.trim(),
          dietary: '',
          notes: ''
        }))
        .filter(guest => guest.name && !guest.name.includes('?'));

      const table = await Table.create({
        tableNumber: parseInt(tableNumber),
        capacity: Math.max(guestList.length, 8),
        guests: guestList,
        location: '',
        special: false
      });

      console.log(`Table ${tableNumber} created with ${guestList.length} guests`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

connectDB();
seedDatabase();
