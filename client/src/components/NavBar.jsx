import { NavLink } from "react-router";

const Navbar = () => {
  return (
    <div>
      <dialog className="modal" id="aboutDialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Rumor Party Line</h3>
          <p className="py-4">Let's spread some rumors!</p>
          <p className="py-1">
            <small>
              Created by pdromnt <br />
              Licensed under the MIT License <br />
              <a target="_blank" href="https://github.com/pdromnt/rumor-party-line">
                <u>GitHub</u>
              </a>
            </small>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <div className="navbar bg-base-300/95 backdrop-blur-sm sticky top-0 z-50 shadow">
        <div className="flex-1 px-2 lg:flex-none">
          <a className="text-lg font-bold">Rumor Party Line</a>
        </div>
        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-end">
              <div tabIndex="0" role="button" className="btn btn-ghost rounded-btn">Menu</div>
              <ul
                tabIndex="0"
                className="menu dropdown-content bg-base-300 rounded-box z-50 mt-4 w-52 p-2 shadow">
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              </ul>
            </div>
            <a className="btn btn-ghost rounded-btn" onClick={() => document.getElementById('aboutDialog').showModal()}>About</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;