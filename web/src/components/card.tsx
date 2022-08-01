import styled from '@emotion/styled';

export const Card= styled.div`
    background-color: rgb(33, 33, 35);
    padding: 20px;
    border-radius: 10px;
    font-size: 1.1rem;
    display: block;
    width: 100%;
    color: #fff;

    &:hover {
        cursor: pointer;
    }

    &:active {
        background-color: #222;
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
