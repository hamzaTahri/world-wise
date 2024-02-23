import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import CityList from "./components/CityList.jsx";
import CountryList from "./components/CountryList.jsx";
import City from "./components/City.jsx";
import Form from "./components/Form.jsx";
import {CitiesProvider} from "./context/CitiesContext.jsx";
import {AuthProvider} from "./context/FakeAuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import {lazy, Suspense} from "react";
import SpinnerFullPage from "./components/SpinnerFullPage.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const Product = lazy(() => import("./pages/Product.jsx"));
const Pricing = lazy(() => import("./pages/Pricing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AppLayout = lazy(() => import("./pages/AppLayout.jsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound.jsx"));


function App() {

    return <AuthProvider>
        <CitiesProvider>
            <BrowserRouter>
                <Suspense fallback={<SpinnerFullPage/>}>
                    <Routes>
                        <Route index element={<HomePage/>}/>
                        <Route path="product" element={<Product/>}/>
                        <Route path="pricing" element={<Pricing/>}/>
                        <Route path="app" element={<ProtectedRoute>
                            <AppLayout/>
                        </ProtectedRoute>}>
                            <Route index element={<Navigate replace to="cities"/>}/>
                            <Route path="cities" element={<CityList/>}/>
                            <Route path="cities/:id" element={<City/>}/>
                            <Route path="countries" element={<CountryList/>}/>
                            <Route path="form" element={<Form/>}/>
                        </Route>
                        <Route path="login" element={<Login/>}/>
                        <Route path="*" element={<PageNotFound/>}/>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </CitiesProvider>
    </AuthProvider>
}

export default App
