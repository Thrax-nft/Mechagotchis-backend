module.exports = {
    JWT: {
        secret: 'csgoclubggjwttokenfetyuhgbcase45w368w3q',
        expire: '365d'
    },
    SERVICE: {
        MAIN: {
            HOST: 'http://192.168.136.131:5000',
            PORT: 5000
        },
        SHARD1: {
            NAME: 'World-War',
            GAME: {
                HOST: 'http://192.168.136.131:5001',
                PORT: 5001
            },
            SYNC: {
                HOST: 'http://192.168.136.131:5002',
                PORT: 5002
            },
            BRIDGE1: {
                HOST: '192.168.136.131:5003',
                PORT: 5003
            },
            BRIDGE2: {
                HOST: '192.168.136.131:5004',
                PORT: 5003
            },
            BRIDGE3: {
                HOST: '192.168.136.131:5005',
                PORT: 5003
            }
        }
    },
    DB: 'mongodb://127.0.0.1:27017/MechaGotChi'
}