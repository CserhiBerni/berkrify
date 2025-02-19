import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    const mp3Buffer = Buffer.from(faker.string.alphanumeric(100), 'utf-8');
    const imageUrl = faker.image.url();
    const imageBuffer = Buffer.from(imageUrl, 'utf-8');

    await prisma.songs.create({
      data: {
        artist: faker.person.fullName(),
        album: faker.music.album(),
        song: faker.music.songName(),
        length: faker.date.past(),
        release_yr: faker.number.int({ min: 1980, max: 2025 }),
        genre: faker.music.genre(),
        mp3: mp3Buffer,  
        cover: imageBuffer
      } as any 
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
