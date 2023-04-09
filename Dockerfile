#use latest ubuntu image
FROM node:19-alpine

#set current working directory to /app
WORKDIR /app

#copy over current contents to the working directory
COPY ./frontend/package.json /app

#install node_modules
RUN npm install

#copy over React source code
COPY . .
#get the secrets to set up env
RUN --mount=type=secret,id=my_env source /run/secrets/my_env

#expose correct port
EXPOSE 5173

#start the Vite React app
CMD ["npm", "run", "dev"]

