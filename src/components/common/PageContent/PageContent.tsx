import React from 'react';
import './PageContent.scss';
import cn from 'classnames';
import { Content } from 'rsuite';

export const PageContent: React.FC<{ className?: string }> = ({
    children,
    className,
}) => <Content className={cn('page-content', className)}>{children}</Content>;
