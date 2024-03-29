import styles from "./CountryList.module.css";
import Spinner from "./Spinner.jsx";
import CountryItem from "./CountryItem.jsx";
import Message from "./Message.jsx";
import {useCities} from "../context/CitiesContext.jsx";

export default function CountryList() {
    const {cities, isLoading} = useCities();
    if (isLoading) return <Spinner/>
    if (!cities.length) return <Message message="Add Your City by clicking on the city on map"/>


    const countries = cities.reduce((arr, city) => {
        if (!arr.map((el) => el.country).includes(city.country))
            return [...arr, {country: city.country, emoji: city.emoji}];
        else
            return arr;
    }, []);
    return <ul className={styles.countryList}>
        {/* eslint-disable-next-line react/jsx-key */}
        {countries.map((country, index) => (<CountryItem country={country} key={index}/>))}
    </ul>
}