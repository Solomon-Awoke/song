import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

const categories = [
  { nameAm: 'ምስጋና', nameEn: 'Misgana', slug: 'misgana', order: 1 },
  { nameAm: 'ሰርግ', nameEn: 'Serg', slug: 'serg', order: 2 },
  { nameAm: 'ንስሃ', nameEn: 'Nesha', slug: 'nesha', order: 3 },
  {
    nameAm: 'አጫጭር መዝሙራት',
    nameEn: 'Achacher Mezmurat',
    slug: 'achacher-mezmurat',
    order: 4,
  },
  { nameAm: 'ወረብ', nameEn: 'Wereb', slug: 'wereb', order: 5 },
  { nameAm: 'ጥምቀት', nameEn: 'Timket', slug: 'timket', order: 6 },
  { nameAm: 'ልደት/ገና', nameEn: 'Lidet/Gena', slug: 'lidet-gena', order: 7 },
  { nameAm: 'ቅዳሴ', nameEn: 'Kidase', slug: 'kidase', order: 8 },
  {
    nameAm: 'የበዓላት መዝሙራት',
    nameEn: 'Seasonal Hymns',
    slug: 'seasonal',
    order: 9,
  },
];

async function seed() {
  try {
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    const ops = categories.map((cat) => ({
      updateOne: {
        filter: { slug: cat.slug },
        update: { $set: cat },
        upsert: true,
      },
    }));

    const result = await Category.bulkWrite(ops);
    console.log(
      `✅ Seeded categories: ${result.upsertedCount} created, ${result.modifiedCount} updated`
    );

    const seeded = await Category.find().sort({ order: 1 }).lean();
    console.log(`📋 Total categories: ${seeded.length}`);
    seeded.forEach((c) =>
      console.log(`   ${c.order}. ${c.nameAm} (${c.slug})`)
    );
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seed();
