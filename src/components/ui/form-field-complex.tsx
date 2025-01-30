import { FormField } from "./form";
import {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

/**
 * FormFieldComplex is a wrapper component for FormField that adds support for server actions
 * by automatically including a hidden input field with the form value.
 *
 * This is particularly useful for complex form controls (like date pickers, rich text editors, etc.)
 * that need to work with both client-side form validation and server actions.
 *
 * @example
 * ```tsx
 * <FormFieldComplex
 *   form={form}
 *   name="date"
 *   render={({ field }) => (
 *     <DatePicker {...field} />
 *   )}
 * />
 * ```
 */
export const FormFieldComplex = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  form,
  ...props
}: ControllerProps<TFieldValues, TName> & {
  form: UseFormReturn<TFieldValues>;
}) => {
  return (
    <>
      <FormField {...props} />
      <input
        type="hidden"
        name={props.name}
        value={form.getValues(props.name) || ""}
      />
    </>
  );
};

