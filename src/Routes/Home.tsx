import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getMovies } from '../api';

function Home() {
    const {data, isLoading} = useQuery(["movies", "nowPlaying"], getMovies);
    console.log("data", data)
    console.log("isLoading", isLoading)
    return (
        <div style={{
            backgroundColor: "#555",
            height: "200vh"
        }}>
            
        </div>
    );
}

export default Home;