import DataUriParser from "datauri/parser.js"
import path from "path"
const getDataUri = (file) =>{
  
    const parser = new DataUriParser();
    const extName = path.extname(file[0].originalname).toString();
    
    return parser.format(extName,file[0].buffer);
}
export default getDataUri;