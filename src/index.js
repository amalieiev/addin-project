import "./index.scss";

import { render, useElement, useMounted, useSubject } from "./core.js";

function Auth({ isAuthorized }) {
    const el = useElement();

    useMounted(() => {
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
    const el = useElement();
    const signatures = useSubject([]);

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

    useMounted(() => {
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
    const isAuthorized = useSubject(false);
    const el = useElement();

    isAuthorized.subscribe(() => {
        if (isAuthorized.value === true) {
            render(Signatures, { isAuthorized }, el.querySelector("#layout"));
        } else {
            render(Auth, { isAuthorized }, el.querySelector("#layout"));
        }
    });

    useMounted(() => {
        fetch("/login", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((result) => {
                isAuthorized.next(result);
            });
    });

    return `
        <div id="layout">Loading...</div>
    `;
}

render(App, {}, document.getElementById("root"));
