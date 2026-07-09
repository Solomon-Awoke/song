import mongoose from "mongoose";

const URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@mezmurlyrics.cvnur77.mongodb.net/song?retryWrites=true&w=majority&appName=mezmurLyrics";

async function seed() {
  await mongoose.connect(URI);
  const db = mongoose.connection.db!;

  // Seed categories
  const categories = [
    { nameAm: "ምስጋና", nameEn: "Misgana - Praise", slug: "misgana", order: 1 },
    { nameAm: "ሰርግ", nameEn: "Serg - Wedding", slug: "serg", order: 2 },
    { nameAm: "ንስሐ", nameEn: "Nesha - Repentance", slug: "nesha", order: 3 },
    { nameAm: "አጫጭር መዝሙራት", nameEn: "Short Hymns", slug: "achacher-mezmurat", order: 4 },
    { nameAm: "ወረብ", nameEn: "Wereb", slug: "wereb", order: 5 },
    { nameAm: "ጥምቀት", nameEn: "Timket - Epiphany", slug: "timket", order: 6 },
    { nameAm: "ልደት/ገና", nameEn: "Lidet/Gena - Christmas", slug: "lidet-gena", order: 7 },
    { nameAm: "ቅዳሴ", nameEn: "Kidase - Liturgy", slug: "kidase", order: 8 },
    { nameAm: "የበዓላት መዝሙራት", nameEn: "Seasonal Hymns", slug: "seasonal", order: 9 },
  ];

  await db.collection("categories").deleteMany({});
  await db.collection("categories").insertMany(categories);
  console.log("✅ 9 categories seeded");

  // Seed songs
  const cats = await db.collection("categories").find().toArray();
  const now = new Date();

  const songs = [
    { titleAm: "የእግዚአብሔር ፍቅር", titleEn: "Gods Love", lyricsAm: "የእግዚአብሔር ፍቅር ለዘላለም ይኖራል\nበክርስቶስ ኢየሱስ ተገልጧል\nሞትን ድል አድርጎ ተነሳ\nሕይወትን ለእኛ ሰጠን", lyricsEn: "The love of God endures forever\nRevealed in Christ Jesus\nHe overcame death and rose\nGiving us life", slug: "ye-egziabher-fiker", category: cats[0]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["love","praise"] },
    { titleAm: "አምላኬ ድንቅ ነህ", titleEn: "My God You Are Wonderful", lyricsAm: "አምላኬ ድንቅ ነህ በቅድስናህ\nክብርህ ምስጋናህ ለዘላለም ይሁን\nሁሉን በእጅህ ይዘሃል\nፍጥረት ሁሉ ያመሰግንሃል", lyricsEn: "My God You are wonderful in Your holiness\nYour glory and praise be forever\nYou hold everything in Your hand\nAll creation praises You", slug: "amlake-dink-neh", category: cats[0]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["wonderful","praise"] },
    { titleAm: "ሰርግ የተባረከ", titleEn: "Blessed Wedding", lyricsAm: "ሰርግ የተባረከ በእግዚአብሔር\nበካህኑ ቡራኬ የተቀደሰ\nሙሽራ እንደ ርብቃ ትሁን\nሙሽራይቱም እንደ ሣራ ትሁን", lyricsEn: "Wedding blessed by God\nSanctified by the priests blessing\nMay the groom be like Isaac\nMay the bride be like Sarah", slug: "serg-yetbareke", category: cats[1]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["wedding","blessing"] },
    { titleAm: "ንስሐ ጊዜው አሁን ነው", titleEn: "Repentance Time is Now", lyricsAm: "ንስሐ ጊዜው አሁን ነው እንዳትዘገይ\nጌታ ዛሬ ይጠራል ልብህን ክፈትለት\nምሕረቱ ታላቅ ነው ይቅር ይላል\nተመለስ ወደ እርሱ አይጠፋም", lyricsEn: "Repentance time is now do not delay\nThe Lord calls today open your heart to Him\nHis mercy is great He forgives\nReturn to Him you will not perish", slug: "neseha-gizew-ahun-new", category: cats[2]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["repentance","mercy"] },
    { titleAm: "ጥምቀት የልደት ምሥጢር", titleEn: "Baptism Mystery of Birth", lyricsAm: "ጥምቀት የልደት ምሥጢር ነው\nበውኃና በመንፈስ የተቀደሰ\nክርስቶስ በዮርዳኖስ ተጠመቀ\nለእኛ ምሳሌ ሆኖናል", lyricsEn: "Baptism is the mystery of birth\nSanctified by water and Spirit\nChrist was baptized in the Jordan\nBecoming an example for us", slug: "timket-yelidet-mister", category: cats[5]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["baptism","timket"] },
    { titleAm: "ልደት በልደትህ ደስ ይለናል", titleEn: "Nativity Rejoicing", lyricsAm: "ልደት በልደትህ ደስ ይለናል\nኢየሱስ በልደትህ ደስ ይለናል\nመድሀኒት ተወልዷል ደስ ይለናል\nከሰማይ ወርዶአል ደስ ይለናል", lyricsEn: "Nativity in Your birth we rejoice\nJesus in Your birth we rejoice\nA Savior is born we rejoice\nHe has come down from heaven we rejoice", slug: "ldet-be-ldetih-desh-yilenal", category: cats[6]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["nativity","christmas"] },
    { titleAm: "ቅዳሴ ቅዱስ", titleEn: "Holy Liturgy", lyricsAm: "ቅዳሴ ቅዱስ የእግዚአብሔር ልጅ\nየሰማይና የምድር ፍጥረት ሁሉ\nቅዱስ ቅዱስ ቅዱስ ጌታ እግዚአብሔር\nሰማይና ምድር በክብርህ ተሞልተዋል", lyricsEn: "Holy Liturgy of the Son of God\nAll creation of heaven and earth\nHoly holy holy Lord God\nHeaven and earth are filled with Your glory", slug: "kidase-kidus", category: cats[7]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["liturgy","holy"] },
    { titleAm: "የበዓል መዝሙር", titleEn: "Festival Hymn", lyricsAm: "የበዓል መዝሙር የደስታ ጊዜ\nበእግዚአብሔር ፊት በደስታ ዘምሩ\nለእርሱ ምስጋና ያቅርቡ\nቅዱስ ነው ስሙ ከፍ ያለ ነው", lyricsEn: "A festival hymn a time of joy\nSing joyfully before the Lord\nOffer Him praise\nHoly is His name exalted is He", slug: "yebeal-mezmur", category: cats[8]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["festival","joy"] },
    { titleAm: "ወረብ የእግዚአብሔር መንገድ", titleEn: "Wereb The Way of God", lyricsAm: "ወረብ የእግዚአብሔር መንገድ ነው\nበእምነት የምንጓዝበት\nጸጋው ይመራናል\nእስከ መጨረሻው ድረስ", lyricsEn: "Wereb is the way of God\nThe path we walk by faith\nHis grace guides us\nUntil the very end", slug: "wereb-ye-egziabher-menged", category: cats[4]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["wereb","faith"] },
    { titleAm: "አጫጭር የምስጋና መዝሙር", titleEn: "Short Song of Praise", lyricsAm: "ምስጋና ለእግዚአብሔር\nክብር ለስሙ\nምስጋና ለእርሱ\nለዘላለም ይሁን አሜን", lyricsEn: "Praise be to God\nGlory to His name\nThanksgiving to Him\nForever and ever Amen", slug: "achacher-ye-misgana-mezmur", category: cats[3]._id, isApproved: true, likesCount: 0, createdAt: now, updatedAt: now, tags: ["short","praise"] },
  ];

  await db.collection("songs").deleteMany({});
  await db.collection("songs").insertMany(songs);
  console.log(`✅ ${songs.length} songs seeded`);

  await mongoose.disconnect();
  console.log("🎉 Atlas seeding complete!");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
