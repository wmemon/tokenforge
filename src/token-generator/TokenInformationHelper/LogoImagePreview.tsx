import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface LogoImPreview{
  image : string
}

export default function LogoImagePreview({image} : LogoImPreview){
    return (
        <Avatar>
        <AvatarImage src={image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    )
}