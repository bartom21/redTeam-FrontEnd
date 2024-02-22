
export const EDITAPPOINTMENT = 'EDITAPPOINTMENT';

export const addComment = (commentData) => {
    console.log("editAppointment");
    return (dispatch, getState) => {
        const appointmentId = commentData.appointment.id;
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://pid-front.vercel.app/addComment/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    data: commentData
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
                    console.log(myJson);
                    dispatch({type:EDITAPPOINTMENT, appointment: myJson});
                })
            })
            .catch(err => console.log(err));
    };
};