import {
  TextInput,
  TextInputProps,
  ActionIconProps,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import { Search, ArrowRight, ArrowLeft } from 'tabler-icons-react';

export function SearchBar({
  textProps,
  buttonProps,
  formProps,
}: {
  textProps?: TextInputProps;
  buttonProps?: Omit<ActionIconProps<'button'>, 'children'>;
  formProps?: React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;
}) {
  const theme = useMantineTheme();
  return (
    <form {...formProps}>
      <TextInput
        icon={<Search size={18} />}
        radius="xl"
        size="md"
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            type="submit"
            color={theme.primaryColor}
            variant="filled"
            {...buttonProps}>
            {theme.dir === 'ltr' ? (
              <ArrowRight size={18} />
            ) : (
              <ArrowLeft size={18} />
            )}
          </ActionIcon>
        }
        rightSectionWidth={42}
        {...textProps}
      />
    </form>
  );
}
