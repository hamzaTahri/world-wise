import {createContext, useContext, useEffect, useState} from "react";

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

function CitiesProvider({children}) {

    const [cities, setCities] = useState([])
    const [currentCity, setCurrentCity] = useState({})
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true)
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data);
            } catch {
                alert('There was an error Loading data')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCities()
    }, []);

    async function fetchCity(id) {
        try {
            setIsLoading(true)
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            setCurrentCity(data);
        } catch {
            alert('There was an error Loading data')
        } finally {
            setIsLoading(false)
        }
    }

    return <CitiesContext.Provider
        value={{
            cities, setCities, isLoading, setIsLoading, currentCity, fetchCity
        }}>
        {children}
    </CitiesContext.Provider>
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw Error("CitiesContext cannot be used Outside of CitiesProvider")
    return context;
}

export {CitiesProvider, useCities};