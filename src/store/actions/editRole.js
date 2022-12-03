
export const EDITUSER = 'EDITUSER';

export const editRole = (event, handleLoading) => {
    console.log("editAppointment");
    return (dispatch, getState) => {
        const uid = Object.keys(event.changed)[0];
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`
https://back-red-team.vercel.app/userRole/${uid}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    user: event.changed[uid]
                    })
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
                    handleLoading()
                    console.log(myJson);
                    dispatch({type:EDITUSER, user: myJson.user});
                })
            })
            .catch(err => console.log(err));
    };
};