function fill_form(form_fields_mapping = null){
    const form_fields = form_fields_mapping !== null ? form_fields_mapping : {'firstname':'first_name','lastname':'last_name','email':'email','phone_number':'mobile_number'};

    fetch('https://20db519b-43b0-459c-9fd6-8a06862c29e0.mock.pstmn.io/get_parameter',{
        method:'GET',
        mode: "no-cors",
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