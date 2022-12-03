
export const EDITUSER = 'EDITUSER';

export const updateUserProfile = (data) => {
    console.log("editProfile, ", data);
    return (dispatch, getState) => {
        const uid = data.id
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`
https://back-red-team.vercel.app/updateProfile/${uid}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    user: data.profile
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
                    console.log('RESPONSE', myJson);
                    dispatch({type:EDITUSER, user: myJson.user});
                })
            })
            .catch(err => console.log(err));
    };
};