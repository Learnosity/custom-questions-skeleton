(() => {
    const redirectSection = document.querySelector('#redirect_response');
    const requestJsonTextarea = document.querySelector('.client-request-json > textarea');

    if (requestJsonTextarea) {
        requestJsonTextarea.value = `${JSON.stringify(window.activity, null, 2)}`;
    }

    if (redirectSection) {
        const reload = (state) => {
            const sessionId = window.activity.session_id;

            window.location.href = `?state=${state}&session_id=${sessionId}`;
        };

        redirectSection
            .querySelector('button[data-action="resume"]')
            .addEventListener('click', () => reload('resume'));

        redirectSection
            .querySelector('button[data-action="review"]')
            .addEventListener('click', () => reload('review'));

        window.__onSaveSuccess = () => {
            redirectSection.classList.remove('client-hidden');
        };
    }
})();
