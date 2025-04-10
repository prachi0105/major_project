const Listing = require("../models/listing");

module.exports.index =  async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 };

 module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
 };

 module.exports.showListings= async (req,res) =>{
    let {id} = req.params;
      const  listing= await Listing.findById(id)
      .populate({
       path:"reviews" , 
       populate:{
       path:"author",
      },
      })
      .populate("owner");
        if(!listing){
         req.flash("error" , "Listing You requested does not exit !!");
       return  res.redirect("/listings");
        }
       // console.log(listing);
      res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async ( req , res , next ) =>{
  let url = req.file.path;
  let filename=req.file.filename;

  

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();

    req.flash("success" , "New Listing Created");
     res.redirect("/listings");
  }


 module.exports.renderEditForm =  async (req,res) =>{
       let {id} = req.params;
       const  listing= await Listing.findById(id);
       if(!listing){
        req.flash("error" , "Listing You requested does not exit !!");
        res.redirect("/listings");
       }
       let originalImageUrl = listing.image.url;
       originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

       res.render("listings/edit.ejs",{listing , originalImageUrl});
     }

     module.exports.updateListings =  async (req,res) =>{
          let {id} = req.params;
          let listing=  await Listing.findByIdAndUpdate(id ,{...req.body.listing});

          if( typeof req.file !== "undefined"){
            let url = req.file.path;
            let filename=req.file.filename;
          
             listing.image = {url,filename};
              await listing.save()
          }
         

           req.flash("success" , " Listing Updated");
              res.redirect(`/listings/${id}`)
        }

        module.exports.destroyListing  =  async (req,res) =>{
             let {id} = req.params;
             let deletedlisting =   await Listing.findByIdAndDelete(id);
                     console.log(deletedlisting);
                     req.flash("success" , "Listig Deleted");
        
                   res.redirect(`/listings`);
           }