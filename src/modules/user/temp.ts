// user/routes.ts
// app.post("/sign-up", async (request, reply) => {
//   const body = request.body as EntityData<User>;

//   if (!body.email || !body.fullName || !body.password) {
//     throw new Error(
//       "One of the required fields is missing: email, fullName, password"
//     );
//   }

//   if (await db.user.exists(body.email)) {
//     throw new Error(
//       "This  email is already registered, maybe you want to sign in?"
//     );
//   }

//   const user = new User(body.fullName, body.email, body.password);
//   user.bio = body.bio ?? "";
//   await db.em.persist(user).flush();

//   const _refreshToken = await reply.jwtSign(
//     { id: user.id },
//     { expiresIn: "7d" }
//   );
//   const refreshToken = db.token.create({
//     user: ref(User, user.id),
//     tokenHash: _refreshToken,
//   });

//   user.token = await reply.jwtSign({ id: user.id }, { expiresIn: "15m" });

//   reply.setCookie("refreshToken", _refreshToken, {
//     domain: "localhost",
//     path: "/",
//     secure: false,
//     httpOnly: true,
//     sameSite: "lax",
//   });

//   await db.em.flush();

//   // console.log(reply.getHeaders());

//   console.log(`User  ${user.id} created`);

//   return user;
// });

// app.post("/sign-in", async (request, reply) => {
//   const { email, password } = request.body as {
//     email: string;
//     password: string;
//   };
//   const user = await db.user.login(email, password);
//   user.token = await reply.jwtSign({ id: user.id }, { expiresIn: "15m" });

//   const refreshToken = await db.token.findToken(user.id);

//   reply.setCookie("refreshToken", refreshToken.tokenHash, {
//     domain: "localhost",
//     path: "/",
//     secure: false,
//     httpOnly: true,
//     sameSite: "lax",
//   });
//   // implement check to see remaining time on refreshToken and be given a new one if little time is left
//   return user;
// });

// app.get("/cookies", async (request, reply) => {
//   const _refreshToken: string = request.cookies.refreshToken ?? "";
//   const user = app.jwt.decode<{ id: string }>(_refreshToken) || { id: "" };
//   if (user.id === "") return { error: "No token provided" };
//   const refreshToken = await db.token.findToken(user.id);
//   if (refreshToken.tokenHash === _refreshToken) {
//     const token = await reply.jwtSign({ id: user.id }, { expiresIn: "15m" });
//     return token;
//   }
//   return { error: "Refresh token is invalid" };
// });

// app.get("/profile", async (request) => {
//   const user = getUserFromToken(request);
//   return user;
// });

// app.patch("/profile", async (request) => {
//   const user = getUserFromToken(request);
//   wrap(user).assign(request.body as User);

//   await db.em.flush();
//   return user;
// });
