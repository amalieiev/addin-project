import { PublicClientApplication } from "@azure/msal-browser";
import { render, useMounted, createSubject } from "./core.js";

import "./index.scss";

const msalClient = new PublicClientApplication({
    auth: {
        clientId: "fa53950a-c42a-4db8-947e-afb8c583a220",
        authority: "https://login.microsoftonline.com/common/",
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
});

const token = createSubject(null);

async function signIn() {
    return msalClient
        .loginPopup({
            scopes: ["User.Read", "openid", "profile"],
        })
        .catch(function (error) {
            console.log(error);
        });
}

function signOut() {
    return msalClient.logoutPopup();
}

function Auth({ isAuthorized }) {
    useMounted((el) => {
        el.querySelector(".button").addEventListener("click", () => {
            signIn().then((response) => {
                console.log(response);
                token.next(response.idToken);
                isAuthorized.next(true);
            });
        });
    });

    return `
        <div class="col justify-center align-center">
            <p>You are not signed in.</p>
            <div class="button row justify-center align-center">
                <i class="fab fa-microsoft"></i>
                <span>Sign in with Microsoft</span>
            </div>
        </div>
    `;
}

function Signatures({ isAuthorized }) {
    const signatures = createSubject([]);

    useMounted((el) => {
        signatures.subscribe((data) => {
            const html = data
                .map((signature) => {
                    return `
                <div>
                    <p>${signature.title}</p>
                </div>
            `;
                })
                .join("");

            el.querySelector(".signatures").innerHTML = html;
        });

        el.querySelector(".button").addEventListener("click", () => {
            signOut().then(() => {
                isAuthorized.next(false);
            });
        });

        fetch("signatures", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Aurhorization: `Bearer ${token.value}`,
            },
            body: JSON.stringify({
                sender: "admin@test.com",
            }),
        })
            .then((r) => r.json())
            .then((data) => {
                signatures.next(data.signatures);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    return `
        <div class="col justify-center align-center">
            <div class="button row justify-center align-center">
                <span>Sign Out</span>
            </div>
            <div class="signatures">Loading signatures...</div>
        </div>
    `;
}

function App() {
    const isAuthorized = createSubject(false);

    useMounted((el) => {
        isAuthorized.subscribe(() => {
            if (isAuthorized.value === true) {
                render(Signatures, { isAuthorized }, el.querySelector("#layout"));
            } else {
                render(Auth, { isAuthorized }, el.querySelector("#layout"));
            }
        });

        msalClient
            .ssoSilent({})
            .then((result) => {
                const currentAccounts = msalClient.getAllAccounts();
                console.log(result);
                console.log(currentAccounts);
                token.next(result.accessToken);
                isAuthorized.next(true);
            })
            .catch((err) => {
                isAuthorized.next(false);
            });
    });

    return `
        <div class="col justify-center align-center">
            <div id="layout">Loading...</div>
        </div>
    `;
}

render(App, {}, document.getElementById("root"));
