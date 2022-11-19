
import { EDITAPPOINTMENT } from '../actions/editAppointment';
import { LOADAPPOINTMENTS } from "../actions/loadAppointments";
import { LOADRAPPOINTMENTS } from "../actions/addCommenToRecurrent";
import { ADDAPPOINTMENT } from "../actions/addAppointment";
import { EMPTYCAPPOINTMENT } from '../actions/emptyCurrentAppoinment';


const initialState = {
    appointments: [],
    currentAppointment: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADDAPPOINTMENT:
            return {...state, appointments: state.appointments.concat([action.appointment])};
        case EDITAPPOINTMENT:
            const updated = state.appointments.map((item) => item.id == action.appointment.id ? action.appointment : item );
            return {...state, appointments: updated};
        case LOADAPPOINTMENTS:
            return {...state, appointments: action.appointments};
        case EMPTYCAPPOINTMENT:
            return {...state, currentAppointment: null};
        case LOADRAPPOINTMENTS:
            const updatedAppointments = state.appointments.map((item) => item.id == action.appointmentToUpdate.id ? action.appointmentToUpdate : item );
            updatedAppointments.push(action.appointmentToAdd)
            return {...state, appointments: updatedAppointments, currentAppointment: action.appointmentToAdd};
    }
    return state;
};