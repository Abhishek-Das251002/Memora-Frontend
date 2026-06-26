import { useState } from "react";
import checkEmail from "../utils/verifyEmail";
import { toast } from "react-toastify";
import { XIcon } from "lucide-react";
import axios from "axios";

const ShareAlbum = ({albumToShare}) => {
    const [sharedUsers, setSharedUsers] = useState([])
    const [currEmail, setCurrEmail] = useState("")

    function makePill(value){
        const validEmail = checkEmail(value)

        if(validEmail){
            setSharedUsers([...sharedUsers, value])
            setCurrEmail("")
        }else{
            toast.error("Enter valid email address to share album.")
        }
    }

    async function shareAlbumToUsers(){
        try {
            const shareAlbum = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums/${albumToShare?._id}/share`, {sharedUsers: sharedUsers}, {
                withCredentials: true
            })

            if(shareAlbum){
                toast.success("Album Shared Successfully.")
                setSharedUsers([])
            }
        } catch (error) {
            if(error.response.status === 403){
                toast.warn("Only Album Owners are allowed to share album.")
            }else{
                console.error(error)
                toast.error("Error occured while sharing album.")
            }
        }
    }

    return (
    <div className="modal fade" id="staticBackdropShare" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-5" id="staticBackdropLabel">Share Album</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
            <label><strong>Album:</strong></label> <span>{albumToShare?.name}</span><br />
            <label><strong>Add people by email:</strong></label><br />
            <div className="row"style={{width: "100%", margin: "0px"}}>
                <input type="text" className="col-xl-9 col-md-9 col-8 py-1" placeholder="Enter email address and press Enter" style={{border: "1px solid #6c757d",borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", outline: "none"}} value={currEmail} onChange={(e) => setCurrEmail(e.target.value)}  onKeyDown={(e) => {e.key === "Enter" && makePill(e.target.value)}} required/>
                <button className="col-xl-3 col-md-3 col-4" type="button" style={{background: "#3d61ff", color: "#fff",border: "1px solid #3d61ff", borderTopRightRadius: "5px", borderBottomRightRadius: "5px"}} onClick={() => makePill(currEmail)}>Add</button>
            </div>
            <div className="d-flex flex-wrap">
                {sharedUsers.map(mail => (
                    <span className="me-2 py-1 px-2 mt-3" style={{background: "#EEEEEE", borderRadius: "5px"}}>{mail}<XIcon size={15} className="ms-1" onClick={() => setSharedUsers(sharedUsers.filter(email => email !== mail))} style={{cursor: "pointer"}}/></span>
                ))}
            </div>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn border border-2" data-bs-dismiss="modal">Cancel</button>
            <button type="button" className="btn btn" style={{background: "#3d61ff", color: "#fff"}} onClick={shareAlbumToUsers}>Share Album</button>
        </div>
        </div>
    </div>
    </div>
    )
}

export default ShareAlbum;