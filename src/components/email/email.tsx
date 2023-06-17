
interface Props {
    heading: string;
}

const mailInbox: React.FC<Props> = ({ heading }) => {
  return (
    <div>
      <div className="bg-[#f6f8fc] p-4">
        {heading} 
      </div>
      <hr className='border-t-2 border-gray-300'/>
    </div>
  )
}

export default mailInbox;