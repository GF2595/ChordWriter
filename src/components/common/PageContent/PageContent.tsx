import cn from 'classnames';
import React from 'react';
import { Content } from 'rsuite';
import './PageContent.scss';

export interface PageContentProps {
    className?: string;
    children?: React.ReactNode;
}

export const PageContent: React.FC<PageContentProps> = ({
    children,
    className,
}) => <Content className={cn('page-content', className)}>{children}</Content>;
