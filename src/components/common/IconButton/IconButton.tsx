import { IconProps } from '@rsuite/icons/lib/Icon';
import React from 'react';
import cn from 'classnames';
import './IconButton.scss';
import { noop } from 'lodash';
import { Tooltip, Whisper } from 'rsuite';

const CLASS = 'icon-button';

export interface IconButtonProps extends IconProps {
    Icon: React.ElementType<IconProps>;
    disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
    Icon,
    className,
    disabled,
    onClick,
    title,
    ...props
}) => (
    <Whisper
        trigger={title ? 'hover' : 'none'}
        placement={'top'}
        delayOpen={400}
        speaker={<Tooltip className={`${CLASS}__popover`}>{title}</Tooltip>}
    >
        <Icon
            className={cn(
                CLASS,
                { [`${CLASS}--disabled`]: disabled },
                className
            )}
            onClick={disabled ? noop : onClick}
            {...props}
        />
    </Whisper>
);
