import { asyncHandler } from '../utils/asyncHandler.js';
import{ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { upload } from '../middlewares/multer.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
 // get user details from frontend
 //validation- not empty
 //check if user already exists:username,email
 // check for images,check for avatar
 // upload them to cloudinary, avatar
 //create user object- create entry in db
 //remove password and refresh token field from response
 //return res


 const {fullName,email,username,password}=req.body
 console.log("email:", email);

if(
    [fullName,email,username,password].some((field)=>
    field?.trim()==="")
){
    throw new ApiError(400, "All fields are required")
}
const existedUser= await User.findOne({
    $or: [{username},{email}]
})
if(existedUser){
    throw new ApiError(409, "User with given username or email already exists") 
}

// Safely read uploaded files. If the request was not sent as multipart/form-data
// or the file fields are missing, provide a clear error instead of throwing
// a generic "cannot read property of undefined" TypeError.
if (!req.files || !req.files.avatar) {
    throw new ApiError(
        400,
        'Avatar file is required. Send request as multipart/form-data with an image file in the "avatar" field'
    );
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

const avatar= await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)


if(!avatar){
    throw new ApiError(500, "Error while uploading avatar image")
}

const user=await User.create({
    fullName: fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url ||"",
    email,
    password,
    username: username.toLowerCase()
})

const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500, "Error while creating user")
}

return res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser));

})
export { registerUser };