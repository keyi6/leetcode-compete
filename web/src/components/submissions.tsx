import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import DoneIcon from '@mui/icons-material/Done';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { ISubmission } from '../common/data_center/services';
import { Color, DataCenter, Difficulty, IUser } from '../common';
import { getLeetcodeUrl } from '../utils';
import { Card, CardList } from './card';
import { HorizontalFlex } from './flex';

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
                    <HorizontalFlex>
                        <Circle>
                            {getIcon(s.difficulty)}
                        </Circle>

                        <h4 style={{ flexGrow: 1, margin: 0 }}>{s.title}</h4>
                    </HorizontalFlex>
                </Card>
            ))}
        </CardList>
    )
};
