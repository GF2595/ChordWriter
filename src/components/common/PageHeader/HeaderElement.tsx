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

const CLASS = 'header-element';

export interface HeaderElementProps {
    element: ElementInfo;
}

export const HeaderElement: React.FC<HeaderElementProps> = ({ element }) => {
    if ('buttons' in element) {
        const { buttons } = element;

        return (
            // Видимо, разработчики потеряли size при типизации
            // @ts-ignore
            <Dropdown className={`${CLASS}__button`} size={'xs'} {...element}>
                {buttons.map((menuElement, index) => {
                    if (menuElement === 'Divider')
                        return <Divider className={`${CLASS}__divider`} />;

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

    const { icon, info, title } = element;

    return (
        <Whisper
            trigger={info ? 'hover' : 'none'}
            placement={'bottomStart'}
            delayOpen={600}
            speaker={<Tooltip className={`${CLASS}__popover`}>{info}</Tooltip>}
        >
            {icon ? (
                <IconButton
                    className={`${CLASS}__button`}
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

