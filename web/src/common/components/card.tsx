import React, { PropsWithChildren } from 'react';
import styled from '@emotion/styled';

const CardWrapper = styled.div`
    background-color: rgb(33, 33, 35);
    padding: 20px;
    border-radius: 10px;
    font-size: 1.1rem;
`;

export const Card: React.FC<PropsWithChildren> = (props) => (
    <CardWrapper>{props.children}</CardWrapper>
);


const CardListWrapper = styled.div`
    & > * {
        margin-top: 10px;
    } 
    padding-bottom: 10px;
    width: 100%;
`;

export const CardList: React.FC<PropsWithChildren> = (props) => (
    <CardListWrapper>{props.children}</CardListWrapper>
);
