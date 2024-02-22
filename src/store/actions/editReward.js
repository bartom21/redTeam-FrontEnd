
export const EDITREWARD = 'EDITREWARD';

export const editReward = (changed, handleLoading) => {
    return (dispatch, getState) => {
        const id = Object.keys(changed)[0];
        getState().auth.currentUser.getIdToken(true)
            .then(idToken => {
                fetch(`https://pid-front.vercel.app/reward/${id}`, {
                    method: 'PUT',
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": idToken
                    },
                    body: JSON.stringify({
                    ...changed[id]
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
                    dispatch({type:EDITREWARD, reward: myJson.reward});
                    if(handleLoading){handleLoading()}
                })
            })
            .catch(err => console.log(err));
    };
};