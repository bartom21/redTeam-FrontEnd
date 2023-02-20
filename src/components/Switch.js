import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./Home"
import AdminCalendar from "./AdminCalendar"
import { useSelector } from 'react-redux'
import UsersGrid from './Grid'
import SessionsGrid from "./SessionGrid"
import Profile from "./Profile"
import {auth} from '../firebase'
import PatientCalendar from "./PatientCalendar"
import ProfessionalCalendar from "./ProfessionalCalendar"
import NotAsignedHome from "./NotAsignedHome"
import LocationGrid from "./LocationGrid"
import MonthlyInvoice from "./MonthlyInvoice"



function AuthSwitch(props) {

    const currentUser = useSelector(state => state.auth.currentUser);
    
    const authAdminRoutes = (
        <Switch>
            <Route exact path="/Calendar" component={AdminCalendar} />
            <Route exact path="/perfil" component={Profile}/>
            <Route exact path="/salas" component={LocationGrid}/>
            <Route exact path="/cobros" component={MonthlyInvoice}/>
            <Route exact path="/usuarios" component={UsersGrid}/>
            <Route exact path="/sesiones" component={SessionsGrid}/>
            <Route path="/" component={Home} />
        </Switch>
    );

    const authPatientRoutes = (
        <Switch>
            <Route exact path="/Calendar" component={PatientCalendar} />
            <Route exact path="/sesiones" component={SessionsGrid}/>
            <Route path="/" component={Home} />
        </Switch>
    );

    const authProfessionalRoutes = (
        <Switch>
            <Route exact path="/Calendar" component={ProfessionalCalendar} />
            <Route exact path="/sesiones" component={SessionsGrid}/>
            <Route path="/" component={Home} />
        </Switch>
    );

    const authUndefinedRoutes = (
        <Switch>
            <Route path="/" component={NotAsignedHome} />
        </Switch>
    );

    const externalRoutes = (
        <Switch>
            <Route path="/" component={Home} />
        </Switch>
    );
    
    var routes = externalRoutes;
    if(currentUser){
        if(props.role){
            switch (props.role) {
                case 'paciente':
                    routes = authPatientRoutes
                    break;
                case 'profesional':
                    routes = authProfessionalRoutes
                    break;
                case 'admin':
                    routes = authAdminRoutes
                    break;
                default:
                    routes = authUndefinedRoutes
              }
        }
    }

    console.log('rolSwitch ', props.role)


     return (routes)
}

export default AuthSwitch;
