# Rumor Party Line

- Server
  - NodeJS
  - TypeScript
  - Express (+ rateLimit, validator)
  - DotEnv
  - Helmet
  - Body Parser
  - UUID
  - Cors
  

- Client
  - React (+ Vite)
  - Zustand
  - React Router
  - Tailwind
  - DaisyUI
  - ESLint

# License
MIT 

# Notes
This was a single weekend project and I wouldn't recommend using this for anything more than a few games between friends. Despite my best attempts, I'm sure there are still some security concerns that I haven't thought of. And the client despite simple, isn't that optimized and could use some cleaning up. (Also yes, I know there's long files that could be broken up. I don't care. I wasn't thinking about architecture when I made this. I was thinking about getting it done in a weekend.)

# How To
If you REALLY want to do this for some reason:

- Clone the repo
- Check the `.env` files of both server and client for more guidance on how to run each separate.
- Run `npm install` in both the client and server directories (you obviously need Node.js installed)
- Run `npm run dev` in the client directory
- Run `npm start` in the server directory (you need both client and server running in different terminals, duh)
- Have fun I guess?

Also, you can change some small settings in the `.env` file in the server directory (like the port the server runs on).

Oh, you want to know how to run this in a server on the open internet? Figure it out. I'm not going to help you with that. I'm not responsible for any security issues that arise from you doing that.

# Contributing
I'm not going to maintain this project. I'm not going to accept pull requests. I'm not going to respond to issues. I'm not going to respond to emails. I'm not going to care if you get hacked for running this on the public internet.

# Contact
Please don't.

# Why?
I was bored and wanted to make something inspired by something Microsoft put on one of the betas of Windows 95, an app named Party Line/Rumor that later became WinPopUp. Basically it was like a sort of game that allowed users to jokingly start rumors in the LAN by encapsulating and using commands like NETSEND within an neat UI. This would be the modern day equivalent but using Server Sent Events.
