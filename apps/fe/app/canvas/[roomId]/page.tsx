import RoomCanvas from "@/app/components/RoomCanvas"

const page =async ({params}:{params:{roomId:string}}) => {
    const roomId = (await params).roomId
    console.log(roomId)
    return <RoomCanvas roomId={roomId}/>
}

export default page
