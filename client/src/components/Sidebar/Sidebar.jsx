import './Sidebar.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { IoIosFitness } from "react-icons/io";



export default function Sidebar({ show }) {
    return (
        <>
            <div className={show ? 'sidebar active' : 'sidebar'}>
                <div>
                    <h4>Categories</h4>
                    <hr />
                    <ul className='sidebar-categories'>
                        <li className='category-item'>
                            <Link to='/fitness'>Fitness <IoIosFitness /> </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

Sidebar.propTypes = {
    show: PropTypes.bool,
}