
function MovieCard({movie}) {
    
    function onFavouriteClick() {
        alert('clicked')
    }

    return <div className= "movie-card">
        <div className= "movie-poster">
            <img src={movie.url} alt={movie.title} />
        </div>
        <div className= "movie-overlay">
            <button className="favourite-btn" onClick= {onFavouriteClick}>
                    
            </button>
        </div>
    </div>
}

export default MovieCard