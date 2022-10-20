const userSettings = {'data':null};

const form_fields = {'firstname':'first_name','lastname':'last_name','email':'email'};

fetch('https://app.geniusu.com/api/v1/users/authenticated',{
    method:'GET',
    credentials: "include",
    mode: "cors",
})
.then(response => response.json())
.then(data => {
    if(data.authenticated){
        const authData = new FormData();
        Object.entries(form_fields).forEach(([key, value]) => {
            authData.append(key, data[value]);
        });
        userSettings['data'] = authData;
        if(data.authenticated){
            linkSwitch();
        }
    }
})
.catch(error => {
    console.error(error);
});


function linkSwitch(){
    const links = Array.from(document.querySelectorAll('.js-webinar-registration-link'));
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.target.innerHTML = 'Registering...';
            e.preventDefault();

            const href = link.href;
            const webinar_registration = link.getAttribute('data-webinar-registration');
            const webinar_date = link.getAttribute('data-webinar-date');
            const returnUrl = link.href ? `${link.origin}${link.pathname}/thankyou.php` : null;

            const url = new URL(link)
            const mkt_src_link = url.searchParams.get('mkt_src');

            let params = (new URL(document.location)).searchParams;
            const utm_source = params.get('utm_source');
            const utm_medium = params.get('utm_medium');
            const mkt_src_url = params.get('mkt_src');

            const mkt_src = mkt_src_url ? mkt_src_url : mkt_src_link ? mkt_src_link : null;


            const linkData = {
                'webinar_registration' : webinar_registration,
                'webinar_date': webinar_date,
                'returnurl': returnUrl,
                'utm_source':utm_source,
                'utm_medium':utm_medium,
                'mkt_src':mkt_src
            }

            Object.entries(linkData).forEach(([key, value]) => {
                userSettings['data'].append(key, value);
            });
            userSettings['data'].append('salesforce_object_name', linkData.webinar_registration);
            console.log(userSettings['data']);

            fetch('https://live.geniusu.com/campuses/one-click/sf/index.php',{
                method: 'POST',
                body: userSettings['data']
            })
            .then(response => response.json())
            .then(data => {
                if(data.length === 18){
                    window.location.href = `${linkData.returnurl}?sfid=${data}`;
                }else{
                    window.location.href = `${link.href}`;
                }
            })
            .catch(error => console.log(error));

        });
    });
}