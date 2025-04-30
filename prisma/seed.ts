import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: await argon2.hash('admin123!'),
        created: new Date(),
        role: 'Admin',
      },
      {
        name: 'User',
        email: 'user@example.com',
        password: await argon2.hash('user123!'),
        created: new Date(),
        role: 'User',
      },
    ],
  });

  for (let i = 0; i < 50; i++) {
    await prisma.songs.create({
      data: {
        artist: faker.person.fullName(),
        album: faker.music.album(),
        song: faker.music.songName(),
        length: faker.number.int({ min: 60, max: 380 }),
        release_yr: faker.number.int({ min: 1980, max: 2025 }),
        genre: faker.music.genre(),
        mp3: faker.internet.url(), 
        cover: faker.image.urlPicsumPhotos(),
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

