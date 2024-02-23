import {createContext, useCallback, useContext, useEffect, useReducer} from "react";

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

function CitiesProvider({children}) {

    const initialState = {
        cities: [], isLoading: false, currentCity: {}, error: ''
    }

    function reducer(state, action) {
        switch (action.type) {
            case 'loading':
                return {
                    ...state, loading: true
                }
            case 'cities/loaded':
                return {
                    ...state, cities: action.payload, isLoading: false
                }
            case 'city/created':
                return {
                    ...state, isLoading: false, cities: [...state.cities, action.payload], currentCity: action.payload
                }
            case 'city/loaded':
                return {
                    ...state, isLoading: false, currentCity: action.payload
                }

            case 'city/deleted':
                return {
                    ...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload)
                }
            case 'rejected':
                return {
                    ...state, isLoading: false, error: action.payload
                }
            default:
                throw new Error("Unsupported action")
        }
    }

    const [{cities, currentCity, isLoading, error}, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        async function fetchCities() {
            dispatch({type: 'loading'})
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({
                    type: 'cities/loaded', payload: data
                })
            } catch {
                dispatch({
                    type: 'rejected', payload: 'There was an error Loading data'
                })
            }
        }

        fetchCities()
    }, []);

    const fetchCity = useCallback(async function fetchCity(id) {
        if (id === currentCity.id) return;
        dispatch({type: 'loading'})
        try {
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({
                type: 'city/loaded', payload: data
            })
        } catch {
            dispatch({
                type: 'rejected', payload: 'There was an error Loading data'
            })
        }
    }, [currentCity.id]);

    async function createCity(newCity) {
        dispatch({type: 'loading'})
        try {
            await fetch(`${BASE_URL}/cities`, {
                method: 'POST', body: JSON.stringify(newCity), headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch({
                type: 'city/created', payload: newCity
            })
        } catch {
            dispatch({
                type: 'rejected', payload: 'There was an error Creating City'
            })
        }
    }

    async function deleteCity(cityId) {
        dispatch({type: 'loading'})
        try {
            await fetch(`${BASE_URL}/cities/${cityId}`, {
                method: 'DELETE'
            });
            dispatch({
                type: 'city/deleted', payload: cityId
            })
        } catch {
            dispatch({
                type: 'rejected', payload: 'There was an error Deleting CIty data'
            })
        }
    }

    return <CitiesContext.Provider
        value={{
            cities, isLoading, currentCity, fetchCity, createCity, deleteCity, error
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