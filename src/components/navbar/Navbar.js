import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { ClickAwayListener } from '@mui/material';
import { Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import barra from '../../assets/dls_barra.png' 
import { useUserContext } from '../../context/UserContext';
export default function Navbar() {

    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const {nombre, apellido, logout} = useUserContext();

    const [userButtonOpen, setUserButtonOpen] = useState(false);


    const handleMenuClick = () => {
      setOpen(!open)
    }
  
    const handleOut = () => {
      open && setOpen(false)
    }

    const handleUserButtonClick = () => {
      setUserButtonOpen(!userButtonOpen)
    }

    const handleLogout = () => {
      handleUserButtonClick()
      logout(true)
      navigate("/login")
    }
  
    return (
      <div>
        <nav className="navbar" >

            {/* Logo  */}
            <Link className='text-xl md:text-2xl font-semibold cursor-pointer' to={"/"}>
              <div className='logo h-[60px] my-auto flex flex-row'>
                <div className='w-8 rounded-[10px] overflow-hidden absolute flex h-[60px]'>
                  <img className='h-full w-2 m-0' src={barra} alt=''/>
                </div>
                {/* <div className='flex w-[90px]'>
                  <img src={""} alt='Logo ' /> 
                </div> */}

                <h1 className='lg:flex hidden my-auto ml-7'>
                  ATS Digital - Gestión de cuestionarios               
                </h1>
                
                <h1 className='lg:hidden flex my-auto ml-7'>
                  ATS Digital - Gestión de cuestionarios                   
                </h1>
              </div>
            </Link>


            {/* ITEMS */}
            <div className="hidden my-auto mr-5 ml-auto w-auto md:flex">
                <ul className="flex flex-row my-auto gap-5 text-md">
                    {/* <li className='flex my-auto'>
                        <Link to={"/"}>
                            <div className='heffect text-lg'>Grilla</div>
                        </Link>
                    </li>
                    <li className='flex my-auto'>
                        <Link to={"/importar"}>
                            <div className='heffect text-lg'>Importar Datos</div>
                        </Link>
                    </li> */}
                    <li className='flex my-auto relative'>
                      <Button onClick={handleUserButtonClick} sx={{color:'white'}} 
                          className='flex heffect flex-row gap-2'>
                          <AccountCircleIcon/> 
                          {(nombre!=="") && 
                            <div className='flex my-auto'>
                              {nombre + " " + apellido}
                            </div>
                          }
                      </Button>
                      {userButtonOpen && 
                        <ClickAwayListener onClickAway={handleUserButtonClick}>
                          <div className='user-actions absolute w-full min-w-[60px] bg-gray-600 top-full mt-1 p-2 z-10'>
                            <ul className="flex flex-col mx-auto gap-5 text-md">
                              <li className='flex heffect mx-auto  '>
                                  <div onClick={handleLogout}>
                                    <div>Cerrar Sesión</div>
                                  </div>
                              </li>
                            </ul>
                          </div>
                        </ClickAwayListener>
                      } 
                    </li>
                </ul>
            </div>

            {/* Hamburger  */}
          <div onClick={handleMenuClick} className='md:hidden my-auto mr-5 ml-auto transition duration-300 ease-in-out hover:bg-slate-200 rounded-md cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" className="flex m-auto w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path className={`${open ? "fade" : "appear"}`} 
              strokeLinecap="round" strokeLinejoin="round"  d="M4 6h16M4 12h16M4 18h16" />
              <path className={`${!open ? " fade" : "appear"}`}
              strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
                      
            {/* Hamburger Menu items  */}
          <div onMouseLeave={handleOut} className={`absolute md:hidden h-screen w-2/3 transition-all z-10 ${open ? "left-1/3" : "left-full"} bg-slate-100`} style={{top:"60px"}}>
            <ul  className="flex flex-col mt-12 ml-12 mr-6 gap-5 text-lg text-black">
              {/* <li onClick={handleMenuClick} className='flex heffect '>
                <Link to={"/"}>
                  seccion
                </Link>
              </li>
              <li onClick={handleMenuClick} className='flex heffect'>
                <Link to={"/"}>
                  seccion
                </Link>
              </li> */}
            </ul>
          </div>

          <div onClick={handleMenuClick} className={`absolute md:hidden h-screen w-screen transition-all ${open ? "visible opacity-70" : "invisible opacity-0"} bg-slate-300`} style={{top:"60px"}}>
          </div>
  
        </nav>


        <div className='w-full' style={{height:'70px'}}> 
        </div>
  
      </div>
    )
  
  }
