'use strict';

import { Component, Inject } from '@nestjs/common';
import { Model } from 'sequelize-typescript';
import { MessageCodeError } from '../../shared/errors/message-code-error';
import { IUser, IUserService } from './interfaces/index';
import { User } from './user.entity';

@Component()
export class UserService implements IUserService {
    constructor(@Inject('UserRepository') private readonly userRepository: typeof Model,
                @Inject('SequelizeInstance') private readonly sequelizeInstance) { }

    public async findAll(): Promise<Array<User>> {
        let repo;
        try {
          repo = await this.userRepository.findAll<User>();
        }catch(e){
          console.log("e: ", e);
        }
        return repo;
    }

    public async findOne(options: Object): Promise<User | null> {
        return await this.userRepository.findOne<User>(options);
    }

    public async findById(id: number): Promise<User | null> {
        return await this.userRepository.findById<User>(id);
    }

    public async create(user: IUser): Promise<User> {
        let response;
        try {
            response = await this.sequelizeInstance.transaction(async transaction => {
                return await this.userRepository.create<User>(user, {
                    returning: true,
                    transaction,
                });
            });
        }catch(e) {
            console.log("Error:", e);
        }
        return response;
        /*return await this.sequelizeInstance.transaction(async transaction => {
            return await this.userRepository.create<User>(user, {
                returning: true,
                transaction,
            });
        });*/
    }

    public async update(id: number, newValue: IUser): Promise<User | null> {
        return await this.sequelizeInstance.transaction(async transaction => {
            let user = await this.userRepository.findById<User>(id, { transaction });
            if (!user) throw new MessageCodeError('user:notFound');

            user = this._assign(user, newValue);
            return await user.save({
                returning: true,
                transaction,
            });
        });
    }

    public async delete(id: number): Promise<void> {
        return await this.sequelizeInstance.transaction(async transaction => {
            return await this.userRepository.destroy({
                where: { id },
                transaction,
            });
        });
    }

    /**
     * @description: Assign new value in the user found in the database.
     *
     * @param {IUser} user
     * @param {IUser} newValue
     * @return {User}
     * @private
     */
    private _assign(user: IUser, newValue: IUser): User {
        for (const key of Object.keys(user)) {
            if (user[key] !== newValue[key]) user[key] = newValue[key];
        }

        return user as User;
    }
}
