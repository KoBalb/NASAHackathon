import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Login from "../pages/login/Login"
import Closets from "../pages/projects/project/modules/compartments/zones/closets/Closets"
import { ProtectedRoute } from "./ProtectedRoute"
import Registration from "../pages/registration/Registration";
import Catalogs from "../pages/catalogs/Catalogs";
import Home from "../pages/home/Home";
import Astronauts from "../pages/astronauts/Astronauts";
import Projects from "../pages/projects/Projects";
import Modules from "../pages/projects/project/modules/Modules";
import Compartments from "../pages/projects/project/modules/compartments/Compartments";
import Zones from "../pages/projects/project/modules/compartments/zones/Zones";
import Project from "../pages/projects/project/project";
import Logout from "../pages/logout/logout";

export function MainRoutes(){
    return (
        <Router basename={ import.meta.env.VITE_BASENAME }>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                 <Route path="/logout" element={<Logout />} />
                <Route path="/catalogs" element={
                    <ProtectedRoute>
                        <Catalogs />
                    </ProtectedRoute>
                } />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/astronauts" element={
                    <ProtectedRoute>
                        <Astronauts />
                    </ProtectedRoute>
                } />
                <Route path="/projects" element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                   } />
                <Route path="/projects/:projectId" element={
                    <ProtectedRoute>
                        <Project />
                    </ProtectedRoute>
                } />
                <Route path="/projects/:projectId/modules/:moduleId" element={
                    <ProtectedRoute>
                        <Modules />
                    </ProtectedRoute>
                } />
                <Route path="/projects/:projectId/modules/:moduleId/compartments/:compartmentId" element={
                    <ProtectedRoute>
                        <Compartments />
                    </ProtectedRoute>
                } />
                <Route path="/projects/:projectId/modules/:moduleId/compartments/:compartmentId/zones/:zoneId" element={
                    <ProtectedRoute>
                        <Zones />
                    </ProtectedRoute>
                } />
                <Route path="/projects/:projectId/modules/:moduleId/compartments/:compartmentId/zones/:zoneId/closets/:closetsId" element={
                    <ProtectedRoute>
                        <Closets />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}