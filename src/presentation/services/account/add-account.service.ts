import { AccountModel } from '@app/domain/models/account/account';
import {
  AddAccount,
  AddAccountParams,
} from '@app/domain/usecases/account/add-account';
import { AccountMongoRepository } from '@app/infra/db/mongodb/account/account-mongo-repository';
import { ConflictException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AddAccountService implements AddAccount {
  private readonly logger = new Logger(AddAccountService.name);
  constructor(
    private readonly accountMongoRepository: AccountMongoRepository,
  ) {}
  async add(account: AddAccountParams): Promise<AccountModel> {
    try {
      return await this.accountMongoRepository.add(account);
    } catch (e) {
      this.logger.log(`${JSON.stringify(e)}`);
      if (e.code === 11000)
        throw new ConflictException(
          `This account [${e.keyValue.name}] already exists.`,
        );
    }
  }
}
