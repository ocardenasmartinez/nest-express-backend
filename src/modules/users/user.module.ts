'use strict';

import { Module, RequestMethod } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { usersProvider } from './user.provider';

@Module({
    modules: [DatabaseModule],
    controllers: [UserController],
    components: [
        UserService,
        usersProvider,
    ],
})
export class UserModule {}
