import { LOADUNPAIDSESSIONS } from "../actions/loadUnpaidSessions";
import { LOADLOCATIONS, LOADTHERAPIES } from "../actions/resources";
import { UPDATETHERAPY } from "../actions/updateRate";
import { USERLOGOUT } from "../actions/userLogout";

const initialState = {
    therapies: [],
    locations:[],
    unpaidSessions:[]
};

export default (state = initialState, action) => {
    switch(action.type){
        case LOADTHERAPIES:
            return {...state, therapies: action.therapies};
        case LOADUNPAIDSESSIONS:
            return {...state, unpaidSessions: action.unpaidSessions};
        case LOADLOCATIONS:
            return {...state, locations: action.locations};
        case UPDATETHERAPY:
            const updated = state.therapies.map((item) => item.id == action.therapy.id ? {...item, ...action.therapy} : item );
            return {...state, therapies: updated};
        case USERLOGOUT:
            return initialState
    }
    return state;
};