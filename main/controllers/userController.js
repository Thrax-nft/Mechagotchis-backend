const models = require('../../models/index');
const SocketManager = require('../../common/manager/SocketManager');

exports.userLogin = async(req, res) => {
    try {
        const { walletAddress } = req.body;
        if(!walletAddress)
            return res.json({status: false, message: 'Invalid Request'});

        const server = SocketManager.getInstance().getServerSocket().getBestBridge();

        let user = await models.UserModel.findOne({wallet: walletAddress});
        if(user) 
            return res.json({status: true, userId: user._id, name: user.name, level: user.level, mech: user.character, weapons : user.weapons, socket: server});
        else 
            return res.json({status: true, userId: null});
    }
    catch(err) {
        console.error({title: 'userController => userLogin', message: err.message});
        return res.json({status: false, message: err.message});
    }
}

exports.userRegister = async(req, res) => {
    try {
        const { walletAddress, userName } = req.body;
        if(!walletAddress || !userName)
            return res.json({status: false, message: 'Invalid Request'});

        let user = await models.UserModel.findOne({wallet: walletAddress});
        if(user)
            return res.json({status: false, message: 'User Exists Already.'});

        const server = SocketManager.getInstance().getServerSocket().getBestBridge();

        user = await new models.UserModel({
            wallet : walletAddress,
            name: userName
        }).save();

        return res.json({status: true, userId: user._id, name: user.name, level: user.level, mech: user.character, weapons : user.weapons, socket: server});
    }
    catch(err) {
        console.error({title: 'userController => userRegister', message: err.message});
        return res.json({status: false, message: err.message});
    }
}