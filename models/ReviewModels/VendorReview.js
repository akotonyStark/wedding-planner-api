const { mongoose } = require("mongoose");

const vendor_review_schema = new mongoose.Schema({
    review: {
        type: String,
        trim: true,
        maxlength: 300,
    },
    reviewer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    vendor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Vendor'
    },
    reviewerName: String,
    avatar: String
    
}, { timestamps: true })


const VendorReview = mongoose.model('VendorReview', vendor_review_schema)
module.exports = VendorReview