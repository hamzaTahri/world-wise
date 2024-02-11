import {useEffect, useState} from "react";

import styles from "./Form.module.css";
import Button from "./Button.jsx";
import * as PropTypes from "prop-types";
import {BackButton} from "./BackButton.jsx";
import {useUrlPosition} from "../hooks/useUrlPosition.js";
import Message from "./Message.jsx";
import Spinner from "./Spinner.jsx";

const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;
export function convertToEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

BackButton.propTypes = {onClick: PropTypes.func};

function Form() {
    const [cityName, setCityName] = useState("");
    const [country, setCountry] = useState("");
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState(false);
    const [geoCodingError, setGeoCodingError] = useState("");

    const [lat, lng] = useUrlPosition();
    const [emoji, setEmoji] = useState("");

    useEffect(() => {
        async function fetchCityData() {
            try {
                setIsLoadingGeoCoding(true)
                setGeoCodingError("")
                const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
                const data = await res.json();
                if(!data.countryCode) throw new Error("There is nothing to visit in there 😒")
                setCityName(data.city || data.locality ||"");
                setCountry(data.countryName || data.locality ||"");
                setEmoji(convertToEmoji(data.countryCode))
            } catch (error) {
                setGeoCodingError(error.message)
            } finally {
                setIsLoadingGeoCoding(false)
            }
        }
        fetchCityData()
    }, [lat, lng]);

    if(isLoadingGeoCoding) return <Spinner/>
    if(geoCodingError) return <Message message={geoCodingError}/>

    return (
        <form className={styles.form}>
            <div className={styles.row}>
                <label htmlFor="cityName">City name</label>
                <input
                    id="cityName"
                    onChange={(e) => setCityName(e.target.value)}
                    value={cityName}
                />
                 <span className={styles.flag}>{emoji}</span>
            </div>

            <div className={styles.row}>
                <label htmlFor="date">When did you go to {cityName}?</label>
                <input
                    id="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                />
            </div>

            <div className={styles.row}>
                <label htmlFor="notes">Notes about your trip to {cityName}</label>
                <textarea
                    id="notes"
                    onChange={(e) => setNotes(e.target.value)}
                    value={notes}
                />
            </div>

            <div className={styles.buttons}>
                <Button type="primary">Add</Button>
                <BackButton/>
            </div>
        </form>
    );
}

export default Form;
