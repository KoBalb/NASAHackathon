import "./HeadersStyle.css"

function Header({ children }: { children: React.ReactNode }) {
  return (
    <div className="head-title">
      <h1>{children}</h1>;
    </div>
  )
}

export default Header;