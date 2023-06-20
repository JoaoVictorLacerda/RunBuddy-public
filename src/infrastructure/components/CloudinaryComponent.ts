import CloudinaryConfig from "../config/CloudinaryConfig";

export default class CloudinaryComponent {
    private cloudinary;

    constructor() {
        this.cloudinary = new CloudinaryConfig().config();
    }

    public async uploadImage(buffer: Buffer, clienteUuid:string): Promise<string>{
        return await new Promise((resolve, reject) => {

            const stream = this.cloudinary.uploader.upload_stream({
                    public_id: clienteUuid,
                    overwrite: true,
                    unique_filename: false,
                    resource_type: "auto"
                },
                (error:any, result:any) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                });

            stream.write(buffer);
            stream.end();
        });
    }

    public async deleteImage(imageName:string): Promise<boolean>{
        return await  new Promise((resolve, reject)=>{
            this.cloudinary.uploader.destroy(imageName, (error:any, result:any)=>{
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            })

        })
    }

    public async deleteFolder(imageName:string): Promise<boolean>{
        return await  new Promise((resolve, reject)=>{
            this.cloudinary.api.delete_resources_by_prefix(imageName, (error:any, result:any)=>{
                if (error) {
                    reject(error);
                } else {
                    this.cloudinary.api.delete_folder(imageName, (error:any, result:any)=>{
                        if (error) {
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    })
                    resolve(true);
                }
            })

        })
    }


}