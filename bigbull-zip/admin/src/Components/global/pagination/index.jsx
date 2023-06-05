import './styles.css';
import ReactPaginate from 'react-paginate';
import ArrowLeftSvg from '../../../assets/svgs/ArrowLeft';
import ArrowRightSvg from '../../../assets/svgs/ArrowRight';
import { useDispatch } from 'react-redux';

const Pagination = ({ pageCount , setPage , currentPage }) => {
    const dispatch = useDispatch();
    const handlePageClick = ({ selected }) => {
        dispatch(setPage(selected+1))
    }

    return (
        <div className='max-w-full flex py-4 relative px-2'>
            <ReactPaginate
            breakLabel="..."
            nextLabel={<ArrowRightSvg />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<ArrowLeftSvg />}
            className='flex items-center gap-4 pagination'
            forcePage={currentPage-1}
            />
        </div>
    )
}

export default Pagination