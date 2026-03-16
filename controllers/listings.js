const Listing = require("../models/listings.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs")
}

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist")
        return res.redirect("/listings")  // ✅ Added 'return' here
    }
    console.log(listing)
    res.render("listings/show.ejs", { listing })
}

// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     console.log(url,"..", filename)
    // if(!req.body.Listing){
    //     throw new ExpressError(404,"send the valid data for listings")
    // }
    // try{
    // let {title,description,price,image,country,location} = req.body;
    // More simpler way of writing the same line of the code, is to make the all the price, decription and all make them a object, key value pair.
    // let newlisting = new Listing(req.body.Listing);
    // now there is also a more esaier way of doing the schema validation, so image you have to validate the lot of validations so for that we can not use the if-else statements , do for that we can the joi. 
    // if(!newlisting.description){
    //     throw new ExpressError(400,"Description is missing")
    // }
    //     if(!newlisting.location){
    //     throw new ExpressError(400,"Location is missing")
    // }
    //     if(!newlisting.title){
    //     throw new ExpressError(400,"Title is missing")
    // }

    // Validation using joi ; Shifted in line 41
//     newlisting.owner = req.user._id;
//     newlisting.image = {url, filename}
//     await newlisting.save();
//     req.flash("success", "New Listing created !");
//     res.redirect("/listings")
//     // }catch{
//     //     next(err)
//     // }

// };


// The Falwback was that in the above function is that it was not using the default image,
// New CreateListing

module.exports.createListing =  async(req, res,)=>{
    let newlisting  = new Listing(req.body.Listing);
    newlisting.owner =  req.user._id;

    if(req.file){
        newlisting.image ={
            url: req.file.path,
            filename:req.file.filename,
        };
    }

    //  if now file , schema default url is used automatically ;
      
    await newlisting.save();
    req.flash("Success", "New Listing Created ")
    res.redirect("/listings")

}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist")
        return res.redirect("/listings")  // ✅ Added 'return' here
    }

    // Add owner validation =>middleware.js
    let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing , originalImageUrl})
}

module.exports.updateListing = async (req, res) => {
    if (!req.body.Listing) {
        throw new ExpressError(404, "Send valid data for listing")
    }
    let { id } = req.params;
    // const listing = await Listing.findById(id);
    // if (!listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You don't have permission to modify this listing");
    //     return res.redirect(`/listings/${id}`);
    // }
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
     if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
   await listing.save();
}

    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`)
}

module.exports.destoryListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    // if (!listing.owner.equals(req.user._id)) {
    //     req.flash("error", "You don't have permission to delete this listing");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}