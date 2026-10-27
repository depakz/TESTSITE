# --- build stage ---
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# --- runtime stage ---
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

# Non-root low-privilege account, matching the "daniel" user from the
# write-up, so a successful exploit lands exactly where the lab expects.
RUN useradd -m -s /bin/sh daniel \
    && echo "nexacorp-lab{d4n13l_us3r_fl4g_r3act2sh3ll}" > /home/daniel/user.txt \
    && chown daniel:daniel /home/daniel/user.txt \
    && chmod 440 /home/daniel/user.txt

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/next.config.js ./next.config.js

RUN chown -R daniel:daniel /app
USER daniel

EXPOSE 3000
CMD ["npm", "run", "start"]
