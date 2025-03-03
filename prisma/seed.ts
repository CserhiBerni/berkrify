import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin bácsi',  
        email: 'admin@example.com',
        password: await argon2.hash('admin'),
        created: new Date(),
        role: 'Admin',  
      },
      {
        name: 'User néni', 
        email: 'user@example.com',
        password: await argon2.hash('user'),
        created: new Date(),
        role: 'User',  
      },
    ],
  });

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
        cover: imageBuffer,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
  
