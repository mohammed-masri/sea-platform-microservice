import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsArrayValuesInConstraint } from 'src/validators/is-array-values-in.validator';

export function IsArrayValuesIn(
  validValues: any[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [validValues],
      validator: IsArrayValuesInConstraint,
    });
  };
}
