import { ButtonProps, DropdownProps, IconButtonProps } from 'rsuite';

export interface ButtonInfo
    extends Pick<
            IconButtonProps | ButtonProps,
            'onClick' | 'active' | 'disabled'
        >,
        Pick<IconButtonProps, 'icon'> {
    title?: string;
    info?: string;
}

export interface MenuInfo extends Pick<DropdownProps, 'disabled' | 'icon'> {
    title?: string;
    buttons: (ButtonInfo | 'Divider')[];
}

export type ElementInfo = ButtonInfo | MenuInfo;

