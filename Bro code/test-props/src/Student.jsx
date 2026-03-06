import PropTypes from 'prop-types';
function Student(props) {
    return (
        <div>
            <p> Name: {props.name}</p>
            <p> Age: {props.age}</p>
            <p> Student: {props.isStudent}</p>
        </div>
    );
}
Student.propTypes = {
    name: PropTypes.string.isRequired
}
Student.propTypes = {
    age: PropTypes.number.isRequired
}
Student.propTypes = {
    isStudent: PropTypes.bool.isRequired
}

export default Student;