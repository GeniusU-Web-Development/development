function registration(){

    const modal =
    `<div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: none;position:absolute;background: #002b43;" onclick="closeModal()">
    <div class="modal-dialog modal-dialog-centered d-flex flex-column align-items-center justify-content-center">
        <div class="modal-content" style="max-width: 300px;">
        <div class="modal-body d-flex flex-column align-items-center justify-content-center">
            <p class="text-center mb-0">Registered <br/> Successfully</p>
            <iframe src="https://embed.lottiefiles.com/animation/121018" class="img-width-height--200"></iframe>
        </div>
    </div>
    </div>`;


    function closeModal() {
        document.getElementById('successModal').style.display = 'none';
    }

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

    function stripTrailingSlash(str) {
        if(str.substr(-1) === '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }


    function linkSwitch(){
        const links = Array.from(document.querySelectorAll('.js-webinar-registration-link'));
        links.forEach((link) => {
            link.addEventListener('click', (e) => {
                console.log('clicked',e);
                if(link.getAttribute('registered') !== 'true'){

                    e.preventDefault();
                    e.target.innerHTML = 'Registering...';

                    const href = link.href;
                    const webinar_registration = link.getAttribute('data-webinar-registration');
                    const webinar_date = link.getAttribute('data-webinar-date');
                    const returnUrl = link.href ? `${link.origin}${stripTrailingSlash(link.pathname)}/thankyou.php` : null;

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
                            e.target.innerHTML = 'Registered';
                            link.setAttribute('registered', 'true');
                            const modalElement = link.closest('.js-modal-placement');
                            modalElement.insertAdjacentHTML('beforeend', modal);
                            document.getElementById('successModal').style.display = 'block';
                            document.getElementById('successModal').classList.add('show');
                            setTimeout(() => {
                                closeModal();
                                document.getElementById('successModal').remove();
                                window.open(`${linkData.returnurl}?sfid=${data}`, '_blank');
                            }, 4000);
                        }else{
                            e.target.innerHTML = 'Try Again';
                            link.setAttribute('registered', 'false');
                            window.location.href = `${link.href}`;
                        }
                    })
                    .catch(error => console.log(error));
                }

            });
        });
    }
}