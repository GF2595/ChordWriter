import { IconButton, IconButtonProps } from '@components/common/IconButton';
import React from 'react';

export interface IconButtonInfo
    extends Pick<IconButtonProps, 'Icon' | 'onClick' | 'disabled' | 'fill'> {
    title?: string;
}

export interface IconButtonClusterProps {
    buttons: IconButtonInfo[];
    className?: string;
    buttonClassName?: string;
}

export const IconButtonCluster: React.FC<IconButtonClusterProps> = ({
    buttons,
    className,
    buttonClassName,
}) => {
    return (
        <div className={className}>
            {buttons.map((button) => (
                <IconButton className={buttonClassName} {...button} />
            ))}
        </div>
    );
};
