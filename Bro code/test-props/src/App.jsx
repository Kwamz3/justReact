import Student from './Student.jsx'
function App() { 
  return (
    <>
      <Student name="John Doe"
        age={20}
        isStudent={true ? "Yes" : "No"} 
      />
    </>
  );
}

export default App;