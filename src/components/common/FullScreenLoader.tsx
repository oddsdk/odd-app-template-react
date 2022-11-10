import LoadingSpinner from './LoadingSpinner'

const FullScreenLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-104px)] w-full">
    <LoadingSpinner />
  </div>
)

export default FullScreenLoader
