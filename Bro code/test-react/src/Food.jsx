
function Food() {

    const food1 = "Pizza";
    const food2 = "Burger";
    const food3 = "Pasta";
    const food4 = "Spaghetti";

    return (
        <ul>
            <li>{food4.toLowerCase()}</li>
            <li>{food3.toUpperCase()}</li>
            <li>{food2.toLowerCase()}</li>
            <li>{food1.toUpperCase()}</li>
        </ul>
    );
}

export default Food;