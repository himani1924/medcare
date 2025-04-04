import passport from "passport";

export const isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next()
    }else{
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }
}

export const isAdmin = (req, res, next) =>{
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }else{
        return res.status(403).json({
            error: 'Forbidden'
        })
    }
}