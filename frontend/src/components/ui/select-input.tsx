import React from "react";
import Select, {
  Props as SelectProps,
  GroupBase,
  ClassNamesConfig,
} from "react-select";
import { cn } from "@/lib/utils";

// Define the interface for our custom Select component
export interface SelectInputProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectProps<Option, IsMulti, Group> {
  label?: string;
  error?: string;
  className?: string;
}

const SelectInput = <
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  {
    label,
    error,
    className,
    classNames,
    ...props
  }: SelectInputProps<Option, IsMulti, Group>,
  ref: React.Ref<any>,
) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <Select
        ref={ref}
        unstyled
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
        classNames={{
          control: ({ isFocused, isDisabled }) =>
            cn(
              "flex min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
              isFocused
                ? "ring-2 ring-ring ring-offset-2 border-primary"
                : "border-input",
              isDisabled && "cursor-not-allowed opacity-50",
            ),
          placeholder: () => "text-muted-foreground",
          input: () => "text-foreground",
          singleValue: () => "text-foreground",
          multiValue: () =>
            "bg-secondary text-secondary-foreground rounded-md mr-1 px-1",
          multiValueLabel: () => "px-1 py-0.5",
          multiValueRemove: () =>
            "hover:bg-destructive hover:text-destructive-foreground rounded-md px-1 ml-1 transition-colors",
          menu: () =>
            "mt-1.5 rounded-md border border-border bg-popover text-popover-foreground shadow-lg absolute w-full z-[9999] overflow-hidden min-w-[200px]",
          menuPortal: () => "z-[9999]",
          menuList: () => "p-1 max-h-[300px] overflow-y-auto bg-popover",
          option: ({ isFocused, isSelected }) =>
            cn(
              "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2.5 px-3 text-sm outline-none transition-colors",
              isFocused && "bg-accent text-accent-foreground",
              isSelected && "bg-primary text-primary-foreground font-medium",
              !isSelected &&
                !isFocused &&
                "text-popover-foreground hover:bg-accent/50",
            ),
          noOptionsMessage: () =>
            "p-6 text-center text-sm text-muted-foreground bg-popover",
          ...classNames,
        }}
        {...props}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default React.forwardRef(SelectInput) as <
  Option,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectInputProps<Option, IsMulti, Group> & { ref?: React.Ref<any> },
) => React.ReactElement;
