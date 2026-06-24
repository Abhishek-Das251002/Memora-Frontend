import { CloudUpload } from "lucide-react";
import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ImageUpload = ({id, onSuccess}) => {
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState("")
    const [tags, setTags] = useState([])
    const [people, setPeople] = useState([])
    const [isFav, setFav] = useState(false)

    const [currTag, setCurrTag] = useState("")
    const [currPerson, setCurrPerson] = useState("")

    async function handleImageUpload(e){
        e.preventDefault()

        toast.info("image is uploading please wait.")
        const formData = new FormData();

        formData.append("image", image);
        formData.append("name", imageName);
        formData.append("tags", JSON.stringify(tags))
        formData.append("person", JSON.stringify(people))
        formData.append("isFavorite", isFav)

        try {
            const uploadImgRes = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${id}/images`, formData, {
                withCredentials: true
            })

            console.log(uploadImgRes.data)
            if(uploadImgRes){
                toast.success("image uploaded successfully")
                setImage("")
                setImageName("")
                setTags([])
                setPeople([])
                setFav(false)
                onSuccess()
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content imgUploadModalContent">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">Upload Image</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleImageUpload}>
                <div className="modal-body imgUploadModalBody">
                    <div className="uploadImageInput text-center pt-4 text-secondary">
                        <CloudUpload size={45} style={{color: "#3d61ff"}}/><br/>
                        <input type="file" className="btn btn mt-3" style={{borderColor: "#3d61ff", color: "#3d61ff"}} onChange={(e) => setImage(e.target.files[0])} required/>
                        <p className="mt-2" style={{fontSize: "0.85rem"}}>JPG, JPEG, PNG, WEBP up to 5MB</p>
                    </div>
                    <label>Name:</label>
                    <input type="text" className="form-control" placeholder="Image name" value={imageName} onChange={(e) => setImageName(e.target.value)} required/>
                    <label className="my-2">Tags:</label><br />
                    {tags.map(tag => (
                        <button className="rounded-pill my-2 me-2 py-1 px-2" style={{background: "#f5f7ff", border: "solid #6c757d 1px"}}>
                            <span>{tag}< XIcon size={15} className="ms-1" onClick={() => setTags(tags.filter(tagToDel =>  tagToDel !== tag))}/></span>
                        </button>
                    ))}
                    <div className="row"style={{width: "100%", margin: "0px"}}>
                        <input type="text" className="col-9 py-1" placeholder="Add more tags..." style={{border: "1px solid #6c757d",borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", outline: "none"}} value={currTag} onChange={(e) => setCurrTag(e.target.value)}/>
                        <button className="col-3" type="button" style={{background: "#3d61ff", color: "#fff",border: "1px solid #3d61ff", borderTopRightRadius: "5px", borderBottomRightRadius: "5px"}} onClick={() => {setTags([...tags, currTag]); setCurrTag("")}}>Add Tag</button>
                    </div>
                    <label className="my-2">People in image:</label><br />
                    {people.map(person => (
                        <button className="rounded-pill my-2 me-2 py-1 px-2" style={{background: "#f5f7ff", border: "solid #6c757d 1px"}}>
                            <span>{person}< XIcon size={15} className="ms-1" onClick={() => setPeople(people.filter(personToDel =>  personToDel !== person))}/></span>
                        </button>
                    ))}
                    <div className="row"style={{width: "100%", margin: "0px"}}>
                        <input type="text" className="col-9 py-1" placeholder="Add person..." style={{border: "1px solid #6c757d",borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", outline: "none"}} value={currPerson} onChange={(e) => setCurrPerson(e.target.value)}/>
                        <button className="col-3" type="button" style={{background: "#3d61ff", color: "#fff",border: "1px solid #3d61ff", borderTopRightRadius: "5px", borderBottomRightRadius: "5px"}} onClick={() => {setPeople([...people, currPerson]); setCurrPerson("")}}>Add Person</button>
                    </div>
                    <span className="d-flex align-items-center mt-3">
                        <input type="checkbox" className="me-1" checked={isFav} onChange={(e) => setFav(e.target.checked)}/> Mark as favorite
                    </span>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn border border-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn" style={{background: "#3d61ff", color: "#fff"}} >Upload Image</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    )
}

export default ImageUpload;