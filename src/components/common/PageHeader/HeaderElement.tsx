import React from 'react';
import {
    Button,
    Divider,
    Dropdown,
    IconButton,
    Tooltip,
    Whisper,
} from 'rsuite';
import './HeaderElement.scss';
import { ElementInfo } from './types';
import cn from 'classnames';

const CLASS = 'header-element';

export const HeaderElement: React.FC<ElementInfo> = ({ title, ...element }) => {
    if ('buttons' in element) {
        const { buttons } = element;

        return (
            <Dropdown
                className={`${CLASS}__button`}
                // Видимо, разработчики потеряли size при типизации
                // @ts-ignore
                size={'xs'}
                title={title}
                {...element}
            >
                {buttons.map((menuElement, index) => {
                    if (menuElement === 'Divider')
                        return (
                            <Divider
                                key={`divider.${index}`}
                                className={`${CLASS}__divider`}
                            />
                        );

                    const { info, title } = menuElement;

                    return (
                        <Whisper
                            key={`${title}.${index}`}
                            trigger={info ? 'hover' : 'none'}
                            placement={'right'}
                            delayOpen={600}
                            speaker={
                                <Tooltip className={`${CLASS}__popover`}>
                                    {info}
                                </Tooltip>
                            }
                        >
                            <Dropdown.Item {...menuElement} title={undefined}>
                                {title}
                            </Dropdown.Item>
                        </Whisper>
                    );
                })}
            </Dropdown>
        );
    }

    const { icon, info, active } = element;

    return (
        <Whisper
            trigger={info ? 'hover' : 'none'}
            placement={'bottomStart'}
            delayOpen={600}
            speaker={<Tooltip className={`${CLASS}__popover`}>{info}</Tooltip>}
        >
            {icon ? (
                <IconButton
                    className={cn(`${CLASS}__button`, {
                        [`${CLASS}__button_active`]: active,
                    })}
                    size={'xs'}
                    {...element}
                >
                    {title}
                </IconButton>
            ) : (
                <Button className={`${CLASS}__button`} size={'xs'} {...element}>
                    {title}
                </Button>
            )}
        </Whisper>
    );
};

