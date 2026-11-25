import { Injectable, HttpException, Optional } from "@nestjs/common";
import { plainToInstance, instanceToPlain } from "class-transformer";
import { validateOrReject } from "class-validator";
import {
  PersistenceRuntime,
  PersistenceFailure,
  PersistencePolicyResolver,
} from "#/database/persistence/persistence.runtime";
import type { TrustedContext } from "#/database/persistence/persistence.types";
import { AccountReadDto } from "#/modules/auth/schema/dto/account-read.dto";
import { GET_MY_ACCOUNT_PLAN as plan } from "./get-my-account.config.ts";
/** Named typed repository function; all SQL and transaction handling live in the runtime. */
export async function getMyAccountRepository(
  runtime: PersistenceRuntime,
  input: { [key: string]: never },
  context: TrustedContext,
): Promise<AccountReadDto> {
  try {
    const result = await runtime.execute(plan, instanceToPlain(input), context);
    if (result === null || typeof result !== "object" || Array.isArray(result))
      throw new Error("Expected response object");
    const output = plainToInstance(AccountReadDto, result);
    await validateOrReject(output);
    return output;
  } catch (error) {
    if (error instanceof PersistenceFailure)
      throw new HttpException(
        { code: error.failure.code, message: error.message },
        error.failure.status,
      );
    throw error;
  }
}

/** The application policy resolver supplies trusted context separately from request input. */
@Injectable()
export class GetMyAccountUseCase {
  /** Optional so HTTP specs can mock the service without a database; the application registers both globally. */
  constructor(
    @Optional() private readonly runtime?: PersistenceRuntime,
    @Optional() private readonly policyResolver?: PersistencePolicyResolver,
  ) {}
  async execute(
    input: { [key: string]: never } = {},
    context?: TrustedContext,
  ): Promise<AccountReadDto> {
    if (!this.runtime || !this.policyResolver)
      throw new Error("PersistenceRuntime and PersistencePolicyResolver must be registered");
    return getMyAccountRepository(
      this.runtime,
      input,
      context ?? (await this.policyResolver.resolve(plan.operation)),
    );
  }
}
