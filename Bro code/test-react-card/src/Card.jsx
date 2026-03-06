import profilePic from './assets/Fabiola.jpg';
function Card() { 
    return (
        <div className="card">
            <img className="card-image" src={profilePic}  alt="profile pic"></img>
            <h2 className='card-title'>Charles David</h2>
            <p className='card-text'>This is coding in React</p>
        </div>
    );
}

export default Card;