/*
|--------------------------------------------------------------------------
| 导出数据库配置
|--------------------------------------------------------------------------
|
*/
module.exports = {

    /*
    |--------------------------------------------------------------------------
    | mongodb 配置
    |--------------------------------------------------------------------------
    |
    */
    mongodb: {
        client: 'mongodb',
        connection: {
            host: env('DB_HOST') || 'localhost',
            port: env('DB_PORT') || '27017',
            name: env('DB_NAME') || 'blog',
            username: env('DB_USERNAME') || '',
            password: env('DB_PASSWORD') || ''
        }
    }
}