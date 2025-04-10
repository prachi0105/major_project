const Listing = require("./models/listing.js");
const ExpressError= require("./utils/ExpressError.js");
const { lisitngSchema  , reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req , res,next) =>{
 //  console.log(req.path +"..."+req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
       // console.log(req.session);
        req.flash("error" , "you must be logged in to create listings ");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req , res ,next) => {
    if( req.session.redirectUrl ){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner = async (req , res , next) =>  {
    let {id} = req.params;
      let listing = await Listing.findById(id);
          if( ! listing.owner._id.equals(res.locals.currentUser._id)){
          req.flash("error" , "you are not the owner of these lisitng");
        return  res.redirect(`/listings/${id}`)

          } 
          next();
};

module.exports.validateListing = (req , res, next) => {
  let {error} =  lisitngSchema.validate(req.body);
 // console.log(result);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


module.exports. validateReview = (req , res, next) => {

    let {error} =  reviewSchema.validate(req.body);
   // console.log(result);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  }
  
  module.exports.isReviewAuthor = async (req , res , next) =>  {
    let {reviewId , id} = req.params;
      let review = await Review.findById(reviewId);
          if( ! review.author._id.equals(res.locals.currentUser._id)){
          req.flash("error" , "you are not the author of  these review");
        return  res.redirect(`/listings/${id}`)

          } 
          next();
};