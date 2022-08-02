import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import { Color, Goal } from '../common';
import { Ring, VerticalFlex } from '../components';
import { DAILY_LIMIT } from '../utils';

const Title = styled.h2`
    size: 2rem;
    margin: 30px 0 0 0;
`;

const Bold = styled.b`
    color: ${Color.GREEN};
    opacity: 0.8;
`;

const Line = styled.p`
    margin: 10px 0;
`;

export const Rules: React.FC = () => {
    const nav = useNavigate();
    return (
        <VerticalFlex>
            <h1 style={{ marginBottom: 0 }}>Rules</h1>
            <Line>Basically, this is just like Apple Fitness.</Line>
            
            <Title>Competition rules</Title>
            <Line>
                Every competition will last for <Bold>7 days</Bold>.
                You can earn up <Bold>{DAILY_LIMIT} points</Bold> daily.
                In the end, the one with the highest score will win.
            </Line>
            <Line>For solving each <Bold>easy/medium/hard</Bold> problem, you can earn <Bold>80/100/200 points</Bold>.</Line>
            <Line>
                You can <Bold>start a competition with anyone in the user page</Bold> once you add one in your watch list.
                The competition link is persistent, therefore you can save the link or <Bold>share it to your opponents</Bold> to check the competition status.
            </Line>
            <Line>
                There is no way to refuse a competition from your friend.
                Once your friend choose to compete with you, this competition status will show on your page as well.
            </Line>

            <Title>Ring</Title>
            <Line>Just like the ring on Apple Watch, this ring indicates how your are doing in Leetcode on a daily basis.</Line>
            <Ring percentage={[100, 100, 100]} size={100}></Ring>
            <Line>
                The outer ring stands for the <Bold>total accepted submissions count</Bold> you made.
                To get a full ring, you must achieve <Bold>{Goal.TOTAL}</Bold>.
            </Line>
            <Line>
                The meddle ring stands for the <Bold>count of easy and medium problems you solve</Bold>.
                To get a full ring, you must achieve <Bold>{Goal.EASY_AND_MEDIUM}</Bold>.
            </Line>
            <Line>
                The inner ring stands for the <Bold>count of hard problems you solve</Bold>.
                To get a full ring, you must achieve <Bold>{Goal.HARD}</Bold>.
            </Line>

            <Title>Contact</Title>
            <Line>
                If there is any question or suggestion about this project, please contact me on <Link href="https://github.com/cjhahaha/leetcode-compete" target="_blank">Github</Link>.
                This is an open source project just for fun. There is also <Bold>a docker image provided for personal usage</Bold>.
            </Line>
            <Line>
                Project source code: <Link href="https://github.com/cjhahaha/leetcode-compete" target="_blank">https://github.com/cjhahaha/leetcode-compete</Link>
            </Line>

            <Button style={{ marginTop: 30 }} onClick={() => nav('/')} variant="contained">GET STARTED</Button>
        </VerticalFlex>
    );
};