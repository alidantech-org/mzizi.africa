/** Interface messages of an app in the reader's language, falling back per key to English. */
import { Injectable, Optional } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PersistenceRuntime } from "#/database/persistence/persistence.runtime";
import { CopyBundleDto } from "#/modules/frontend/schema/dto/copy-bundle.dto";
import type { CopyRequestDto } from "#/modules/frontend/schema/dto/copy-request.dto";
import { listMessagesRepository } from "#/modules/product/features/copy/use-cases/list-messages.repository";
import { MessageWindowDto } from "#/modules/product/schema/dto/message-window.dto";
import { call } from "./shared/call";
import { LAST_RESORT_LANGUAGE } from "./shared/localize";

@Injectable()
export class GetCopyBundleUseCase {
  /** Optional so HTTP specs can mock the service; the application registers the runtime globally. */
  constructor(@Optional() private readonly injected?: PersistenceRuntime) {}

  private get runtime(): PersistenceRuntime {
    if (!this.injected) throw new Error("PersistenceRuntime must be registered");
    return this.injected;
  }

  async execute(input: CopyRequestDto): Promise<CopyBundleDto> {
    const language = input.lang ?? LAST_RESORT_LANGUAGE;
    const load = (lang: string) =>
      call(this.runtime, listMessagesRepository, MessageWindowDto, { appCode: input.app, lang, limit: 5000, offset: 0 });
    const [wanted, fallback] = await Promise.all([load(language), language === LAST_RESORT_LANGUAGE ? undefined : load(LAST_RESORT_LANGUAGE)]);
    const texts = new Map<string, string>();
    for (const m of [...(fallback?.messages ?? []), ...wanted.messages]) if (m.status === "published" && m.countryId === null) texts.set(m.key, m.text);
    return plainToInstance(CopyBundleDto, { language, messages: [...texts].map(([key, text]) => ({ key, text })) });
  }
}
