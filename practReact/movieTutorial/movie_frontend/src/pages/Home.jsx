import MovieCard from "../components/movieCard"

function Home() {

    const movies = [
        { id: 1, title: "John Wick", release_date: 2020 },
        { id: 2, title: "Palm Front", release_date: 2025 },
        { id: 3, title: "frank Better", release_date: 2022 },
    ]

    return (
        <div className="home">
            <div className="home-grid">
                {movies.map((element) => (
                    <MovieCard movie={element} key={element.id} />
                ))}
            </div>
        </div>
    )

};

export default Home