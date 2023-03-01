import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

function Search() {
    const location = useLocation();
    console.log("location", location);
    const search = new URLSearchParams(location.search)
    const keyword = search.get("keyword");
    console.log("keyword", keyword)

    return (
        <div>
            {keyword}
        </div>
    );
}

export default Search;