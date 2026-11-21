import { DataSource } from "typeorm";
import { addresses } from "#/modules/explorer/features/explorer/reads/explorer.ts";
import { Injectable } from "@nestjs/common";
import type { AddressesInputDto } from "#/modules/explorer/schema/dto/addresses-input.dto";
import type { AddressesDto } from "#/modules/explorer/schema/dto/addresses.dto";

/**
 * Names and places above them for a list of addresses (saved places), in one language. A body keeps the list out of the address.
 *
 * Scaffolded by Dryv once; this file belongs to the project.
 * Delegates composition to the project-owned typed reader.
 */
@Injectable()
export class ResolveExplorerAddressesUseCase {
  constructor(private readonly db: DataSource) {}

  async execute(input: AddressesInputDto): Promise<AddressesDto> {
    return addresses(this.db, input);
  }
}
