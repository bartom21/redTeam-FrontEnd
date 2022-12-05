import { LOADINVOICES } from "./loadInvoices";



export const deleteInvoice = (event, handleLoading) => {
    return (dispatch, getState) => {
        const invoiceId = event.deleted;
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://back-red-team.vercel.app/deleteInvoice/${invoiceId}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                })
                .then((response) => {
                    console.log('RESPONSE');
                    console.log(response.status);
                    if(response.status == 201 || response.status == 200){
                        console.log('Procedimiento exitoso');
                    }else{
                        console.log('Ocurrió un problema, por favor intente nuevamente.');
                    }
                    return response.json();
                })
                .then((myJson) => {
                    console.log(myJson);
                    dispatch({type:LOADINVOICES, invoices: myJson.invoices});
                    handleLoading()
                })
            })
            .catch(err => console.log(err));
    };
};