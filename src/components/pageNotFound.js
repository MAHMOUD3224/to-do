export default function PageNotFound() {
    return (
        <div style={{
            width: '100%',
            height: 'calc(100% - 22px)',
            maxHeight: '100%',
        }}>
            <img src='/images/page-404.jpg' alt="404 Not Found" 
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                }}/> 
        </div>
    );
}