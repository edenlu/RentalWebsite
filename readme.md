# Prerequisites:
1. Have latest NodeJS installed on your machine
2. Have latest NPM installed on your machine
3. Install XAMPP and setup your database
4. Have Git Bash installed

# Setting requirement
1. Appache and MySQL is turned on at XAMPP
2. In phpmyAdmin set user **root**'s password to **root**
3. Open http://localhost/phpmyadmin/
4. Copy the sql script from **createtableScript.sql** and execute in phpmyadmin

# Download the code
1. open Git Bash
2. git clone https://github.com/edenlu/RentalWebsite.git
3. cd into the folder (./RentalWebsite)
4. run **npm install**

# Steps on how to install:
1. run **node RentalServer.js**
2. Now the website is available at http://localhost:8080/search/

P.S. for debuging the server, you may use Visual Studio Code

# Features
## Homepage
![](/PresentationImages/HomePage.PNG | width=500)

## Login
![](/PresentationImages/Login.gif | width=500)

## Profile
![](/PresentationImages/Profile.gif | width=500)

## Create house renting post
![](/PresentationImages/CreatePost.gif | width=500)

## Search
Search housing by price and locations!
![](/PresentationImages/Search.gif | width=500)