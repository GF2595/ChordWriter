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
        // //React.FC<ChordEditPopupProps> = ({
        //     chord: initialChord,
        //     onSubmit: _onSubmit,
        //     ...props
        // }) => {
        const [chord, setChord] = useState<ChordType>(
            initialChord ?? { chord: '', mod: '' }
        );

        return (
            <Popover ref={ref} {...props} className={cn(CLASS, className)}>
                <div className={`${CLASS}__container`}>
                    {chord.chord.length ? (
                        <span className={`${CLASS}__chord-view`}>
                            {chord.chord}
                            <sub>{chord.mod}</sub>
                        </span>
                    ) : (
                        'Введите аккорд'
                    )}
                    <div className={`${CLASS}__input-container`}>
                        <Input
                            size={'sm'}
                            value={chord.chord}
                            className={`${CLASS}__chord-input`}
                            onChange={(value) =>
                                setChord({
                                    ...chord,
                                    chord: `${value}`,
                                })
                            }
                        />
                        <sub>
                            <Input
                                size={'xs'}
                                value={chord.mod}
                                className={cn(
                                    `${CLASS}__chord-input`,
                                    `${CLASS}__chord-input_mod`
                                )}
                                onChange={(value) =>
                                    setChord({
                                        ...chord,
                                        mod: `${value}`,
                                    })
                                }
                            />
                        </sub>
                    </div>
                    <div>
                        <CheckIcon
                            className={cn(`${CLASS}__icon`, {
                                [`${CLASS}__icon_enabled`]:
                                    !!chord.chord.length,
                            })}
                            fill={!chord.chord.length ? 'lightgray' : undefined}
                            onClick={() => onSubmit(chord)}
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
