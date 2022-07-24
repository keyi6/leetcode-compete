import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Color } from '../constants';
import { Px } from '../interfaces';

const ringProgress = keyframes`
    0% { stroke-dasharray: 0 100; }
`;


const RingWrapper = styled.svg`
    .ring {
        transform-origin: 50%;
    }

    .completed {
        animation: ${ringProgress} 1s ease-in-out forwards;
        stroke-linecap: round;
    }

    circle {
        fill: none;
    }

    ${[Color.RED, Color.GREEN, Color.BLUE].map((color, index) => (
        `.ring${index} {
            .background {
                stroke: ${color};
                opacity: 0.2;
            }
            .completed {
                stroke: ${color};
            }   
        }`
    ))}
`; 

export interface IRingProps {
    percentage: [number, number, number];
    size?: Px;
}

export const Ring: React.FC<IRingProps> = (props) => {
    const size = props.size || 64;

    return (
        <RingWrapper style={{ height: size, width: size }} viewBox="0 0 37 37">
            {[
                { strokeWidth: 4, scale: 1 },
                { strokeWidth: 5, scale: 0.7 },
                { strokeWidth: 10, scale: 0.4 },
            ].map(({ strokeWidth, scale }, index) => (
                <g className={`ring ring${index}`} style={{ transform: `scale(${scale}) rotate(-90deg)` }} key={`ring-${index}`}>
                    <circle strokeWidth={strokeWidth} r="15.915" cx="50%" cy="50%" className="background" />
                    <circle strokeWidth={strokeWidth} r="15.915" cx="50%" cy="50%" className="completed"
                        strokeDasharray={`${Math.max(props.percentage[index], 1)}, 100`} />
                </g>
            ))}
        </RingWrapper>
    );
};