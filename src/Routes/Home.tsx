import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';
import { getMovies, IGetMoviesResult } from '../api';
import { makeImagePath } from '../utilities';

const Wrapper = styled.div`
    background-color: black;
`
const Loader = styled.div`
    height: 200vh;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Banner = styled.div<{bgPhoto: string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)) ,url(${(props) => props.bgPhoto});
    background-size: cover;
`
const Title = styled.h2`
    font-size: 72px;
    font-weight: bold;
    margin-bottom: 20px;
`;
const Overview = styled.p`
    font-size: 36px;
    width: 50%;
`;


function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    console.log("data", data)
    console.log("isLoading", isLoading)
    return (
        <Wrapper>
            {isLoading? (
                <Loader>Loading...</Loader>
                ) : (
                    <>
                        <Banner
                            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                        >
                            <Title>{data?.results[0].title}</Title>
                            <Overview>{data?.results[0].overview}</Overview>
                        </Banner>
                    </>
                )}
        </Wrapper>
    );
}

export default Home;