import { rest } from "msw";

const data = {
    auth: {
        authorized: false,
        user: null,
    },
    signatures: [
        { id: Math.floor(Math.random() * 1000), title: "Signature 1" },
        { id: Math.floor(Math.random() * 1000), title: "Signature 2" },
    ],
};

export const handlers = [
    rest.get("/login", (req, res, ctx) => {
        return res(ctx.delay(700), ctx.json(data.auth.authorized));
    }),

    rest.post("/signatures", (req, res, ctx) => {
        return res(ctx.delay(500), ctx.json(data));
    }),

    rest.post("/login", (req, res, ctx) => {
        const { username } = req.body;

        data.auth.authorized = true;
        data.auth.user = username;

        return res(
            ctx.delay(700),
            ctx.json({
                username: "username@gmail.com",
            })
        );
    }),
];
