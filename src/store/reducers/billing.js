import { ADDINVOICE } from "../actions/addInvoice";
import { EDITREWARD } from "../actions/editReward";
import { EDITINVOICE } from "../actions/editInvoice";
import { LOADREWARDS } from "../actions/loadRewards";
import { LOADINVOICES } from "../actions/loadInvoices";
import { LOADUNPAIDSESSIONS } from "../actions/loadUnpaidSessions";
import { USERLOGOUT } from "../actions/userLogout";

const initialState = {
    unpaidSessions:[],
    invoices: [],
    rewards: []
};

export default (state = initialState, action) => {
    switch(action.type){
        case ADDINVOICE:
            return {...state, invoices: state.invoices.concat([action.invoice])};
        case EDITINVOICE:
            const updated = state.invoices.map((item) => item.id == action.invoice.id ? action.invoice : item );
            return {...state, invoices: updated};
        case EDITREWARD:
            const reward = state.rewards.find(x => x.professional === action.reward.professional)
            let updated2 = []
            if(reward){
                updated2 = state.rewards.map((item) => item.professional == action.reward.professional ? action.reward : item );
            }else{
                updated2 = state.rewards.concat([action.reward])
            }
            return {...state, rewards: updated2};
        case LOADINVOICES:
            return {...state, invoices: action.invoices};
        case LOADREWARDS:
            return {...state, rewards: action.rewards};
        case LOADUNPAIDSESSIONS:
            return {...state, unpaidSessions: action.unpaidSessions};
        case USERLOGOUT:
            return initialState
    }
    return state;
};