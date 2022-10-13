exports.get404 = (req,res,next)=>{
    // res.status(404).send('<h1>Page Not Found</h1>');
    res.status(404).render('404',{pageTitle:"Page Not Found",path:'/404', isAuth:req.session.isLoggedIn});
    
 }
 
exports.get500 = (req,res,next)=>{
    // res.status(404).send('<h1>Page Not Found</h1>');
    res.status(500).render('500',{pageTitle:"500",path:'/500', isAuth:req.session?.isLoggedIn});
    
 }
 