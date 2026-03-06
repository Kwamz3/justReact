
function Food() {

    const food1 = "Pizza";
    const food2 = "Burger";

    return (
        <ul>
            <li>Apple</li>
            <li>{food2.toLowerCase()}</li>
            <li>{food1.toUpperCase()}</li>
        </ul>
    );
}

export default Food;