import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from './generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('query', (e) => {
      console.debug('Query: ' + e.query);
      console.debug('Params: ' + e.params);
      console.debug('Duration: ' + e.duration + 'ms');
    });
  }
}
