import React from 'react';
import {
    Button,
    ButtonProps,
    Header,
    IconButton,
    IconButtonProps,
    Tooltip,
    Whisper,
} from 'rsuite';
import './PageHeader.scss';

const CLASS = 'header';

export interface ButtonInfo
    extends Pick<
            IconButtonProps | ButtonProps,
            'onClick' | 'active' | 'disabled'
        >,
        Pick<IconButtonProps, 'icon'> {
    title?: string;
    info?: string;
}

export interface PageHeaderProps {
    buttons: ButtonInfo[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ buttons }) => {
    return (
        <Header className={CLASS}>
            <div className={`${CLASS}_content`}>
                {buttons.map(({ title, info, ...button }, index) => {
                    const { icon } = button;

                    return (
                        <Whisper
                            key={`button.${title}.${index}`}
                            trigger={info ? 'hover' : 'none'}
                            placement={'bottomStart'}
                            delayOpen={400}
                            speaker={
                                <Tooltip className={`${CLASS}__popover`}>
                                    {info}
                                </Tooltip>
                            }
                        >
                            {icon ? (
                                // TODO: key index
                                <IconButton
                                    className={`${CLASS}__button`}
                                    key={`btn_${index}`}
                                    size={'xs'}
                                    {...button}
                                >
                                    {title}
                                </IconButton>
                            ) : (
                                // TODO: key index
                                <Button
                                    className={`${CLASS}__button`}
                                    key={`btn_${index}`}
                                    size={'xs'}
                                    {...button}
                                >
                                    {title}
                                </Button>
                            )}
                        </Whisper>
                    );
                })}
            </div>
        </Header>
    );
};

