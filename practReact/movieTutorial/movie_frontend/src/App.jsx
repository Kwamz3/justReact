import './App.css'
import Home from './pages/Home'

function App() { 
  return (
    <Home/>
  )
};

// // when importing with the default export
// import MovieCard from './components/movieCard'

// else if it is a named exported 
// import {MovieCard} from './components/movieCard'


// function App() {
//   return (
//     <>
//       <MovieCard movie={{title:"Tim's film", release_date: "2024"}} />
//       <MovieCard movie={{title:"John's film", release_date: "2020"}} />
//       <MovieCard movie={{title:"Mark's film", release_date: "2017"}} />
//     </>
//   );
// }

// // writing the props directly into the function
// function App() {
//   return (
//     <>
//      <Text display={'Hello'}/>
//      <Text display={`What's up?`}/>
//     </>
//   );
// }

// function Text() {
//   return (
//     <div>
//         <p>Hello world</p>
//     </div>
//   );
// }

// // the use of props in a function can give it unique features
// function Text({display}) {
//   return (
//     <div>
//         <p>{display}</p>
//     </div>
//   );
// }

// export default App
export default App