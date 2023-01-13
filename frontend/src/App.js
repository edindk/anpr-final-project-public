import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import NotFound from "./views/NotFound";
import Locations from "./views/Locations";

function App() {
    return (
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route element={<ProtectedRoute/>}>
                            <Route path='/' element={<Dashboard/>} exact/>
                        </Route>
                        <Route element={<ProtectedRoute/>}>
                            <Route path='/locations' element={<Locations/>} exact/>
                        </Route>
                        <Route path='*' element={<NotFound/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
    );
}

export default App;
