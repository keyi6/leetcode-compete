import styled from '@emotion/styled';
import { Color } from '../common';

export const Card= styled.div`
    background-color: #212121;
    padding: 20px;
    border-radius: 10px;
    font-size: 1.1rem;
    display: block;
    width: 100%;
    color: #fff;
    transition: opacity 0.5s, background-color 0.5s;

    &:hover {
        cursor: pointer;
        background-color: #3A3A3A;
        opacity: 0.8;
    }

    &:active {
        opacity: 0.6;
    }

    & * {
        pointer-events: none;
    }
`;


export const CardList = styled.div`
    & > * {
        margin-top: 10px;
    } 
    padding-bottom: 10px;
    width: 100%;
`;
