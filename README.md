How to run:How to run:
1. Clone the repo
2. To setup laravel backend perform the following:
    -- rename .env.example file to .env, and provide database credentials i.e DB_DATABASE, DB_USERNAME, DB_PASSWOR;
       make sure DB_DATABASE matches the mysql database name 
   -- run "composer update"
   -- run "php artisan key:generate" to create application key
   -- run "php artisan jwt:secret" to create jwt secret key
   -- run "php artisan migrate" for migrating db tables
   -- run "php artisan serve" to run the server
3. To setup React frontend
   -- 
