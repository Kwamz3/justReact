// For the exported default method

function MovieCard({ movie }) { 
    
    function onFavoriteClick() {
            alert('clicked')
        }
    
    <div className="movie-card">
        <div className="movie-poster">
            <img src={movie.url} alt={movie.title} />
            <div className="movie-overlay">
            <button className="favorite-btn" onClick={onFavoriteClick}>
                🤍
            </button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
        </div>
    </div>
};

// this is the default export with this you can have the name 
// and the location of the component
export default MovieCard



// // for the  named export function method

// export function MovieCard({ movie }) { 
    
//     function onFavoriteClick() {
//         alert('clicked')
//     }

//     <div className="movie-card">
//         <div className="movie-poster">
//             <img src={movie.url} alt={movie.title} />
//             <div className="movie-overlay">
//             <button className="favorite-btn" onClick={onFavoriteClick}>
//                 🤍
//             </button>
//             </div>
//         </div>
//         <div className="movie-info">
//             <h3>{movie.title}</h3>
//             <p>{movie.release_date}</p>
//         </div>
//     </div>
// };