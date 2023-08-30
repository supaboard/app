const Skeleton = ({width, height , className, darkness = 100}) => {
	return (
	  <span className={`${ height ? "h-" + height : "h-8" } ${ width ? "w-" + width : "w-full" }  block items-center ${className}`}>
		<span className={`block w-full h-full rounded animate-pulse bg-gray-${darkness}`}></span>
	  </span>
	)
  }

  export default Skeleton
