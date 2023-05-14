import { Chord, ChordProps } from '@common/ChordsEditor';
import React from 'react';
import { useDrag } from 'react-dnd';
import { DragItem } from './types';

export interface DraggableChordProps extends ChordProps {
    dragItem: DragItem;
    type: string;
}

export const DraggableChord: React.FC<DraggableChordProps> = ({
    className,
    dragItem,
    type,
    ...chordProps
}) => {
    const [{ opacity }, dragRef] = useDrag<DragItem, void, { opacity: number }>(
        () => ({
            type,
            item: dragItem,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.1 : 1,
            }),
        }),
        [dragItem]
    );

    return (
        <div className={className} ref={dragRef} style={{ opacity }}>
            <Chord {...chordProps} />
        </div>
    );
};

