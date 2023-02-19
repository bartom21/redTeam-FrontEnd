import { LOADLOCATIONS, LOADTHERAPIES } from "../actions/resources";
import { UPDATELOCATION } from "../actions/updateLocationRate";
import { USERLOGOUT } from "../actions/userLogout";

const initialState = {
    therapies: [],
    locations:[]
};

export default (state = initialState, action) => {
    switch(action.type){
        case LOADTHERAPIES:
            return {...state, therapies: action.therapies};
        case LOADLOCATIONS:
            return {...state, locations: action.locations};
        case USERLOGOUT:
            return initialState
        case UPDATELOCATION:
            const updated = state.locations.map((item) => item.id == action.location.id ? {...item, ...action.location} : item );
            return {...state, locations: updated};
    }
    return state;
};