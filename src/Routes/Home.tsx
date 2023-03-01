import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
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

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;


`
const Box = styled(motion.div)<{bgPhoto: string}>`
    background-color: white;
    background-image: url(${props => props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 65px;
    cursor: pointer;
    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
`
const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(prorps) => prorps.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 18px;
    }
`
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`

const BigMovie = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 50vh;
    top: 100px;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(prorps) => prorps.theme.black.lighter};
    text-align: center;
    font-size: 28px;
`
const BigCover = styled.div`
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center;

`
const BigTitle = styled.h2`
    color: ${(prorps) => prorps.theme.white.lighter};
    position: relative;
    top: -60px;
    padding: 10px;
    font-size: 28px;
`
const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -60px;
    color: ${(prorps) => prorps.theme.white.lighter};
    font-size: 18px;
`

const rowVariants: Variants  = {
    hidden: {
        x: window.outerWidth
    },
    visible: {
        x: 0
    }
    ,
    exit: {
        x: -window.outerWidth
    }
}

const BoxVariants: Variants ={
    normal:{
        scale: 1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    }
}

const infoVariants : Variants = {
    hover:{
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 0.3,
            type: "tween"
        }
    },
}

const offset = 6;

function Home() {
    const history = useNavigate();
    const bigMovieMatch = useMatch("/movies/:id");
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    // console.log("data", data);
    // console.log("isLoading", isLoading);
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false); 

    const increaseIndex = () => {
        if(data){
            if(leaving) return;
            setLeaving(true);
            const totalMovies = data?.results.length -1;
            // const maxIndex = Math.ceil(totalMovies / offset) -1;
            const maxIndex = Math.floor(totalMovies / offset) -1;
            setIndex((prev) => prev===maxIndex ? 0 : prev +1);
        }
        
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId: number) => {
        history(`/movies/${movieId}`);
    }
    const onOverlayClick = () => history("/");
    const clickedMovie = bigMovieMatch?.params.id && data?.results.find(movie => movie.id+"" === bigMovieMatch?.params.id);


    return (
        <Wrapper>
            {isLoading? (
                <Loader>Loading...</Loader>
                ) : (
                    <>
                        <Banner
                            onClick={increaseIndex}
                            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
                        >
                            <Title>{data?.results[0].title}</Title>
                            <Overview>{data?.results[0].overview}</Overview>
                        </Banner>
                        <Slider>
                            <AnimatePresence 
                                initial={false}
                                onExitComplete={toggleLeaving}
                            >
                                <Row
                                    key={index}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{type:"tween", duration:1}}
                                >
                                    {data?.results
                                    .slice(1)
                                    .slice(offset * index, offset * index + offset).map((movie)=> (
                                        <Box 
                                            key={movie.id}
                                            whileHover="hover"
                                            initial="normal"
                                            variants={BoxVariants}
                                            transition={{type:"tween"}}
                                            bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                                            onClick={()=>onBoxClicked(movie.id)}
                                            layoutId={movie.id+""}
                                        >
                                            <Info variants={infoVariants}>
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                                </Row>
                            </AnimatePresence>    
                        </Slider>
                        <AnimatePresence>

                            {bigMovieMatch ? (
                                <>
                                    <Overlay 
                                        onClick={onOverlayClick}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                    />
                                    <BigMovie
                                        layoutId={bigMovieMatch.params.id}
                                    >
                                        {clickedMovie && <>
                                            <BigCover 
                                                style={{backgroundImage: `url(${makeImagePath(clickedMovie.backdrop_path, "w500")})`}} 
                                            />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>}
                                    </BigMovie>
                                </>    
                            ) : null}
                        </AnimatePresence>
                    </>
                )}
        </Wrapper>
    );
}

export default Home;