import { ADDINVOICE } from "../actions/addInvoice";
import { LOADINVOICES } from "../actions/loadInvoices";
import { LOADUNPAIDSESSIONS } from "../actions/loadUnpaidSessions";
import { USERLOGOUT } from "../actions/userLogout";

const initialState = {
    unpaidSessions:[],
    invoices: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADDINVOICE:
            return {...state, invoices: state.invoices.concat([action.invoice])};
        case LOADINVOICES:
            return {...state, invoices: action.invoices};
        case LOADUNPAIDSESSIONS:
            return {...state, unpaidSessions: action.unpaidSessions};
        case USERLOGOUT:
            return initialState
    }
    return state;
};