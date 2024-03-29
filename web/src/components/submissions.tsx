import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DoneIcon from '@mui/icons-material/Done';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Color, DataCenter, Difficulty, ISubmission, IUser } from '../common';
import { getLeetcodeUrl } from '../utils';
import { Card, CardList } from './card';
import { HorizontalFlex, VerticalFlex } from './flex';

export interface ISubmissionProps {
    user: IUser;
    startTime?: number;
    endTime?: number;
}

const Circle = styled.div`
    height: 60px;
    width: 60px;
    border-radius: 30px;
    background: #333;
    padding: 10px;
    margin-right: 30px;

    & > svg {
        color: ${Color.GREEN};
        height: 40px;
        width: 40px;
    }
`;

function getIcon(difficulty: Difficulty) {
    if (difficulty === Difficulty.HARD) return <DoneOutlineIcon />;
    if (difficulty === Difficulty.MEDIUM) return <DoneAllIcon />;
    return <DoneIcon />
}

export const Submissions: React.FC<ISubmissionProps> = ({ user, startTime, endTime }) => {
    const [submissions, setSubmissions] = useState<ISubmission[]>([]);
    useEffect(() => {
        DataCenter.getInstance().getUserSubmissions(user, startTime, endTime)
            .then(setSubmissions);
    }, [user, startTime, endTime]);


    return (
        <CardList>
            {submissions.map((s, i) => (
                <Card key={`submission-${s.titleSlug}-${i}`}
                    onClick={() => window.open(`${getLeetcodeUrl(user.endpoint)}/problems/${s.titleSlug}/`)}>
                    <HorizontalFlex style={{ alignItems: 'center' }}>
                        <Circle>
                            {getIcon(s.difficulty)}
                        </Circle>

                        <VerticalFlex>
                            <h4 style={{ flexGrow: 1, margin: 0 }}>{s.title}</h4>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                                Accepted at {new Date(s.timestamp).toLocaleString()}
                            </p>
                        </VerticalFlex>
                    </HorizontalFlex>
                </Card>
            ))}

            {(!submissions || !submissions.length) && (
                <p>There are no submissions yet.</p>
            )}
        </CardList>
    )
};
