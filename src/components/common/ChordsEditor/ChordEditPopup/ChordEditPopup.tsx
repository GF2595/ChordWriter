import { ChordType } from '@model/song';
import React, { forwardRef, useState } from 'react';
import { Input, Popover, PopoverProps } from 'rsuite';
import CheckIcon from '@rsuite/icons/Check';
import TrashIcon from '@rsuite/icons/Trash';
import cn from 'classnames';
import './ChordEditPopup.scss';

const CLASS = 'chord-edit-popup';

export interface ChordEditPopupProps extends Omit<PopoverProps, 'className'> {
    chord?: ChordType;
    onSubmit: (chord: ChordType) => void;
    className?: string;
    onRemove?: () => void;
}

export const ChordEditPopup = forwardRef<HTMLDivElement, ChordEditPopupProps>(
    ({ chord: initialChord, onSubmit, onRemove, className, ...props }, ref) => {
        const [fullChord, setFullChord] = useState<ChordType>(
            initialChord ?? { chord: '', mod: '' }
        );

        const { chord, mod } = fullChord;

        return (
            <Popover ref={ref} {...props} className={cn(CLASS, className)}>
                <div
                    onKeyDown={(event) => {
                        if (chord.length && event.key === 'Enter')
                            onSubmit(fullChord);
                    }}
                    className={`${CLASS}__container`}
                >
                    {chord.length ? (
                        <span className={`${CLASS}__chord-view`}>
                            {chord}
                            <sub>{mod}</sub>
                        </span>
                    ) : (
                        'Введите аккорд'
                    )}
                    <div className={`${CLASS}__input-container`}>
                        <Input
                            autoFocus
                            size={'sm'}
                            value={chord}
                            className={`${CLASS}__chord-input`}
                            onChange={(value) =>
                                setFullChord({
                                    ...fullChord,
                                    chord: `${value}`,
                                })
                            }
                        />
                        <sub>
                            <Input
                                size={'xs'}
                                value={mod}
                                className={cn(
                                    `${CLASS}__chord-input`,
                                    `${CLASS}__chord-input_mod`
                                )}
                                onChange={(value) =>
                                    setFullChord({
                                        ...fullChord,
                                        mod: `${value}`,
                                    })
                                }
                            />
                        </sub>
                    </div>
                    <div>
                        <CheckIcon
                            className={cn(`${CLASS}__icon`, {
                                [`${CLASS}__icon_enabled`]: !!chord.length,
                            })}
                            fill={!chord.length ? 'lightgray' : undefined}
                            onClick={() =>
                                !!chord.length && onSubmit(fullChord)
                            }
                        />
                        {!!onRemove && (
                            <TrashIcon
                                className={cn(
                                    `${CLASS}__icon`,
                                    `${CLASS}__icon_enabled`
                                )}
                                onClick={onRemove}
                                fill={'firebrick'}
                            />
                        )}
                    </div>
                </div>
            </Popover>
        );
    }
);

ChordEditPopup.displayName = 'ChordEditPopup';
