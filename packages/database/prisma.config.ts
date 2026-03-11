import path from 'path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: path.resolve(__dirname, '../../.env') });

export default defineConfig({
  datasource: {
    directUrl: process.env['DIRECT_URL'],
    url: process.env['DATABASE_URL'],
  },
  migrations: {
    path: 'prisma/migrations',
  },
  schema: 'prisma/schema.prisma',
});
