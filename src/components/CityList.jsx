import styles from "./CityList.module.css";
import Spinner from "./Spinner.jsx";
import CityItem from "./CityItem.jsx";
import Message from "./Message.jsx";
import {useCities} from "../context/CitiesContext.jsx";

export default function CityList() {
    const {cities, isLoading} = useCities();
    if (isLoading) return <Spinner/>
    if (!cities.length) return <Message message="Add Your City by clicking on the city on map"/>
    return <ul className={styles.cityList}>
        {cities.map(city => (<CityItem city={city} key={city.id}/>))}
    </ul>
}