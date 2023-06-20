import {v2 as cloudinaryV2} from "cloudinary";
import DotenvComponent from "../components/DotenvComponent";

export default class CloudinaryConfig {
    private cloudinary: any;

    constructor() {
        cloudinaryV2.config({
            cloud_name: DotenvComponent.CLOUDINARY_CLOUD_NAME,
            api_key: DotenvComponent.CLOUDINARY_API_KEY,
            api_secret: DotenvComponent.CLOUDINARY_API_SECRET
        });
        this.cloudinary = cloudinaryV2
    }

    public config(){
        return this.cloudinary;
    }
}