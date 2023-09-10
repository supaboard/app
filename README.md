<p align="center">
    <a href="https://github.com/supaboard/app">
        <img src="https://raw.githubusercontent.com/supaboard/.github/main/assets/gh-header.png" alt="Logo">
    </a>

  <h3 align="center">Supaboard</h3>

  <p align="center">
    The dashbord builder for Supabase and Postgres.
    <br />
    <a href="https://supaboard.co"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://discord.com/invite/mh45XDfED4">Discord</a>
    ·
    <a href="https://supaboard.co">Website</a>
    ·
    <a href="https://github.com/supaboard/app/issues">Issues</a>
    ·
    <a href="https://github.com/orgs/supaboard/discussions">Discussions</a>
  </p>
</p>

## Running the app locally
1. Clone the repo   
`https://github.com/supaboard/app.git`   

2. Install dependencies and start the dev server   
`npm i && npm run dev`

3. You'll need a Supabase account / Postgress database and [apply](https://supabase.com/docs/reference/cli/supabase-migration-up) the initial migration located in `/supabase`.   
We're using a custom schema called `supaboard`, so make sure this accessible from outside connections. In Supabase, go to Settings > API and add `supaboard` to the exposed schemas as shown below.

![supabase-schema-permission](https://github.com/supaboard/.github/blob/main/assets/supabase-schema-permission.png)

4. Copy or rename the `.env.example` file to `.env` and fill in the environment variables.   
**Important:** The variables `IS_PLATFORM` and `NEXT_PUBLIC_IS_PLATFORM` are strongly advised to be set to `false`, otherwise you will run into account limits and other payment issues. The flag is differentiating between our hosted offer and self-hosted instances.

## env example
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_LANDING=/overview
NEXT_PUBLIC_ENV=dev

# Differentiate between cloud and self-hosted
IS_PLATFORM=true
NEXT_PUBLIC_IS_PLATFORM=true
NEXT_PUBLIC_SIGNUP_CLOSED=false

# Supabase / database
NEXT_PUBLIC_SUPABASE_URL=XYZ.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=XYZ
SUPABASE_SERVICE_ROLE_KEY=XYZ
SUPABASE_JWT_SECRET=XYZ

# We encrypt all database connection details ebfore storing them in the database
# This is the key used to encrypt the connection details
CRYPTO_SECRET_KEY=XYZ
CRYPRO_SECRET_IV=XYZ
CRYPTO_ENCRYPTION_METHOD=aes-256-cbc

# Resend / email
RESEND_API_KEY=re_XYZ

# dev / local tunnel
LOCAL_TUNNEL=https://46e7-2a02-908-4b27-3080-a5fa-9b89-c87d-c9f7.ngrok-free.app/
```
