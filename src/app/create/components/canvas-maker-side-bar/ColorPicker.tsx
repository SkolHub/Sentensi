import { useContext, useMemo, useRef } from 'react';
import { CreateContext } from '@/app/create/components/CreateContext';

const ColorPicker = () => {
	const { color, setColor, generalRef } = useContext(CreateContext)!;

	const colorPickerRef = useRef<HTMLInputElement>(null);

	const colorClick = (e: any) => {
		setColor(e.target.getAttribute('fill'));
		generalRef.current.action = 'color';
	};

	const openColorPicker = () => {
		colorPickerRef.current!.click();
	};

	return useMemo(
		() => (
			<div>
				<svg
					viewBox='45 45 225 225'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<g filter='url(#filter0_d_815_13)'>
						<mask id='path-1-inside-1_815_13' fill='white'>
							<path d='M268.584 157.085C268.584 183.296 259.35 208.67 242.503 228.75L157.084 157.085H268.584Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M268.584 157.085C268.584 183.296 259.35 208.67 242.503 228.75L157.084 157.085H268.584Z'
							fill='#8025DB'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-1-inside-1_815_13)'
						/>
						<mask id='path-2-inside-2_815_13' fill='white'>
							<path d='M242.499 228.756C225.651 248.835 202.267 262.336 176.454 266.89L157.085 157.085L242.499 228.756Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M242.499 228.756C225.651 248.835 202.267 262.336 176.454 266.89L157.085 157.085L242.499 228.756Z'
							fill='#07A807'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-2-inside-2_815_13)'
						/>
						<mask id='path-3-inside-3_815_13' fill='white'>
							<path d='M176.447 266.891C150.634 271.442 124.042 266.755 101.342 253.651L157.085 157.085L176.447 266.891Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M176.447 266.891C150.634 271.442 124.042 266.755 101.342 253.651L157.085 157.085L176.447 266.891Z'
							fill='#DE110D'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-3-inside-3_815_13)'
						/>
						<mask id='path-4-inside-4_815_13' fill='white'>
							<path d='M101.335 253.647C78.635 240.541 61.2781 219.858 52.3116 195.228L157.085 157.085L101.335 253.647Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M101.335 253.647C78.635 240.541 61.2781 219.858 52.3116 195.228L157.085 157.085L101.335 253.647Z'
							fill='#FF8A05'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-4-inside-4_815_13)'
						/>
						<mask id='path-5-inside-5_815_13' fill='white'>
							<path d='M52.3084 118.95C61.2732 94.3193 78.6287 73.6344 101.327 60.5272L157.084 157.085L52.3084 118.95Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M52.3084 118.95C61.2732 94.3193 78.6287 73.6344 101.327 60.5272L157.084 157.085L52.3084 118.95Z'
							fill='black'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-5-inside-5_815_13)'
						/>
						<mask id='path-6-inside-6_815_13' fill='white'>
							<path d='M52.3094 195.22C43.3446 170.59 43.3437 143.588 52.3068 118.957L157.085 157.085L52.3094 195.22Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M52.3094 195.22C43.3446 170.59 43.3437 143.588 52.3068 118.957L157.085 157.085L52.3094 195.22Z'
							fill='#8A4B15'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-6-inside-6_815_13)'
						/>
						<mask id='path-7-inside-7_815_13' fill='white'>
							<path d='M101.335 60.5228C124.035 47.4172 150.626 42.7275 176.439 47.2772L157.085 157.085L101.335 60.5228Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M101.335 60.5228C124.035 47.4172 150.626 42.7275 176.439 47.2772L157.085 157.085L101.335 60.5228Z'
							fill='#0086FF'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-7-inside-7_815_13)'
						/>
						<mask id='path-8-inside-8_815_13' fill='white'>
							<path d='M176.446 47.279C202.259 51.8305 225.643 65.3304 242.493 85.4082L157.084 157.085L176.446 47.279Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M176.446 47.279C202.259 51.8305 225.643 65.3304 242.493 85.4082L157.084 157.085L176.446 47.279Z'
							fill='#617FE8'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-8-inside-8_815_13)'
						/>
						<mask id='path-9-inside-9_815_13' fill='white'>
							<path d='M242.499 85.4141C259.347 105.493 268.583 130.866 268.585 157.077L157.085 157.085L242.499 85.4141Z' />
						</mask>
						<path
							onClick={colorClick}
							d='M242.499 85.4141C259.347 105.493 268.583 130.866 268.585 157.077L157.085 157.085L242.499 85.4141Z'
							fill='#808080'
							stroke='white'
							strokeWidth='2'
							mask='url(#path-9-inside-9_815_13)'
						/>
					</g>
					<g filter='url(#filter1_d_815_13)'>
						<circle
							onClick={openColorPicker}
							cx='157.584'
							cy='156.585'
							r='56'
							fill={color}
						/>
						<circle
							cx='157.584'
							cy='156.585'
							r='55'
							stroke='white'
							strokeWidth='2'
						/>
					</g>
					<path
						d='M175.857 182C171.919 182 168.714 178.751 168.714 174.759C168.714 171.044 171.914 167.46 173.634 165.536C173.843 165.301 174.024 165.099 174.156 164.943C174.365 164.694 174.626 164.494 174.921 164.357C175.215 164.219 175.536 164.148 175.861 164.148C176.186 164.148 176.507 164.219 176.802 164.357C177.096 164.494 177.357 164.694 177.566 164.943C177.692 165.089 177.859 165.278 178.052 165.493C179.782 167.424 183 171.019 183 174.762C183 178.751 179.796 182 175.857 182ZM173.874 159.304L148.055 133.699C146.965 132.611 145.488 132 143.948 132C142.408 132 140.931 132.611 139.841 133.699L139.337 134.202C138.219 135.302 137.582 136.8 137.564 138.368C137.56 139.134 137.708 139.893 138 140.601C138.292 141.309 138.723 141.951 139.266 142.491L143.899 147.123L134.451 156.554C133.984 157.022 133.615 157.58 133.365 158.193C133.116 158.806 132.992 159.463 133 160.125C133.006 160.771 133.142 161.409 133.401 162C133.66 162.592 134.036 163.125 134.507 163.567L149.154 177.629C150.072 178.509 151.295 178.999 152.567 178.995C153.838 178.991 155.059 178.495 155.971 177.609L169.823 164.185C170.073 163.936 170.394 163.769 170.741 163.706C171.181 163.636 171.627 163.604 172.073 163.61H172.106C172.606 163.611 173.094 163.463 173.509 163.186C173.924 162.908 174.247 162.513 174.437 162.051C174.626 161.589 174.674 161.081 174.574 160.591C174.474 160.102 174.23 159.654 173.874 159.304ZM146.426 144.595L141.79 139.961C141.582 139.754 141.417 139.507 141.304 139.236C141.192 138.964 141.134 138.673 141.134 138.379C141.134 138.086 141.192 137.795 141.304 137.523C141.417 137.252 141.582 137.005 141.79 136.798L142.366 136.223C142.574 136.015 142.821 135.85 143.093 135.737C143.365 135.625 143.656 135.567 143.951 135.567C144.245 135.567 144.536 135.625 144.808 135.737C145.08 135.85 145.327 136.015 145.535 136.223L150.188 140.84L146.426 144.595Z'
						fill='white'
					/>
				</svg>
				<input
					onChange={(event) => {
						setColor(event.target.value);
						generalRef.current.action = 'color';
					}}
					ref={colorPickerRef}
					style={{
						position: 'fixed',
						top: '1rem',
						right: '1rem',
						zIndex: -1
					}}
					type='color'
				/>
			</div>
		),
		[color]
	);
};

export default ColorPicker;
