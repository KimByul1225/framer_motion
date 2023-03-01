import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useState } from 'react';
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
    color: red;
    font-size: 65px;
    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
`
const rowVariants = {
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

const offset = 6;


function Home() {
    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    console.log("data", data);
    console.log("isLoading", isLoading);
    const [index, setIndex] = useState(0);
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

    const [leaving, setLeaving] = useState(false); 
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
                                        />
                                    ))}
                                </Row>
                            </AnimatePresence>    
                        </Slider>
                    </>
                )}
        </Wrapper>
    );
}

export default Home;