const defaultRecipient = "";

const defaultSenderName = "Website";
const defaultSender = "";
const defaultSubject = "Contact Form";

const brevoURl = "https://api.brevo.com/v3/smtp/email";
const brevoApiKey =
    "";

function validateEmail(email: string) {
    return email.toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

async function getBase64(file: File) {
    let buf = await file.arrayBuffer();
    let string = '';
    (new Uint8Array(buf)).forEach(
        (byte) => { string += String.fromCharCode(byte) }
    )
    return btoa(string)
}

export async function onRequestPost(context) {

    const { request } = context;
    const requestData = await request.formData();
    const data = Object.fromEntries(requestData.entries());

    let files = [],
        replyTo = null,
        senderName = defaultSenderName,
        senderEmail = defaultSender,
        to = [],
        cc = [],
        bcc = [],
        subject = defaultSubject;

    for (const p in data) {
        if (p === 'honeypot') {
            if (data[p] !== null && data[p] !== '') {
                return new Response('Honeypot filled', { status: 403 });
            }
            delete data[p];
        }
        if (data[p] instanceof File) {
            if (data[p].size > 0) {
                let name = data[p].name;
                let content = await getBase64(data[p]);
                files.push({ name, content });
            }
            delete data[p];
        }
        if (p === 'senderEmail') {
            if (validateEmail(data[p])) {
                senderEmail = data[p];
            }
            delete data[p];
        }
        if (p === 'senderName') {
            senderName = data[p];
            delete data[p];
        }

        if (p === 'to') {
            let emails = data[p].replace(' ', '').split(',');
            for (const email of emails) {
                if (validateEmail(email)) {
                    to.push(email);
                }
            }
            delete data[p];
        }
        if (p === 'cc') {
            let emails = data[p].replace(' ', '').split(',');
            for (const email of emails) {
                if (validateEmail(email)) {
                    cc.push(email);
                }
            }
            delete data[p];
        }
        if (p === 'bcc') {
            let emails = data[p].replace(' ', '').split(',');
            for (const email of emails) {
                if (validateEmail(email)) {
                    bcc.push(email);
                }
            }
            delete data[p];
        }
        if (p === 'mailSubject') {
            subject = data[p];
            delete data[p];
        }
        if (p === 'email') {
            if (validateEmail(data[p])) {
                replyTo = data[p];
            }
        }
        if (p === 'privacy') {
            delete data[p];
        }
    }

    let html = `<html><head></head><body>`;
    for (const p in data) {
        html += `<div style="padding-bottom: 1rem;"><div><strong style="text-transform: uppercase;">${p}</strong></div><p style="margin: 0;">${data[p]}</p></div>`;
    }
    html += `</body></html>`;


    const body: any = {
        sender: { name: senderName, email: senderEmail },
        to: to.length ? to.map(email => ({ email })) : [{ email: defaultRecipient }],
        subject,
        htmlContent: html,
    };

    if (cc.length) {
        body.cc = cc.map(email => ({ email }));
    }
    if (bcc.length) {
        body.bcc = bcc.map(email => ({ email }));
    }
    if (replyTo) {
        body.replyTo = { email: replyTo };
    }
    if (files.length) {
        body.attachment = files;
    }

    return fetch(brevoURl, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
        },
        body: JSON.stringify(body)
    });
}