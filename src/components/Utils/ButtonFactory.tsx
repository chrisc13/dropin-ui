
interface ButtonProps{
    title : string,
    type: string
}

export const ButtonFactory: React.FC<ButtonProps> = ({title}) =>{
    return <button>{title}</button>
}