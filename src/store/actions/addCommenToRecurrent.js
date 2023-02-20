
export const LOADRAPPOINTMENTS = 'LOADRAPPOINTMENTS';

export const addCommentToRecurrent = (commentData) => {
    console.log("editAppointment");
    return (dispatch, getState) => {
        const appointmentId = commentData.appointment.id;
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://back-red-team.vercel.app:8080/addRComment/${appointmentId}`, {
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
                    console.log('RCOMMENT ', myJson);
                    dispatch({type:LOADRAPPOINTMENTS, appointmentToUpdate: myJson.appointments.updated, appointmentToAdd: myJson.appointments.added});
                })
            })
            .catch(err => console.log(err));
    };
};