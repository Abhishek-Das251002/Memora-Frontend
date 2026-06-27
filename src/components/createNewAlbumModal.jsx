import axios from "axios";
import { useState } from "react";
import useFetch from "../utils/fetchDetails";

const NewAlbumModal = ({onSuccess}) => {
    const {data: userData} = useFetch(`${import.meta.env.VITE_API_URL}/user/details`)

    const [albumInfo, setAlbumInfo] = useState({
        albumName: "",
        albumDes: "",
    })

    function handleAlbumInfo(e){
        const {name, value} = e.target;

        setAlbumInfo(prev => ({...prev, [name]: value}))
    }

    async function handleCreateAlbum(e){
        e.preventDefault();
        
        try {
            const newAlbum = await axios.post(`${import.meta.env.VITE_API_URL}/user/albums`, {name: albumInfo.albumName, description: albumInfo.albumDes, ownerId: userData._id}, {
                withCredentials: true
            })

            if(newAlbum){
                onSuccess()
            }

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Create New Album</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCreateAlbum}>
                <div class="modal-body">
                    <label className="mb-2">Album Name: </label>
                    <input type="text" className="form-control mb-3" placeholder="Enter album name" name="albumName" value={albumInfo.albumName} required onChange={handleAlbumInfo}/>
                    <label className="mb-2">Description (optional): </label>
                    <textarea type="text" className="form-control" placeholder="Enter album description" name="albumDes" value={albumInfo.albumDes} onChange={handleAlbumInfo}></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn border border-2" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    )
}

export default NewAlbumModal;