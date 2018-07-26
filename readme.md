# Prerequisites:
1. Have latest NodeJS installed on your machine
2. Have latest NPM installed on your machine
3. Install XAMPP and setup your database
4. Have Git Bash installed

# Setting requirement
- Appache and MySQL is turned on at XAMPP
- phpmyAdmin's password is set to **root**

# Download the code
git clone https://github.com/edenlu/RentalWebsite.git

# Steps on how to install:
1. Turn on XAMPP and open http://localhost/phpmyadmin/
2. Copy the sql script from **createtableScript.sql** and execute in phpmyadmin
3. open cmd
4. cd to project directory
5. run "npm install"
6. run "node RentalServer.js"

Booooom!!! The rental website is running now!!!
Now you may go to http://localhost:8080/search/ to view the page
P.S. for debuging the server, you may use Visual Studio Code
