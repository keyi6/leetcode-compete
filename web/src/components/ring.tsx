import React, { useRef, useMemo } from 'react';
import { range } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { color } from 'd3-color';
import { Color } from '../common/constants';
import { Px } from '../common/interfaces';

function cumulate(values: number[]) {
    let from = 0;
    return values.map(value => ({ value, from, to: (from += value) }));
}

function partitionOnce(total: number, part: number) {
    if (total >= part) return [part, total - part];
    else return [total, 0];
}

function interpolateColor(colors: string[]) {
    const length = colors.length;
    const domain = range(length).map((i) => i / (length - 1));
    return scaleLinear<string, string>().domain(domain).range(colors);
}

function computeGradientRotation(angle: number) {
    return {
        x1: Math.cos(angle) * 0.5 + 0.5,
        y1: Math.sin(angle) * 0.5 + 0.5,
        x2: Math.cos(angle - Math.PI) * 0.5 + 0.5,
        y2: Math.sin(angle - Math.PI) * 0.5 + 0.5
    };
}

function useId() {
    return useRef<string>(Math.random().toString(36).slice(2, 10)).current;
}

interface IRingProps {
    angle: number;
    radius: number;
    strokeWidth: number;
    cx?: number;
    cy?: number;
    colors: string[];
    phase?: number;
}

const Ring: React.FC<IRingProps> = ({
    angle, radius, strokeWidth, colors,
    cx = 0, cy = 0, phase: initialPhase = -Math.PI / 2
}) => {
    const singleLapAngle = Math.min(angle, Math.PI * 2);
    const ringRotationAngle = angle - singleLapAngle;
    const phase = initialPhase + ringRotationAngle;

    const partitionAngles = partitionOnce(singleLapAngle, Math.PI);
    const [segmentStart, segmentEnd] = cumulate(partitionAngles);

    const colorInterp = interpolateColor(colors.slice(0, 3));

    const arcX = (angle: number) => Math.cos(angle + phase) * radius + cx;
    const arcY = (angle: number) => Math.sin(angle + phase) * radius + cy;

    const path = (segment: {
        value: number;
        from: number;
        to: number;
    }) => `
        M ${arcX(segment.from)} ${arcY(segment.from)} 
        A 
        ${radius} ${radius} 
        0 ${segment.value > Math.PI ? 1 : 0} 1 
        ${arcX(segment.to)} ${arcY(segment.to)}`;

    const gradientEndId = useId();
    const gradientStartId = useId();
    const maskEndId = useId();
    const maskStartId = useId();
    const gradientShadowId = useId();

    const gradientAngle = Math.max(0, angle - Math.PI * 2) + initialPhase;
    const gradientRotation = computeGradientRotation(gradientAngle);
    const gradientSide = radius * 2 + strokeWidth;
    return (
        <g>
            <defs>
                <linearGradient id={gradientStartId} {...gradientRotation}>
                    <stop offset="15%" stopColor={colorInterp(0)} />
                    <stop offset="85%" stopColor={colorInterp(0.5)} />
                </linearGradient>

                <linearGradient id={gradientEndId} {...gradientRotation}>
                    <stop offset="15%" stopColor={colorInterp(1)} />
                    <stop offset="85%" stopColor={colorInterp(0.5)} />
                </linearGradient>

                <radialGradient id={gradientShadowId}>
                    <stop offset="40%" stopColor="black" />
                    <stop offset="100%" stopColor="black" stopOpacity={0} />
                </radialGradient>
            </defs>

            <mask id={maskStartId}>
                <path
                    d={path(segmentStart)}
                    strokeWidth={strokeWidth}
                    stroke="white"
                    fill="none"
                    strokeLinecap="round"
                />
            </mask>

            <mask id={maskEndId}>
                <path
                    d={path(segmentEnd)}
                    strokeWidth={strokeWidth}
                    stroke="white"
                    fill="none"
                    strokeLinecap="round"
                />
            </mask>


            <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={colorInterp(0.5)}
                opacity={0.2}
                strokeWidth={strokeWidth}
            />

            <rect
                x={cx - gradientSide / 2}
                y={cy - gradientSide / 2}
                width={gradientSide}
                height={gradientSide}
                fill={`url(#${gradientStartId})`}
                mask={`url(#${maskStartId})`}
            />

            <circle
                r={strokeWidth / 2 + 6}
                cx={arcX(segmentEnd.to)}
                cy={arcY(segmentEnd.to)}
                fill={`url(#${gradientShadowId})`}
                mask={`url(#${maskStartId})`}
                opacity={angle > Math.PI * 1.5 ? 1 : 0}
            />

            {angle >= Math.PI && (
                <rect
                    x={cx - gradientSide / 2}
                    y={cy - gradientSide / 2}
                    width={gradientSide}
                    height={gradientSide}
                    fill={`url(#${gradientEndId})`}
                    mask={`url(#${maskEndId})`}
                />
            )}
        </g>
    );
};

function lighten(c: string) {
    return color(c)!.rgb().darker(-3).toString();
}

export interface IRingsProps {
    percentage: [number, number, number];
    size?: Px;
}


export const Rings: React.FC<IRingsProps> = ({ size = 72, percentage }) => {
    const width = size;
    const height = size;

    const angles = percentage.map(p => p * Math.PI * 2 / 100);
    const { innerRadius, ringSpacing, strokeWidth } = useMemo(() => ({
        ringSpacing: 2,
        innerRadius: Math.round(size / 8),
        strokeWidth: Math.round(size / 8),
    }), [size]);

    return (
        <svg style={{ height, width }} >
            {[Color.RED, Color.GREEN, Color.BLUE].map((color, index) => (
                <Ring
                    colors={[color, lighten(color)]}
                    cx={width / 2}
                    cy={height / 2}
                    angle={angles[index]}
                    radius={innerRadius + (strokeWidth + ringSpacing) * (2 - index)}
                    strokeWidth={strokeWidth}
                    key={`ring-${color}`}
                />
            ))}
        </svg>
    );
};
