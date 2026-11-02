import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

import { type Actor, runAsActor } from "#/auth/actor-context";

/** Runs the handler with the actor the AuthGuard verified, so use cases can read it. */
@Injectable()
export class ActorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const actor = context.switchToHttp().getRequest<{ actor?: Actor }>().actor;
    if (!actor) return next.handle();
    return new Observable((subscriber) => runAsActor(actor, () => next.handle().subscribe(subscriber)));
  }
}
