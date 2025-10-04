import "./TextBlockStyle.css"

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="txt-block">
        {children}
    </div>
  )
}

export default TextBlock;


