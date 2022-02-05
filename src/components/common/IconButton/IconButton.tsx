import { IconProps } from '@rsuite/icons/lib/Icon';
import React, { ReactElement, ReactNode } from 'react';
import cn from 'classnames';
import './IconButton.scss';

const CLASS = 'icon-button';

export interface IconButtonProps extends IconProps {
    Icon: React.ElementType<IconProps>;
}

export const IconButton: React.FC<IconButtonProps> = ({Icon, className, ...props}) => (
    <Icon className={cn(CLASS, className)} {...props} />
)