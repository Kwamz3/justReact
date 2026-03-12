import './App.css'

function App() {
  return (
    <>
     <Text display={'Hello'}/>
     <Text display={`What's up?`}/>
    </>
  );
}

// function Text() {
//   return (
//     <div>
//         <p>Hello world</p>
//     </div>
//   );
// }

// the use of props in a function can give it unique features
function Text({display}) {
  return (
    <div>
        <p>{display}</p>
    </div>
  );
}

export default App