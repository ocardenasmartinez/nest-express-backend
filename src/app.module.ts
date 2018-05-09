'use strict';

import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';

@Module({
    modules: [
        UserModule
    ],
})
export class ApplicationModule { }
