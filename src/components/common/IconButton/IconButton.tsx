import { IconProps } from '@rsuite/icons/lib/Icon';
import React, { ReactElement, ReactNode } from 'react';
import cn from 'classnames';
import './IconButton.scss';
import { noop } from 'lodash';

const CLASS = 'icon-button';

export interface IconButtonProps extends IconProps {
    Icon: React.ElementType<IconProps>;
    disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({Icon, className, disabled, onClick, ...props}) => (
    <Icon className={cn(CLASS, {[`${CLASS}--disabled`]: disabled}, className)} onClick={disabled ? noop : onClick} {...props} />
)