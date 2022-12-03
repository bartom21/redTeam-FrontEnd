export const LOADINVOICES = 'LOADINVOICES';

export const loadInvocies = () => {
    return (dispatch, getState) => {
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch('https://back-red-team.vercel.app/invoices', {
                    method: 'GET',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    }
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
                    dispatch({type:LOADINVOICES, invoices: myJson.invoices});
                })
            })
            .catch(err => console.log(err));
    };
};