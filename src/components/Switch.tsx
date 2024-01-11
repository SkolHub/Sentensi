'use client';

import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Switch, switchClasses } from '@mui/joy';

const CustomSwitch = ({
	checked,
	setChecked
}: {
	checked: boolean,
	setChecked: Dispatch<SetStateAction<boolean>>
}) => {
	return (
		<Switch
			checked={checked}
			onChange={(event: ChangeEvent<HTMLInputElement>) =>
				setChecked(event.target.checked)
			}

			sx={() => ({
				'--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
				'--Switch-thumbSize': '27px',
				'--Switch-trackWidth': '51px',
				'--Switch-trackHeight': '31px',
				'--Switch-trackBackground': 'rgba(61,71,86,0.2)',
				[`& .${switchClasses.thumb}`]: {
					transition: 'width 0.2s, left 0.2s',
				},
				'&:hover': {
					'--Switch-trackBackground': 'rgba(61,71,86,0.2)',
				},
				'&:active': {
					'--Switch-thumbWidth': '32px',
				},
				[`&.${switchClasses.checked}`]: {
					'--Switch-trackBackground': '#004B88',
					'&:hover': {
						'--Switch-trackBackground': '#004B88',
					},
				},
			})}
		/>
	);
};

export default CustomSwitch;
