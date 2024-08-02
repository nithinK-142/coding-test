import logo from "../assets/logo.jpeg";

export default function Header() {
  return (
    <div className="w-[80%] mx-auto">
      <img src={logo} alt="aksharam logo" className="w-full" />
    </div>
  );
}
