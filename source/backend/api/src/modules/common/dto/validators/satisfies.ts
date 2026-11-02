import { registerDecorator, type ValidationOptions } from "class-validator";

/**
 * Validates a rule over the whole object, reported on the decorated property.
 * Generated for schema invariants, such as "confirmPassword must equal password".
 */
export function Satisfies<T extends object>(
  rule: (object: T) => boolean,
  options?: ValidationOptions,
): PropertyDecorator {
  return (target, propertyName) => {
    registerDecorator({
      name: "satisfies",
      target: target.constructor,
      propertyName: String(propertyName),
      ...(options === undefined ? {} : { options }),
      validator: {
        validate: (_value, args) => args !== undefined && rule(args.object as T),
      },
    });
  };
}
