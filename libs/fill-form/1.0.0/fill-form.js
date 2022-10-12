function fill_form(form_fields_mapping = null){
    const form_fields = form_fields_mapping !== null ? form_fields_mapping : {'firstname':'first_name','lastname':'last_name','email':'email','phone_number':'mobile_number'};

    fetch('https://app.geniusu.com/api/v1/users/authenticated',{
        method:'GET',
        credentials: "include",
        mode: "cors",
    })
    .then(response => response.json())
    .then(data => {
        if(data.authenticated){
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const formData = new FormData(form);
                Object.entries(form_fields).forEach(([key, value]) => {
                    formData.has(key) && (form[key].value = data[value]);
                });
            })
        }
    })
    .catch(error => {
        console.error(error);
    });
}
