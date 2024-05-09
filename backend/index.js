const express=require("express");
const multer = require("multer");
var docxConverter = require('docx-pdf');

const cors=require('cors')
let path=require('path')



const app=express();
app.use(cors())

const PORT=8000



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const upload=multer({storage:storage});


app.post("/convertfile",upload.single("file"),(req,resp,next)=>{
    try {
        if(!req.file)
        {
            return resp.status(400).json({message:"please upload the file"})
        }

         let outputpath=path.join(__dirname,"file",`${req.file.originalname}.pdf`)
        docxConverter(req.file.path,outputpath,function(err,result){
            if(err){
              console.log(err);
              return resp.status(500).json({message:"error in converting"})
            }
            resp.download(outputpath,()=>{
                console.log("file downloaded")
            })
          });
    } catch (error) {
        console.log(error)
       return  resp.status(500).json({message:"internal server error"});
    }
})


app.listen(PORT, () => 
    console.log(`Example app listening on PORT ${PORT}`)
  )