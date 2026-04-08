# Inspired by
# https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/
# https://svelte.dev/docs/kit/adapter-node

# It is NECESSARY to change the SvelteKit adapter to @sveltejs/adapter-node instead of @sveltejs/adapter-auto

# Don't forget to add the .env file to your orchestration software or your docker run command.
# To solve "Cross-site POST form submissions are forbidden" errors, use the environment variable ORIGIN=[protocol]://[origin]:[port] where origin is the same exact one as displayed in the browser (ex: localhost, 127.0.0.1, etc.)

# Here is an example to run the local server :
# docker build -t portfolio .
# docker run -p 3000:3000 --env-file=.env -e ORIGIN=http://127.0.0.1:3000 portfolio

FROM node:current-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:current-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:current-alpine
WORKDIR /app
USER node:node

COPY --from=deps /app/node_modules node_modules/
COPY --from=builder /app/build build/
COPY package.json .

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE ${PORT}
CMD [ "node", "build" ]