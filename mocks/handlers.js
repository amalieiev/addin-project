import { rest } from "msw";

const data = {
    auth: {
        authorized: false,
        user: null,
    },
};

export const handlers = [
    rest.get("/login", (req, res, ctx) => {
        return res(ctx.delay(500), ctx.json(data.auth.authorized));
    }),

    rest.post("/login", (req, res, ctx) => {
        const { username } = req.body;

        data.auth.authorized = true;
        data.auth.user = username;

        return res(
            ctx.json({
                username,
            })
        );
    }),
];
