# Spaceify

### **Built in 24 hours** - Auburn Hackathon 2024 Submission

### React web app hosted on AWS EC2 that allows users to dynamically populate 3d rendering of playlists as a solar system. Song metadata determines factors of the planet like size, speed, and rotation. Employs computer vision to map album art palette to planet color gradient. Utilizes Docker to host the backend, frontend, and NGINX. 
<img width="900" alt="SpaceifyWorkflow" src="https://github.com/uabhacks-at-auhacks24/frontend-in-space/assets/107063397/9a16df09-0a64-4e8c-a322-6b1abb6e70c8">

Website URL: ```http://space.spaceify.co/```

![spacify-gif](https://github.com/mfkimbell/dummmmmy/assets/107063397/86b924ac-0f93-43d8-ab9e-08e822567781)

### **Tools Used:**
* `React` For rendering jsx elements and creating UI
* `Npm` Package management and frontend server management
* `ReactThree.js` Rendering and manipulating geometric objects in React
* `Docker` Containerization of frontend, backend, and NGINX
* `SKLearn` Machine learning appliation used to target prominent colors used to alter image data
* `AWS EC2` Cloud hosting of web applciation
* `GoDaddy` Hosting for our domain
* `NGINX` Reverse proxy manager to route traffice from port 80 to docker containers
* `MultiThreading` Ran multiple threads for processing large amounts of image data
* `FastAPI` Python api for querying spotify api and returning data to the frontend
* `Spotify` We used their API to recieve meta data about playlists for planet manipulation

## Inspiration
We saw a project that procedurally generated a topographical map based on bit data from Spotify. Instead, we thought a song representing each celestial body would be more theme-driven. 
## What it does
It allows the user to input a Spotify playlist URL to dynamically populate a solar system based on the songs' metadata. Each planet varies in speed, color, size, texture, and rotational speed. Songs that are more popular produce larger planets for example.
## How we built it
We have a React frontend and a Python FastAPI backend. The frontend sends the playlist URL to the backend via fetch. Then the backend makes a call to Spotify API. The data is returned to the backend where the data is processed and organized into a planet data set with characteristics unique to the Spotify metadata. We use ReactThree.js to render 3d models in the react app. We hosted the microservices for our web app on AWS in an Ubuntu runner via Docker containers. NGINX was used to reverse proxy to route traffic from port 80 into our webapp container. We acquired a domain from GoDaddy to route to our public IP for the EC2 container. 


