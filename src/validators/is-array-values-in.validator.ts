import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

// Custom validator constraint
@ValidatorConstraint({ async: false })
export class IsArrayValuesInConstraint implements ValidatorConstraintInterface {
  validate(values: any[], args: ValidationArguments) {
    const [validValues] = args.constraints;
    if (!Array.isArray(values)) return false;

    return values.every((value) => validValues.includes(value));
  }

  defaultMessage(args: ValidationArguments) {
    const [validValues] = args.constraints;
    return `Each value in the array must be one of the following: ${validValues.join(', ')}`;
  }
}
