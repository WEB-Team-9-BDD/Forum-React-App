import './Sidebar.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function Sidebar({ categories, isOpen }) {

    return (
        <>
            <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
                <div>
                    <h4 className='sidebar-category-heading'>Categories</h4>
                    <hr className='new1'/>
                    <ul className='sidebar-categories'>
                        {categories.map((category) => {
                           return <li key={category.id} className='category-item'>
                                 <Link  to={category.path}>{category.title} </Link>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

Sidebar.propTypes = {
    categories: PropTypes.array,
    isOpen: PropTypes.bool,
}