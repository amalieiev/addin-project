import "./index.scss";

import { render, useMounted, createSubject } from "./core.js";

function Auth({ isAuthorized }) {
    useMounted((el) => {
        el.querySelector(".button").addEventListener("click", () => {
            fetch("/login", {
                method: "POST",
            })
                .then((r) => r.json())
                .then((result) => {
                    isAuthorized.next(true);
                });
        });
    });

    return `
        <div class="col justify-center align-center">
            <p>You are not signed in.</p>
            <div class="button row justify-center align-center">
                <i class="fab fa-microsoft"></i>
                <span>Sign in with Google</span>
            </div>
        </div>
    `;
}

function Signatures() {
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

        fetch("signatures")
            .then((r) => r.json())
            .then((data) => {
                signatures.next(data);
            });
    });

    return `
        <div class="col justify-center align-center">
            <div class="signatures">Loading signatures...</div>
        </div>
    `;
}

function App() {
    const isAuthorized = createSubject(false);

    useMounted((el) => {
        isAuthorized.subscribe(() => {
            if (isAuthorized.value === true) {
                render(
                    Signatures,
                    { isAuthorized },
                    el.querySelector("#layout")
                );
            } else {
                render(Auth, { isAuthorized }, el.querySelector("#layout"));
            }
        });

        fetch("/login", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((result) => {
                isAuthorized.next(result);
            });
    });

    return `
        <div class="col justify-center align-center">
            <div id="layout">Loading...</div>
        </div>
    `;
}

render(App, {}, document.getElementById("root"));
